import { useState, useRef, useEffect, useCallback } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  CheckCircle,
  ArrowLeft,
  AlertCircle,
  Mail,
  Sparkles,
  Calendar,
} from "lucide-react";

import type { VerifyEmailState } from "@/lib/types";
import { OTP_PURPOSE } from "@/constants/otpPurpose";
import { clearError } from "@/features/auth/authSlice";
import { useAppSelector } from "@/hooks/useAppSelector";
import { useAppDispatch } from "@/hooks/useAppDispatch";
import { sendOtpThunk, verifyOtpThunk } from "@/features/auth/authThunk";

export default function VerifyOtp() {
  const [otp, setOtp] = useState<string[]>(Array(6).fill(""));
  const [localError, setLocalError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [resendCountdown, setResendCountdown] = useState(60);

  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const location = useLocation();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const { isLoading, error: reduxError } = useAppSelector(
    (state) => state.auth,
  );

  const state = location.state as VerifyEmailState | null;

  const email = state?.email ?? "";
  const otpPurpose = state?.purpose;

  // Redirect if no email
  useEffect(() => {
    if (!email) {
      navigate("/register", { replace: true });
    }
  }, [email, navigate]);

  // Clear error on mount
  useEffect(() => {
    dispatch(clearError());
  }, [dispatch]);

  // Countdown for resend
  useEffect(() => {
    if (resendCountdown <= 0) return;
    const timer = setTimeout(() => setResendCountdown((c) => c - 1), 1000);
    return () => clearTimeout(timer);
  }, [resendCountdown]);

  const handleChange = useCallback((index: number, value: string) => {
    if (!/^[0-9]?$/.test(value)) return;
    setOtp((prev) => {
      const newOtp = [...prev];
      newOtp[index] = value;
      return newOtp;
    });
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  }, []);

  const handleKeyDown = useCallback(
    (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Backspace" && !otp[index] && index > 0) {
        inputRefs.current[index - 1]?.focus();
      }
    },
    [otp],
  );

  const handlePaste = useCallback(
    (e: React.ClipboardEvent<HTMLInputElement>, index: number) => {
      e.preventDefault();
      const pasted = e.clipboardData.getData("text").trim();
      if (!/^\d{6}$/.test(pasted)) return;

      const digits = pasted.split("");
      setOtp((prev) => {
        const newOtp = [...prev];
        for (let i = 0; i < 6 && index + i < 6; i++) {
          newOtp[index + i] = digits[i];
        }
        return newOtp;
      });

      const nextFocus = Math.min(index + digits.length, 5);
      inputRefs.current[nextFocus]?.focus();
    },
    [],
  );

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();

      const code = otp.join("");

      if (code.length !== 6) {
        setLocalError("Please enter a complete 6-digit code");
        return;
      }

      if (!otpPurpose) {
        setLocalError("Invalid verification context. Please try again.");
        return;
      }

      setLocalError(null);

      console.log("Submitting OTP for purpose:", otpPurpose);

      const result = await dispatch(
        verifyOtpThunk({
          email,
          otp: code,
          purpose: otpPurpose,
        }),
      );

      console.log("verifyOtpThunk result:", result);

      if (verifyOtpThunk.fulfilled.match(result)) {
        const payload = result.payload;

        setSuccess(true);

        if (otpPurpose === OTP_PURPOSE.SIGNUP) {
          console.log("Signup verified → redirecting to dashboard");
          setSuccessMessage("Email verified! Redirecting to dashboard...");
          setTimeout(() => navigate("/dashboard", { replace: true }), 1500);
        } else if (otpPurpose === OTP_PURPOSE.FORGOT_PASSWORD) {
          console.log(
            "Forgot password verified → redirecting to reset password",
          );

          const message =
            payload.purpose === OTP_PURPOSE.FORGOT_PASSWORD
              ? payload.message
              : "OTP verified!";
          setSuccessMessage(message);
          setTimeout(() => {
            navigate("/reset-password", { replace: true, state: { email } });
          }, 1500);
        }
      } else if (verifyOtpThunk.rejected.match(result)) {
        console.log("OTP verification failed:", result.payload);
        setLocalError(result.payload as string);
      }
    },
    [otp, otpPurpose, email, dispatch, navigate],
  );

  const handleResend = useCallback(async () => {
    setLocalError(null);
    setOtp(Array(6).fill(""));
    inputRefs.current[0]?.focus?.();
    setResendCountdown(60);

    if (!otpPurpose || !email) {
      setLocalError("Cannot resend OTP — invalid context");
      return;
    }

    const result = await dispatch(
      sendOtpThunk({
        email,
        purpose: otpPurpose,
      }),
    );

    if (sendOtpThunk.rejected.match(result)) {
      setLocalError(result.payload as string);
    }
  }, [otpPurpose, email, dispatch]);

  const combinedError = localError || reduxError;

  return (
    <div className="min-h-screen flex relative overflow-hidden">
      {/* Animated Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500">
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-0 -left-4 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl animate-pulse"></div>
          <div className="absolute top-0 -right-4 w-72 h-72 bg-yellow-300 rounded-full mix-blend-multiply filter blur-xl animate-pulse animation-delay-2000"></div>
          <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl animate-pulse animation-delay-4000"></div>
        </div>
      </div>

      <div className="w-full lg:w-1/2 relative z-10 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-md">
          <div className="bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl p-8 border border-white/20">
            {/* Mobile Logo */}
            <div className="lg:hidden flex items-center justify-center gap-2 mb-8">
              <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center">
                <Calendar className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                EventHub
              </span>
            </div>

            <div className="text-center mb-8">
              <div className="mx-auto w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mb-4">
                <Mail className="h-8 w-8 text-indigo-600" />
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">
                Verify Your Email
              </h2>
              <p className="text-gray-600">
                We sent a 6-digit code to{" "}
                <span className="font-medium text-indigo-600 break-all">
                  {email || "your email"}
                </span>
              </p>
            </div>

            {success ? (
              <div className="text-center py-10">
                <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-6 mx-auto">
                  <CheckCircle className="h-12 w-12 text-green-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">
                  Email Verified!
                </h3>
                {successMessage && (
                  <p className="text-green-600 font-medium mt-2">
                    {successMessage}
                  </p>
                )}
                <p className="text-gray-600 mt-4">
                  {otpPurpose === OTP_PURPOSE.SIGNUP
                    ? "Redirecting to dashboard..."
                    : "Redirecting to reset password..."}
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-8">
                {combinedError && (
                  <div className="flex items-center gap-3 p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl text-sm">
                    <AlertCircle size={20} className="flex-shrink-0" />
                    <span>{combinedError}</span>
                  </div>
                )}

                {/* OTP Inputs */}
                <div className="flex justify-center gap-3 sm:gap-4">
                  {otp.map((digit, index) => (
                    <input
                      key={index}
                      ref={(el) => {
                        inputRefs.current[index] = el;
                      }}
                      type="password"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleChange(index, e.target.value)}
                      onKeyDown={(e) => handleKeyDown(index, e)}
                      onPaste={(e) => handlePaste(e, index)}
                      className={`
                        w-14 h-16 text-center text-3xl font-bold border-2 rounded-xl
                        focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500
                        transition-all duration-200
                        ${digit ? "border-indigo-600 bg-indigo-50/50" : "border-gray-300 hover:border-gray-400"}
                      `}
                      autoFocus={index === 0}
                    />
                  ))}
                </div>

                {/* Resend */}
                <div className="text-center text-sm">
                  <p className="text-gray-600">
                    Didn't receive the code?{" "}
                    {resendCountdown > 0 ? (
                      <span className="text-gray-500 font-medium">
                        Resend in {resendCountdown}s
                      </span>
                    ) : (
                      <button
                        type="button"
                        onClick={handleResend}
                        disabled={isLoading}
                        className="text-indigo-600 hover:text-indigo-800 font-medium transition-colors">
                        Resend Code
                      </button>
                    )}
                  </p>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isLoading || success}
                  className={`
                    w-full bg-gradient-to-r from-indigo-600 to-purple-600 
                    text-white py-3.5 px-6 rounded-xl font-medium
                    hover:from-indigo-700 hover:to-purple-700
                    focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500
                    disabled:opacity-60 disabled:cursor-not-allowed
                    transition-all transform hover:scale-[1.02] active:scale-[0.98]
                    flex items-center justify-center gap-3
                  `}>
                  {isLoading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      Verifying...
                    </>
                  ) : success ? (
                    "Verified!"
                  ) : (
                    "Verify Email"
                  )}
                </button>
              </form>
            )}

            {/* Back to Login */}
            <div className="mt-8 text-center">
              <button
                type="button"
                onClick={() => navigate("/login")}
                className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-indigo-700 transition-colors">
                <ArrowLeft size={16} />
                Back to login
              </button>
            </div>
          </div>

          <p className="mt-8 text-center text-sm text-white/80">
            © 2026 EventHub. All rights reserved.
          </p>
        </div>
      </div>

      {/* Right Side - Branding (desktop only) */}
      <div className="hidden lg:flex lg:w-1/2 relative z-10 flex-col justify-center px-12 text-white">
        <div className="max-w-md">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
              <Calendar className="w-7 h-7" />
            </div>
            <span className="text-3xl font-bold">EventHub</span>
          </div>

          <h1 className="text-5xl font-bold mb-6 leading-tight">
            One More Step!
          </h1>

          <p className="text-xl text-white/90 mb-10">
            Verify your email to unlock full access to event discovery, booking,
            and management features.
          </p>

          <div className="space-y-6">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center flex-shrink-0">
                <Sparkles className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-xl mb-1">Quick & Secure</h3>
                <p className="text-white/80 text-lg">
                  One-time verification keeps your account protected
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center flex-shrink-0">
                <Mail className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-xl mb-1">Check Your Inbox</h3>
                <p className="text-white/80 text-lg">
                  Look for an email from EventHub (check spam too!)
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center flex-shrink-0">
                <CheckCircle className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-xl mb-1">Instant Access</h3>
                <p className="text-white/80 text-lg">
                  Start exploring and creating events right after verification
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
