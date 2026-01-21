import { Link, useNavigate } from "react-router-dom";
import { Calendar, UserCircle, LogOut, LayoutDashboard } from "lucide-react";
import { logoutUser } from "@/features/auth/authThunk.ts";
import { useAppDispatch } from "@/hooks/useAppDispatch";
import { useAppSelector } from "@/hooks/useAppSelector";

export default function Header() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const { isAuthenticated, user, isLoading } = useAppSelector(
    (state) => state.auth,
  );

  const handleLogout = async () => {
    try {
      await dispatch(logoutUser()).unwrap();
      navigate("/login", { replace: true });
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-xl flex items-center justify-center shadow-md">
              <Calendar className="h-6 w-6 text-white" />
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              EventBook
            </span>
          </Link>

          {/* Navigation - shown only when authenticated */}
          <nav className="hidden md:flex items-center gap-8">
            {isAuthenticated && (
              <Link
                to={user?.role === "admin" ? "/admin/dashboard" : "/dashboard"}
                className="text-gray-700 hover:text-indigo-600 font-medium transition-colors flex items-center gap-1">
                <LayoutDashboard size={18} />
                Dashboard
              </Link>
            )}
          </nav>

          {/* Auth / User section */}
          <div className="flex items-center gap-4">
            {isLoading ? (
              <div className="h-8 w-8 rounded-full border-2 border-indigo-500 border-t-transparent animate-spin" />
            ) : isAuthenticated ? (
              <div className="flex items-center gap-4">
                {/* User info - hidden on very small screens */}
                <div className="hidden sm:flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-indigo-100 flex items-center justify-center">
                    <UserCircle className="h-6 w-6 text-indigo-600" />
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-900">
                      {user?.name || "User"}
                    </p>
                    <p className="text-xs text-gray-500 capitalize">
                      {user?.role || "user"}
                    </p>
                  </div>
                </div>

                <button
                  onClick={handleLogout}
                  disabled={isLoading}
                  className="px-4 py-2 bg-red-50 text-red-700 hover:bg-red-100 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed">
                  <LogOut size={16} />
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-4">
                <Link
                  to="/login"
                  className="text-gray-700 hover:text-indigo-600 font-medium transition-colors">
                  Sign in
                </Link>
                <Link
                  to="/register"
                  className="px-5 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium shadow-sm">
                  Sign up
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
