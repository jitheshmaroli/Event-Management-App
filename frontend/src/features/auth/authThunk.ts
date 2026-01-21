/* eslint-disable @typescript-eslint/no-explicit-any */
import { createAsyncThunk } from "@reduxjs/toolkit";
import {
  getCurrentUser,
  login,
  logout,
  register,
  sendOtp,
  verifyOtp,
  resetPassword,
} from "@/lib/auth";
import type { OtpPurpose, SendOtpData, User } from "@/lib/types";
import { resetAuth } from "./authSlice";

export const checkCurrentUser = createAsyncThunk<User | null>(
  "auth/checkCurrentUser",
  async (_, { rejectWithValue }) => {
    try {
      const res = await getCurrentUser();
      return res?.data?.user ?? null;
    } catch (err: any) {
      if (err.response?.status === 401 || err.response?.status === 403) {
        return null;
      }
      return rejectWithValue(err.response?.data?.message || "Session expired");
    }
  },
);

export const loginUser = createAsyncThunk(
  "auth/login",
  async (
    credentials: { email: string; password: string },
    { rejectWithValue },
  ) => {
    try {
      await login(credentials);
      const res = await getCurrentUser();
      const user = res?.data?.user;
      if (!user) throw new Error("No user data after login");
      return user;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || "Login failed");
    }
  },
);

export const registerUser = createAsyncThunk<
  void,
  { name: string; email: string; password: string; phone?: string },
  { rejectValue: string }
>("auth/register", async (data, { rejectWithValue }) => {
  try {
    await register(data);
    return;
  } catch (err: any) {
    return rejectWithValue(
      err.response?.data?.message || "Registration failed. Please try again.",
    );
  }
});

export const sendOtpThunk = createAsyncThunk<
  void,
  SendOtpData,
  { rejectValue: string }
>("auth/sendOtp", async (data, { rejectWithValue }) => {
  try {
    await sendOtp(data);
  } catch (err: any) {
    return rejectWithValue(
      err.response?.data?.message || "Failed to send OTP. Try again.",
    );
  }
});

export type VerifyOtpResult =
  | { purpose: "signup"; user: User }
  | { purpose: "forgot_password"; message: string };

export const verifyOtpThunk = createAsyncThunk<
  VerifyOtpResult,
  { email: string; otp: string; purpose: OtpPurpose },
  { rejectValue: string }
>("auth/verifyOtp", async ({ email, otp, purpose }, { rejectWithValue }) => {
  try {
    const data = await verifyOtp({ email, otp, purpose });

    console.log("Raw verifyOtp response:", data);

    if (purpose === "forgot_password") {
      // Forgot password response
      if ("message" in data && typeof data.message === "string") {
        return { purpose: "forgot_password", message: data.message };
      } else {
        throw new Error("Unexpected response format for forgot_password");
      }
    } else {
      // Signup response
      if (data.data) {
        return { purpose: "signup", user: data.data };
      } else {
        throw new Error("Verification succeeded but no user data returned");
      }
    }
  } catch (err: any) {
    console.error("verifyOtp error:", err);
    return rejectWithValue(
      err.response?.data?.message ||
        err.message ||
        "Invalid or expired OTP. Please try again.",
    );
  }
});

export const resetPasswordThunk = createAsyncThunk<
  void,
  { email: string; newPassword: string },
  { rejectValue: string }
>("auth/resetPassword", async ({ email, newPassword }, { rejectWithValue }) => {
  try {
    await resetPassword(email, newPassword);
  } catch (err: any) {
    return rejectWithValue(
      err.response?.data?.message || "Failed to reset password.",
    );
  }
});

export const logoutUser = createAsyncThunk(
  "auth/logout",
  async (_, { dispatch }) => {
    await logout();
    dispatch(resetAuth());
  },
);
