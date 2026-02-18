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
  return (await api.post("/auth/login", credentials)).data;
};

export const register = async (
  data: RegisterData,
): Promise<ApiResponse<{ user: User }>> => {
  return (await api.post("/auth/register", data)).data;
};

export const sendOtp = async (
  data: SendOtpData,
): Promise<ApiResponse<{ message: string }>> => {
  return (await api.post("/auth/send-otp", data)).data;
};

export const verifyOtp = async (
  data: VerifyOtpData,
): Promise<VerifyOtpResponse> => {
  const response = await api.post("/auth/verify-otp", data);
  const payload = response.data;
  return payload as VerifyOtpResponse;
};

export const resetPassword = async (
  email: string,
  newPassword: string,
): Promise<ApiResponse> => {
  return (await api.post("/auth/reset-password", { email, newPassword })).data;
};

export const getCurrentUser = async (): Promise<
  ApiResponse<{ user: User }>
> => {
  return (await api.get("/auth/me")).data;
};

export const logout = async (): Promise<void> => {
  await api.post("/auth/logout");
};
