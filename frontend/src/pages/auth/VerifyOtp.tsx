/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useRef, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
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
import { sendOtp } from "@/lib/auth";

export default function VerifyOtp() {
  const [otp, setOtp] = useState<string[]>(Array(6).fill(""));
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [resendCountdown, setResendCountdown] = useState(60);

  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const { verifyOtp, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const state = location.state as VerifyEmailState | null;

  const emailFromState = state?.email || user?.email || "";
  const otpPurpose = state?.purpose;

  console.log("emailstate:", emailFromState);
  console.log("purpose:", otpPurpose);

  useEffect(() => {
    if (!emailFromState) {
      navigate("/register", { replace: true });
    }
  }, [emailFromState, otpPurpose, navigate]);

  useEffect(() => {
    if (resendCountdown > 0) {
      const timer = setTimeout(() => setResendCountdown((c) => c - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendCountdown]);

  const handleChange = (index: number, value: string) => {
    if (!/^[0-9]?$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>,
  ) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (
    e: React.ClipboardEvent<HTMLInputElement>,
    index: number,
  ) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").trim();
    if (!/^\d{6}$/.test(pasted)) return;

    const digits = pasted.split("");
    const newOtp = [...otp];
    for (let i = 0; i < 6 && index + i < 6; i++) {
      newOtp[index + i] = digits[i];
    }
    setOtp(newOtp);

    const nextFocus = Math.min(index + digits.length, 5);
    inputRefs.current[nextFocus]?.focus();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const code = otp.join("");

    if (code.length !== 6) {
      setError("Please enter a complete 6-digit code");
      return;
    }

    setError(null);
    setLoading(true);

    try {
      switch (otpPurpose) {
        case OTP_PURPOSE.SIGNUP:
          await verifyOtp(emailFromState, code);
          break;

        case OTP_PURPOSE.FORGOT_PASSWORD:
          await verifyOtp(emailFromState, code);
          navigate("/reset-password", { state: { email: emailFromState } });
          return;

        default:
          throw new Error("Invalid OTP purpose");
      }

      setSuccess(true);
      setTimeout(() => navigate("/dashboard"), 1500);
    } catch (err: any) {
      setError(
        err.response?.data?.message ||
          "Invalid or expired code. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setError(null);
    setOtp(Array(6).fill(""));
    inputRefs.current[0]?.focus();
    setResendCountdown(60);
    try {
      await sendOtp({ email: emailFromState, purpose: otpPurpose! });
    } catch (err: any) {
      setError(
        err.response?.data?.message ||
          "Failed to resend OTP. Please try again.",
      );
    }
  };

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

      {/* Mobile Logo + Form Container */}
      <div className="w-full lg:w-1/2 relative z-10 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-md">
          {/* Glassmorphic Card */}
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
                  {emailFromState || "your email"}
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
                <p className="text-gray-600">Redirecting to dashboard...</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-8">
                {error && (
                  <div className="flex items-center gap-3 p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl text-sm">
                    <AlertCircle size={20} className="flex-shrink-0" />
                    <span>{error}</span>
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
                        ${
                          digit
                            ? "border-indigo-600 bg-indigo-50/50"
                            : "border-gray-300 hover:border-gray-400"
                        }
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
                        className="text-indigo-600 hover:text-indigo-800 font-medium transition-colors">
                        Resend Code
                      </button>
                    )}
                  </p>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={loading || success}
                  className={`
                    w-full bg-gradient-to-r from-indigo-600 to-purple-600 
                    text-white py-3.5 px-6 rounded-xl font-medium
                    hover:from-indigo-700 hover:to-purple-700
                    focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500
                    disabled:opacity-60 disabled:cursor-not-allowed
                    transition-all transform hover:scale-[1.02] active:scale-[0.98]
                    flex items-center justify-center gap-3
                  `}>
                  {loading ? (
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

          {/* Footer */}
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
