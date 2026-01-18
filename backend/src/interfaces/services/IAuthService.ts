import { OtpPurpose } from '@/constants/otpPurpose';
import { LoginInput, LoginResponse } from '@/dtos/auth/LoginDto';
import { RegisterInput, RegisterResponse } from '@/dtos/auth/RegisterDto';

export interface IAuthService {
  register(data: RegisterInput): Promise<RegisterResponse>;
  resendOtp(email: string, purpose: OtpPurpose): Promise<{ message: string }>;
  verifyOTP(email: string, otp: string): Promise<LoginResponse>;
  login(credentials: LoginInput): Promise<LoginResponse>;
  logout(userId: string): Promise<{ message: string }>;
  forgotPassword(email: string): Promise<{ message: string }>;
  resetPassword(
    email: string,
    otp: string,
    newPassword: string
  ): Promise<{ message: string }>;
  refreshToken(
    refreshToken: string
  ): Promise<{ accessToken: string; refreshToken: string }>;
}
