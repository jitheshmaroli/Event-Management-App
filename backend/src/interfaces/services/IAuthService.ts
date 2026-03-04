import { OtpPurpose } from '@/constants/otpPurpose';
import { LoginInput, LoginResponse } from '@/dtos/auth/login.dto';
import { RegisterInput, RegisterResponse } from '@/dtos/auth/register.dto';
import { UserDto } from '@/dtos/auth/user.dto';

export interface IAuthService {
  register(data: RegisterInput): Promise<RegisterResponse>;
  sendOtp(email: string, purpose: OtpPurpose): Promise<{ message: string }>;
  verifyOTP(
    email: string,
    otp: string
  ): Promise<LoginResponse | { message: string }>;
  login(credentials: LoginInput): Promise<LoginResponse>;
  logout(userId: string): Promise<{ message: string }>;
  resetPassword(
    email: string,
    newPassword: string
  ): Promise<{ message: string }>;
  refreshToken(
    refreshToken: string
  ): Promise<{ accessToken: string; refreshToken: string }>;
  getCurrentUser(userId: string): Promise<{ user: UserDto }>;
}
