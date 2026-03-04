/* eslint-disable @typescript-eslint/no-explicit-any */
import type { OTP_PURPOSE } from "@/constants/otpPurpose";
import type { Role } from "@/constants/roles";

export interface User {
  userId: string;
  name: string;
  email: string;
  phone?: string;
  role: Role;
  isVerified: boolean;
  createdAt?: string;
}

export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  errors?: string[];
}

export interface LoginCredentials {
  email: string;
  password: string;
  loginType: Role;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  phone?: string;
}

export type OtpPurpose = (typeof OTP_PURPOSE)[keyof typeof OTP_PURPOSE];

export interface SendOtpData {
  email: string;
  purpose: OtpPurpose;
}

export interface VerifyOtpData {
  email: string;
  otp: string;
  purpose: OtpPurpose;
}

export interface VerifyEmailState {
  email: string;
  purpose: OtpPurpose;
}

export type ResetPasswordState = {
  email: string;
};

export interface SignupVerifyResponse {
  success: boolean;
  message?: string;
  data?: User;
}

export type VerifyOtpResponse = SignupVerifyResponse;
