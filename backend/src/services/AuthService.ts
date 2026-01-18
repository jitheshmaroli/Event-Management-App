import { injectable, inject } from 'inversify';
import { IUserRepository } from '@/interfaces/repositories/IUserRepository';
import { IAuthService } from '@/interfaces/services/IAuthService';
import { generateOTP, isOTPExpired } from '@/utils/otp.utils';
import { sendOTPEmail } from '@/utils/email';
import { TYPES } from '@/inversify/types';
import { RegisterInput, RegisterResponse } from '@/dtos/auth/RegisterDto';
import { LoginInput, LoginResponse } from '@/dtos/auth/LoginDto';
import {
  BadRequestError,
  ConflictError,
  ForbiddenError,
  NotFoundError,
  UnauthorizedError,
} from '@/utils/errors';
import { ERROR_CODES, MESSAGES } from '@/constants/messages';
import { comparePassword, hashPassword } from '@/utils/password.utils';
import {
  generateAccessToken,
  generateRefreshToken,
  RefreshPayload,
  verifyRefreshToken,
} from '@/utils/jwt';
import { OtpPurpose } from '@/constants/otpPurpose';
import { IUser } from '@/models/User';

@injectable()
export class AuthService implements IAuthService {
  constructor(
    @inject(TYPES.UserRepository) private _userRepo: IUserRepository
  ) {}

  async register({
    name,
    email,
    password,
  }: RegisterInput): Promise<RegisterResponse> {
    const existing = await this._userRepo.findByEmail(email);
    if (existing) {
      throw new ConflictError(
        MESSAGES.USER.ALREADY_EXISTS,
        ERROR_CODES.EMAIL_ALREADY_EXISTS
      );
    }

    const hashed = await hashPassword(password);
    const otp = generateOTP();

    const user = await this._userRepo.create({
      name,
      email,
      password: hashed,
      otp,
      otpCreatedAt: new Date(),
      isVerified: false,
    });

    await sendOTPEmail(email, otp, OtpPurpose.SIGNUP, name);

    return {
      userId: user._id.toString(),
    };
  }

  async resendOtp(
    email: string,
    purpose: OtpPurpose
  ): Promise<{ message: string }> {
    const user = await this._userRepo.findByEmail(email);
    if (!user)
      throw new NotFoundError(
        MESSAGES.USER.NOT_FOUND,
        ERROR_CODES.USER_NOT_FOUND
      );

    this._validateOtpPurpose(user, purpose);

    const otp = generateOTP();

    await this._userRepo.updateById(user._id.toString(), {
      otp: otp,
      otpCreatedAt: new Date(),
      otpPurpose: purpose,
    });

    await sendOTPEmail(email, otp, purpose, user.name);

    return {
      message: MESSAGES.OTP.SENT,
    };
  }

  async verifyOTP(email: string, otp: string): Promise<LoginResponse> {
    const user = await this._userRepo.findByEmail(email);
    if (!user)
      throw new NotFoundError(
        MESSAGES.USER.NOT_FOUND,
        ERROR_CODES.USER_NOT_FOUND
      );

    if (
      !user.otp ||
      !user.otpCreatedAt ||
      user.otp !== otp ||
      isOTPExpired(user.otpCreatedAt)
    ) {
      throw new BadRequestError(MESSAGES.OTP.INVALID, ERROR_CODES.OTP_INVALID);
    }

    await this._userRepo.updateById(user._id.toString(), {
      isVerified: true,
      otp: undefined,
      otpCreatedAt: undefined,
    });

    const accessToken = generateAccessToken({
      userId: user._id.toString(),
      email: user.email,
      role: user.role,
    });

    const refreshToken = generateRefreshToken({ userId: user._id.toString() });

    const hashedRefresh = await hashPassword(refreshToken);

    await this._userRepo.updateById(user._id.toString(), {
      refreshToken: hashedRefresh,
    });

    return {
      accessToken,
      refreshToken,
      user: {
        userId: user._id.toString(),
        name: user.name,
        email: user.email,
        role: user.role,
      },
    };
  }

  async login(credentials: LoginInput): Promise<LoginResponse> {
    const user = await this._userRepo.findByEmail(credentials.email);
    if (!user)
      throw new UnauthorizedError(
        MESSAGES.USER.INVALID_CREDENTIALS,
        ERROR_CODES.INVALID_CREDENTIALS
      );

    if (!user.isVerified)
      throw new ForbiddenError(
        MESSAGES.USER.EMAIL_NOT_VERIFIED,
        ERROR_CODES.EMAIL_NOT_VERIFIED
      );

    const isMatch = await comparePassword(credentials.password, user.password);

    if (!isMatch)
      throw new UnauthorizedError(
        MESSAGES.USER.INVALID_CREDENTIALS,
        ERROR_CODES.INVALID_CREDENTIALS
      );

    const accessToken = generateAccessToken({
      userId: user._id.toString(),
      email: user.email,
      role: user.role,
    });

    const refreshToken = generateRefreshToken({ userId: user._id.toString() });

    const hashedRefresh = await hashPassword(refreshToken);

    await this._userRepo.updateById(user._id.toString(), {
      refreshToken: hashedRefresh,
    });

    return {
      accessToken,
      refreshToken,
      user: {
        userId: user._id.toString(),
        name: user.name,
        email: user.email,
        role: user.role,
      },
    };
  }

  async logout(userId: string): Promise<{ message: string }> {
    await this._userRepo.updateById(userId, {
      refreshToken: undefined,
    });

    return { message: MESSAGES.AUTH.LOGOUT_SUCCESS };
  }

  async forgotPassword(email: string): Promise<{ message: string }> {
    const user = await this._userRepo.findByEmail(email);
    if (!user) {
      return { message: MESSAGES.AUTH.OTP_SENT_IF_EMAIL_EXISTS };
    }
    const otp = generateOTP();

    await this._userRepo.updateById(user._id.toString(), {
      otp,
      otpCreatedAt: new Date(),
    });

    await sendOTPEmail(email, otp, OtpPurpose.FORGOT_PASSWORD, user.name);

    return { message: MESSAGES.OTP.SENT };
  }

  async resetPassword(
    email: string,
    otp: string,
    newPassword: string
  ): Promise<{ message: string }> {
    const user = await this._userRepo.findByEmail(email);
    if (!user)
      throw new NotFoundError(
        MESSAGES.USER.NOT_FOUND,
        ERROR_CODES.USER_NOT_FOUND
      );

    if (
      !user.otp ||
      !user.otpCreatedAt ||
      user.otp !== otp ||
      isOTPExpired(user.otpCreatedAt)
    ) {
      throw new BadRequestError(MESSAGES.OTP.INVALID, ERROR_CODES.OTP_INVALID);
    }

    const hashed = await hashPassword(newPassword);

    await this._userRepo.updateById(user._id.toString(), {
      password: hashed,
      otp: undefined,
      otpCreatedAt: undefined,
    });

    return { message: MESSAGES.USER.PASSWORD_RESET_SUCCESS };
  }

  async refreshToken(
    refreshToken: string
  ): Promise<{ accessToken: string; refreshToken: string }> {
    if (!refreshToken) {
      throw new UnauthorizedError(
        MESSAGES.AUTH.TOKEN_EXPIRED,
        ERROR_CODES.INVALID_TOKEN
      );
    }

    let decoded: RefreshPayload;
    try {
      decoded = verifyRefreshToken(refreshToken);
    } catch {
      throw new UnauthorizedError(
        MESSAGES.AUTH.TOKEN_EXPIRED,
        ERROR_CODES.INVALID_TOKEN
      );
    }

    const user = await this._userRepo.findById(decoded.userId);

    if (!user || !user.refreshToken) {
      throw new UnauthorizedError(
        MESSAGES.AUTH.TOKEN_EXPIRED,
        ERROR_CODES.INVALID_TOKEN
      );
    }

    const isValid = await comparePassword(refreshToken, user.refreshToken);

    if (!isValid) {
      await this._userRepo.updateById(user._id.toString(), {
        refreshToken: undefined,
      });
      throw new UnauthorizedError(
        MESSAGES.AUTH.TOKEN_EXPIRED,
        ERROR_CODES.INVALID_TOKEN
      );
    }
    const newAccessToken = generateAccessToken({
      userId: user._id.toString(),
      email: user.email,
      role: user.role,
    });

    const newRefreshToken = generateRefreshToken({
      userId: user._id.toString(),
    });

    const hashedRefresh = await hashPassword(newRefreshToken);

    await this._userRepo.updateById(user._id.toString(), {
      refreshToken: hashedRefresh,
    });

    return {
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
    };
  }

  private _validateOtpPurpose(user: IUser, purpose: OtpPurpose) {
    if (purpose === OtpPurpose.SIGNUP && user.isVerified) {
      throw new BadRequestError(
        MESSAGES.USER.EMAIL_ALREADY_VERIFIED,
        ERROR_CODES.EMAIL_ALREADY_VERIFIED
      );
    }

    if (purpose === OtpPurpose.FORGOT_PASSWORD && !user.isVerified) {
      throw new BadRequestError(
        MESSAGES.USER.EMAIL_NOT_VERIFIED,
        ERROR_CODES.EMAIL_NOT_VERIFIED
      );
    }
  }
}
