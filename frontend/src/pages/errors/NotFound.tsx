import { Link } from "react-router-dom";
import { Home, Search, AlertTriangle } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-slate-900 flex items-center justify-center px-4">
      <div className="text-center max-w-2xl">
        <div className="inline-flex items-center justify-center w-24 h-24 bg-red-500/20 rounded-full mb-8 mx-auto">
          <AlertTriangle className="h-12 w-12 text-red-400" />
        </div>

        <h1 className="text-7xl md:text-9xl font-extrabold text-white tracking-tight mb-4">
          404
        </h1>

        <h2 className="text-3xl md:text-4xl font-bold text-indigo-200 mb-6">
          Oops! Page not found
        </h2>

        <p className="text-xl text-indigo-300/90 mb-10 max-w-lg mx-auto">
          The page you're looking for might have been removed, had its name
          changed, or is temporarily unavailable.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to="/"
            className="inline-flex items-center px-8 py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-xl transition transform hover:scale-105 shadow-lg">
            <Home className="mr-2 h-5 w-5" />
            Back to Home
          </Link>

          <Link
            to="/services"
            className="inline-flex items-center px-8 py-4 bg-white/10 backdrop-blur-md border border-white/20 text-white font-medium rounded-xl hover:bg-white/20 transition">
            <Search className="mr-2 h-5 w-5" />
            Browse Services
          </Link>
        </div>

        <p className="mt-12 text-indigo-400/70 text-sm">
          © {new Date().getFullYear()} EventHub. All rights reserved.
        </p>
      </div>
    </div>
  );
}
