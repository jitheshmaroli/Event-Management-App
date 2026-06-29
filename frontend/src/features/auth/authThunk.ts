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
import type { Role } from "@/constants/roles";
import { OTP_PURPOSE } from "@/constants/otpPurpose";
import { AUTH_ACTIONS } from "@/constants/thunk.constants";
import { getErrorMessage } from "@/lib/errorMessage";

export const checkCurrentUser = createAsyncThunk(
  AUTH_ACTIONS.CHECK_CURRENT_USER,
  async (_, { rejectWithValue }) => {
    try {
      const res = await getCurrentUser();
      return res?.data?.user ?? null;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  },
);

export const loginUser = createAsyncThunk(
  AUTH_ACTIONS.LOGIN,
  async (
    credentials: { email: string; password: string; loginType: Role },
    { rejectWithValue },
  ) => {
    try {
      await login(credentials);
      const res = await getCurrentUser();
      const user = res?.data?.user;
      if (!user) throw new Error("No user data after login");
      return user;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  },
);

export const registerUser = createAsyncThunk<
  void,
  { name: string; email: string; password: string; phone?: string },
  { rejectValue: string }
>(AUTH_ACTIONS.REGISTER, async (data, { rejectWithValue }) => {
  try {
    await register(data);
    return;
  } catch (error) {
    return rejectWithValue(getErrorMessage(error));
  }
});

export const sendOtpThunk = createAsyncThunk<
  void,
  SendOtpData,
  { rejectValue: string }
>(AUTH_ACTIONS.SEND_OTP, async (data, { rejectWithValue }) => {
  try {
    await sendOtp(data);
  } catch (error) {
    return rejectWithValue(getErrorMessage(error));
  }
});

export type VerifyOtpResult =
  | { purpose: "signup"; user: User }
  | { purpose: "forgot_password"; message: string };

export const verifyOtpThunk = createAsyncThunk<
  VerifyOtpResult,
  { email: string; otp: string; purpose: OtpPurpose },
  { rejectValue: string }
>(
  AUTH_ACTIONS.VERIFY_OTP,
  async ({ email, otp, purpose }, { rejectWithValue }) => {
    try {
      const data = await verifyOtp({ email, otp, purpose });

      if (purpose === OTP_PURPOSE.FORGOT_PASSWORD) {
        // Forgot password response
        if ("message" in data && typeof data.message === "string") {
          return {
            purpose: OTP_PURPOSE.FORGOT_PASSWORD,
            message: data.message,
          };
        } else {
          throw new Error("Unexpected response format for forgot_password");
        }
      } else {
        // Signup response
        if (data.data) {
          return { purpose: OTP_PURPOSE.SIGNUP, user: data.data };
        } else {
          throw new Error("Verification succeeded but no user data returned");
        }
      }
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  },
);

export const resetPasswordThunk = createAsyncThunk<
  void,
  { email: string; newPassword: string },
  { rejectValue: string }
>(
  AUTH_ACTIONS.RESET_PASSWORD,
  async ({ email, newPassword }, { rejectWithValue }) => {
    try {
      await resetPassword(email, newPassword);
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  },
);

export const logoutUser = createAsyncThunk(
  AUTH_ACTIONS.LOGOUT,
  async (_, { dispatch }) => {
    await logout();
    dispatch(resetAuth());
  },
);
