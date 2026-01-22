import { useEffect, useState } from "react";
import { Eye, EyeOff, Lock, Calendar } from "lucide-react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { useAppDispatch } from "@/hooks/useAppDispatch";
import { resetPasswordThunk } from "@/features/auth/authThunk.ts";
import { useAppSelector } from "@/hooks/useAppSelector";
import type { ResetPasswordState } from "@/lib/types";

export default function ResetPassword() {
  const navigate = useNavigate();
  const location = useLocation();
  const [form, setForm] = useState({
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const dispatch = useAppDispatch();
  const { isLoading, error } = useAppSelector((state) => state.auth);

  const state = location.state as ResetPasswordState | null;
  const email = state?.email;

  useEffect(() => {
    if (!email) {
      navigate("/forgot-password", { replace: true });
    }
  }, [email, navigate, dispatch]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError(null);

    if (form.password.length < 8) {
      setLocalError("Password must be at least 8 characters");
      return;
    }
    if (form.password !== form.confirmPassword) {
      setLocalError("Passwords do not match");
      return;
    }

    const result = await dispatch(
      resetPasswordThunk({
        email: email!,
        newPassword: form.password,
      }),
    );

    if (resetPasswordThunk.fulfilled.match(result)) {
      setSuccess(true);
      setTimeout(() => navigate("/login", { replace: true }), 2200);
    }
  };

  return (
    <div className="min-h-screen flex relative overflow-hidden">
      {/* Background same as others */}
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
              <h2 className="text-3xl font-bold text-gray-900 mb-2">
                Set New Password
              </h2>
              <p className="text-gray-600">
                Choose a strong password for your account
              </p>
            </div>

            {success ? (
              <div className="text-center py-10">
                <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-6 mx-auto">
                  <Lock className="h-12 w-12 text-green-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">
                  Password Reset Successful!
                </h3>
                <p className="text-gray-600">Redirecting to login...</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                {(error || localError) && (
                  <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl text-sm">
                    {error || localError}
                  </div>
                )}

                {/* New Password */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    New Password
                  </label>
                  <div className="relative">
                    <Lock
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                      size={20}
                    />
                    <input
                      type={showPassword ? "text" : "password"}
                      required
                      minLength={8}
                      className="w-full pl-11 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all outline-none"
                      placeholder="••••••••"
                      value={form.password}
                      onChange={(e) =>
                        setForm({ ...form, password: e.target.value })
                      }
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                      {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                </div>

                {/* Confirm Password */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Confirm New Password
                  </label>
                  <div className="relative">
                    <Lock
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                      size={20}
                    />
                    <input
                      type={showConfirm ? "text" : "password"}
                      required
                      className="w-full pl-11 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all outline-none"
                      placeholder="••••••••"
                      value={form.confirmPassword}
                      onChange={(e) =>
                        setForm({ ...form, confirmPassword: e.target.value })
                      }
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirm(!showConfirm)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                      {showConfirm ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isLoading || success}
                  className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3.5 px-6 rounded-xl font-medium hover:from-indigo-700 hover:to-purple-700 disabled:opacity-60 transition-all transform hover:scale-[1.02] flex items-center justify-center gap-3">
                  {isLoading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Resetting...
                    </>
                  ) : (
                    "Reset Password"
                  )}
                </button>
              </form>
            )}

            <div className="mt-8 text-center">
              <Link
                to="/login"
                className="text-sm text-indigo-600 hover:text-indigo-700 transition-colors">
                Back to login
              </Link>
            </div>
          </div>

          <p className="mt-8 text-center text-sm text-white/80">
            © 2026 EventHub. All rights reserved.
          </p>
        </div>
      </div>

      {/* Desktop branding panel */}
      <div className="hidden lg:flex lg:w-1/2 relative z-10 flex-col justify-center px-12 text-white">
        <div className="max-w-md">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
              <Calendar className="w-7 h-7" />
            </div>
            <span className="text-3xl font-bold">EventHub</span>
          </div>

          <h1 className="text-5xl font-bold mb-6 leading-tight">
            Secure Your Account
          </h1>

          <p className="text-xl text-white/90 mb-10">
            Create a strong new password to keep your events and bookings safe.
          </p>
        </div>
      </div>
    </div>
  );
}
