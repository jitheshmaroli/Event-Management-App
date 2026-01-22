import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { User } from "@/lib/types";
import {
  checkCurrentUser,
  loginUser,
  logoutUser,
  registerUser,
  resetPasswordThunk,
  sendOtpThunk,
  verifyOtpThunk,
} from "./authThunk";

interface AuthState {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  error: string | null;
}

const initialState: AuthState = {
  user: null,
  isLoading: true,
  isAuthenticated: false,
  error: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    resetAuth: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.error = null;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // checkCurrentUser
    builder
      .addCase(checkCurrentUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(
        checkCurrentUser.fulfilled,
        (state, action: PayloadAction<User | null>) => {
          state.isLoading = false;
          state.user = action.payload;
          state.isAuthenticated = !!action.payload;
        },
      )
      .addCase(checkCurrentUser.rejected, (state, action) => {
        state.isLoading = false;
        state.user = null;
        state.isAuthenticated = false;
        state.error = action.payload as string;
      })

      // login
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action: PayloadAction<User>) => {
        state.isLoading = false;
        state.user = action.payload;
        state.isAuthenticated = true;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })

      // registerUser
      .addCase(registerUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state) => {
        state.isLoading = false;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })

      // sendOtpThunk
      .addCase(sendOtpThunk.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(sendOtpThunk.fulfilled, (state) => {
        state.isLoading = false;
      })
      .addCase(sendOtpThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })

      // verifyOtpThunk
      .addCase(verifyOtpThunk.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(verifyOtpThunk.fulfilled, (state, action) => {
        state.isLoading = false;
        if (action.payload.purpose === "signup") {
          state.user = action.payload.user;
          state.isAuthenticated = true;
        }
      })
      .addCase(verifyOtpThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })

      // resetPasswordThunk
      .addCase(resetPasswordThunk.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(resetPasswordThunk.fulfilled, (state) => {
        state.isLoading = false;
      })
      .addCase(resetPasswordThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })

      // logout
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
        state.isAuthenticated = false;
        state.isLoading = false;
        state.error = null;
      });
  },
});

export const { resetAuth, clearError } = authSlice.actions;
export default authSlice.reducer;
