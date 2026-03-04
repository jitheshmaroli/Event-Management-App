import { useState } from "react";
import { Eye, EyeOff, Mail, Lock, Shield } from "lucide-react";
import { loginUser } from "@/features/auth/authThunk";
import { clearError } from "@/features/auth/authSlice";
import { useAppDispatch } from "@/hooks/useAppDispatch";
import { useAppSelector } from "@/hooks/useAppSelector";
import { useAuthRedirect } from "@/hooks/useAuthRedirect";
import { ROLES } from "@/constants/roles";

export default function AdminLogin() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);

  const dispatch = useAppDispatch();
  const { isLoading, error } = useAppSelector((state) => state.auth);
  useAuthRedirect();
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(clearError());

    await dispatch(loginUser({ ...form, loginType: ROLES.ADMIN }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-950 to-purple-950 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-indigo-600/20 rounded-2xl mb-4 backdrop-blur-sm border border-indigo-500/30">
            <Shield className="h-8 w-8 text-indigo-400" />
          </div>
          <h1 className="text-3xl font-bold text-white">Admin Portal</h1>
          <p className="text-indigo-200/80 mt-2">
            Secure access for administrators
          </p>
        </div>

        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8 shadow-2xl">
          {error && (
            <div className="mb-6 p-4 bg-red-900/40 border border-red-700/50 text-red-200 rounded-xl text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-indigo-200 mb-2">
                Admin Email
              </label>
              <div className="relative">
                <Mail
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-indigo-300/70"
                  size={18}
                />
                <input
                  type="email"
                  required
                  className="w-full bg-white/10 border border-indigo-500/30 text-white placeholder-indigo-300/50 rounded-xl pl-12 pr-4 py-3 focus:outline-none focus:border-indigo-400 focus:ring-1 focus:ring-indigo-400/50 transition"
                  placeholder="admin@eventbook.com"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-indigo-200 mb-2">
                Password
              </label>
              <div className="relative">
                <Lock
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-indigo-300/70"
                  size={18}
                />
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  className="w-full bg-white/10 border border-indigo-500/30 text-white placeholder-indigo-300/50 rounded-xl pl-12 pr-12 py-3 focus:outline-none focus:border-indigo-400 focus:ring-1 focus:ring-indigo-400/50 transition"
                  placeholder="••••••••"
                  value={form.password}
                  onChange={(e) =>
                    setForm({ ...form, password: e.target.value })
                  }
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-indigo-300/70 hover:text-indigo-200">
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-indigo-600 to-purple-700 text-white py-3.5 rounded-xl font-medium hover:from-indigo-700 hover:to-purple-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 disabled:opacity-60 transition-all shadow-lg">
              {isLoading ? "Authenticating..." : "Login to Admin Panel"}
            </button>
          </form>

          <div className="mt-8 text-center text-sm text-indigo-200/70">
            <a
              href="/login"
              className="text-indigo-400 hover:text-indigo-300 transition">
              ← Back to User Login
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
