import { ROUTES } from "@/constants/routes";
import api from "./api";
import type {
  ApiResponse,
  LoginCredentials,
  RegisterData,
  SendOtpData,
  User,
  VerifyOtpData,
  VerifyOtpResponse,
} from "./types";

export const login = async (
  credentials: LoginCredentials,
): Promise<ApiResponse<{ user: User }>> => {
  return (await api.post(ROUTES.API.LOGIN, credentials)).data;
};

export const register = async (
  data: RegisterData,
): Promise<ApiResponse<{ user: User }>> => {
  return (await api.post(ROUTES.API.REGISTER, data)).data;
};

export const sendOtp = async (
  data: SendOtpData,
): Promise<ApiResponse<{ message: string }>> => {
  return (await api.post(ROUTES.API.SEND_OTP, data)).data;
};

export const verifyOtp = async (
  data: VerifyOtpData,
): Promise<VerifyOtpResponse> => {
  const response = await api.post(ROUTES.API.VERIFY_OTP, data);
  const payload = response.data;
  return payload as VerifyOtpResponse;
};

export const resetPassword = async (
  email: string,
  newPassword: string,
): Promise<ApiResponse> => {
  return (await api.post(ROUTES.API.RESET_PASSWORD, { email, newPassword }))
    .data;
};

export const getCurrentUser = async (): Promise<
  ApiResponse<{ user: User }>
> => {
  return (await api.get(ROUTES.API.CURRENT_USER)).data;
};

export const logout = async (): Promise<void> => {
  await api.post(ROUTES.API.LOGOUT);
};
