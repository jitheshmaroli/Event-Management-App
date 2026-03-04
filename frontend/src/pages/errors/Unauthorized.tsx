import { Link } from "react-router-dom";
import { Lock, ArrowLeft } from "lucide-react";
import { useAppSelector } from "@/hooks/useAppSelector";

export default function Unauthorized() {
  const { isAuthenticated } = useAppSelector((state) => state.auth);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-950 via-purple-950 to-slate-950 flex items-center justify-center px-4">
      <div className="text-center max-w-xl">
        <div className="inline-flex items-center justify-center w-24 h-24 bg-amber-500/20 rounded-full mb-8 mx-auto">
          <Lock className="h-12 w-12 text-amber-400" />
        </div>

        <h1 className="text-7xl md:text-9xl font-extrabold text-white tracking-tight mb-4">
          401 / 403
        </h1>

        <h2 className="text-3xl md:text-4xl font-bold text-amber-200 mb-6">
          Access Denied
        </h2>

        <p className="text-xl text-indigo-300/90 mb-10 max-w-lg mx-auto">
          {isAuthenticated
            ? "Sorry, you don't have permission to access this page."
            : "Please sign in to view this content."}
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          {isAuthenticated ? (
            <>
              <Link
                to="/"
                className="inline-flex items-center px-8 py-4 bg-white/10 backdrop-blur-md border border-white/20 text-white font-medium rounded-xl hover:bg-white/20 transition"
              >
                <ArrowLeft className="mr-2 h-5 w-5" />
                Back to Home
              </Link>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="inline-flex items-center px-8 py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-xl transition transform hover:scale-105 shadow-lg"
              >
                Sign In
              </Link>

              <Link
                to="/register"
                className="inline-flex items-center px-8 py-4 bg-white/10 backdrop-blur-md border border-white/20 text-white font-medium rounded-xl hover:bg-white/20 transition"
              >
                Create Account
              </Link>
            </>
          )}
        </div>

        <p className="mt-12 text-indigo-400/70 text-sm">
          If you believe this is an error, please contact support.
        </p>
      </div>
    </div>
  );
}
