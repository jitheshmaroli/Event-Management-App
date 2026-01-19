/* eslint-disable @typescript-eslint/no-explicit-any */
import type { OTP_PURPOSE } from "@/constants/otpPurpose";

export interface User {
  userId: string;
  name: string;
  email: string;
  phone?: string;
  role: "user" | "admin";
  isVerified: boolean;
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
}

export interface VerifyEmailState {
  email: string;
  purpose: OtpPurpose;
}
