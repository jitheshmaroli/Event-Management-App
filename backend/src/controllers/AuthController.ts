import { Request, Response, NextFunction } from 'express';
import { inject, injectable } from 'inversify';
import { IAuthService } from '@/interfaces/services/IAuthService';
import { setAuthCookies } from '@/utils/cookie.utils';
import { TYPES } from '@/inversify/types';
import { HTTP_STATUS } from '@/constants/httpStatusCode';
import { MESSAGES } from '@/constants/messages';
import { successResponse } from '@/utils/response';

@injectable()
export class AuthController {
  constructor(@inject(TYPES.AuthService) private authService: IAuthService) {}

  async register(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await this.authService.register(req.body);
      return successResponse(
        res,
        MESSAGES.USER.CREATED,
        result,
        HTTP_STATUS.CREATED
      );
    } catch (error) {
      next(error);
    }
  }

  async verifyOTP(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, otp } = req.body;

      const result = await this.authService.verifyOTP(email, otp);

      setAuthCookies(res, result.accessToken, result.refreshToken);

      return successResponse(res, MESSAGES.USER.VERIFIED, result.user);
    } catch (error) {
      next(error);
    }
  }

  async login(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await this.authService.login(req.body);

      setAuthCookies(res, result.accessToken, result.refreshToken);

      return successResponse(res, MESSAGES.AUTH.LOGIN_SUCCESS, result.user);
    } catch (error) {
      next(error);
    }
  }

  async resendOtp(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, purpose } = req.body;
      const result = await this.authService.resendOtp(email, purpose);

      return successResponse(res, result.message);
    } catch (error) {
      next(error);
    }
  }

  async forgotPassword(req: Request, res: Response, next: NextFunction) {
    try {
      const { email } = req.body;
      const result = await this.authService.forgotPassword(email);
      return successResponse(res, result.message);
    } catch (error) {
      next(error);
    }
  }

  async resetPassword(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, otp, newPassword } = req.body;
      const result = await this.authService.resetPassword(
        email,
        otp,
        newPassword
      );
      return successResponse(res, MESSAGES.USER.PASSWOR_RESET_SUCCESS, result);
    } catch (error) {
      next(error);
    }
  }
}
