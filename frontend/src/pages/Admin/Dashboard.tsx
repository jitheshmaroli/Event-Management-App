import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  DollarSign,
  Calendar,
  ShoppingBag,
  TrendingUp,
  AlertTriangle,
  ChevronRight,
} from "lucide-react";

import { useAppSelector } from "@/hooks/useAppSelector";

export default function AdminDashboard() {
  const navigate = useNavigate();

  const {
    user,
    isAuthenticated,
    isLoading: authLoading,
  } = useAppSelector((state) => state.auth);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated && !authLoading) {
      navigate("/login", { replace: true });
      return;
    }

    if (user?.role !== "admin" && !authLoading) {
      navigate("/dashboard", { replace: true });
      return;
    }

    if (isAuthenticated && user?.role === "admin") {
      const loadData = async () => {
        try {
          setLoading(true);

          await new Promise((resolve) => setTimeout(resolve, 1500));
        } catch (err) {
          console.error("Failed to load admin dashboard data:", err);
        } finally {
          setLoading(false);
        }
      };

      loadData();
    }
  }, [isAuthenticated, authLoading, user?.role, navigate]);

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Loading admin dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-10">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
                Admin Dashboard
              </h1>
              <p className="mt-2 text-lg text-gray-600">
                Welcome back, {user?.name || "Admin"} • Managing platform &
                services
              </p>
            </div>
            <div className="flex gap-4">
              <Link
                to="/admin/services/new"
                className="px-5 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition flex items-center gap-2 shadow-sm"
              >
                <ShoppingBag size={18} />
                Add New Service
              </Link>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">
                  Total Bookings
                </p>
                <p className="text-3xl font-bold text-indigo-600 mt-2"></p>
              </div>
              <div className="bg-indigo-100 p-4 rounded-full">
                <Calendar className="h-7 w-7 text-indigo-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">
                  Total Revenue
                </p>
                <p className="text-3xl font-bold text-green-600 mt-2"></p>
              </div>
              <div className="bg-green-100 p-4 rounded-full">
                <DollarSign className="h-7 w-7 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">
                  Pending Bookings
                </p>
                <p className="text-3xl font-bold text-amber-600 mt-2"></p>
              </div>
              <div className="bg-amber-100 p-4 rounded-full">
                <AlertTriangle className="h-7 w-7 text-amber-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">
                  Active Services
                </p>
                <p className="text-3xl font-bold text-purple-600 mt-2"></p>
              </div>
              <div className="bg-purple-100 p-4 rounded-full">
                <ShoppingBag className="h-7 w-7 text-purple-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <Link
            to="/admin/services"
            className="bg-white rounded-xl shadow-md p-8 hover:shadow-lg transition border border-gray-100 group"
          >
            <div className="flex items-center gap-4 mb-4">
              <div className="bg-indigo-100 p-4 rounded-full group-hover:bg-indigo-200 transition">
                <ShoppingBag className="h-8 w-8 text-indigo-600" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900">
                  Manage Services
                </h3>
                <p className="text-gray-600 mt-1">
                  Add, edit or remove services
                </p>
              </div>
            </div>
            <div className="flex items-center text-indigo-600 font-medium">
              Go to Services <ChevronRight size={18} className="ml-1" />
            </div>
          </Link>

          <Link
            to="/admin/bookings"
            className="bg-white rounded-xl shadow-md p-8 hover:shadow-lg transition border border-gray-100 group"
          >
            <div className="flex items-center gap-4 mb-4">
              <div className="bg-blue-100 p-4 rounded-full group-hover:bg-blue-200 transition">
                <Calendar className="h-8 w-8 text-blue-600" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900">
                  View All Bookings
                </h3>
                <p className="text-gray-600 mt-1">Monitor platform bookings</p>
              </div>
            </div>
            <div className="flex items-center text-blue-600 font-medium">
              View Bookings <ChevronRight size={18} className="ml-1" />
            </div>
          </Link>

          <div className="bg-white rounded-xl shadow-md p-8 border border-gray-100 group cursor-pointer">
            <div className="flex items-center gap-4 mb-4">
              <div className="bg-green-100 p-4 rounded-full group-hover:bg-green-200 transition">
                <TrendingUp className="h-8 w-8 text-green-600" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900">
                  Platform Analytics
                </h3>
                <p className="text-gray-600 mt-1">View revenue & trends</p>
              </div>
            </div>
            <div className="flex items-center text-green-600 font-medium">
              View Analytics <ChevronRight size={18} className="ml-1" />
            </div>
          </div>
        </div>

        {/* Recent Bookings Table */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="px-6 py-5 border-b border-gray-200 flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900">
              Recent Bookings
            </h2>
            <Link
              to="/admin/bookings"
              className="text-indigo-600 hover:text-indigo-800 font-medium flex items-center gap-1"
            >
              View All <ChevronRight size={18} />
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Booking ID
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Customer
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Service
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200"></tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
