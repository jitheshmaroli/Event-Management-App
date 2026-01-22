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

interface BookingItem {
  id: string;
  customer: string;
  service: string;
  date: string;
  amount: number;
  status: "pending" | "confirmed" | "cancelled" | "completed";
}

export default function AdminDashboard() {
  const navigate = useNavigate();

  // Get auth state from Redux
  const {
    user,
    isAuthenticated,
    isLoading: authLoading,
  } = useAppSelector((state) => state.auth);

  const [stats, setStats] = useState({
    totalBookings: 0,
    totalRevenue: 0,
    pendingBookings: 0,
    activeServices: 0,
  });

  const [recentBookings, setRecentBookings] = useState<BookingItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Redirect if not authenticated or not admin
    if (!isAuthenticated && !authLoading) {
      navigate("/login", { replace: true });
      return;
    }

    if (user?.role !== "admin" && !authLoading) {
      navigate("/dashboard", { replace: true });
      return;
    }

    // Only fetch data if authenticated + admin
    if (isAuthenticated && user?.role === "admin") {
      const loadData = async () => {
        try {
          setLoading(true);

          // TODO: Replace with real API call
          // const res = await api.get('/admin/stats');
          // setStats(res.data.stats);
          // const bookingsRes = await api.get('/admin/recent-bookings');
          // setRecentBookings(bookingsRes.data.bookings || []);

          // Simulated delay + data
          await new Promise((resolve) => setTimeout(resolve, 1500));

          setStats({
            totalBookings: 248,
            totalRevenue: 1245000,
            pendingBookings: 17,
            activeServices: 86,
          });

          setRecentBookings([
            {
              id: "BK-2026012",
              customer: "Priya Sharma",
              service: "Luxury Waterfront Venue",
              date: "2026-02-14",
              amount: 65000,
              status: "pending",
            },
            {
              id: "BK-2026011",
              customer: "Rahul Mehta",
              service: "Professional Wedding Photography",
              date: "2026-01-25",
              amount: 32000,
              status: "confirmed",
            },
            {
              id: "BK-2026010",
              customer: "Aisha Khan",
              service: "Live Band & DJ Combo",
              date: "2026-01-18",
              amount: 45000,
              status: "completed",
            },
            {
              id: "BK-2026009",
              customer: "Vikram Singh",
              service: "Catering (200 guests)",
              date: "2026-02-05",
              amount: 98000,
              status: "cancelled",
            },
          ]);
        } catch (err) {
          console.error("Failed to load admin dashboard data:", err);
        } finally {
          setLoading(false);
        }
      };

      loadData();
    }
  }, [isAuthenticated, authLoading, user?.role, navigate]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "confirmed":
        return "bg-green-100 text-green-800";
      case "completed":
        return "bg-blue-100 text-blue-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // Show full-page loading while checking auth or fetching data
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
                className="px-5 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition flex items-center gap-2 shadow-sm">
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
                <p className="text-3xl font-bold text-indigo-600 mt-2">
                  {stats.totalBookings}
                </p>
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
                <p className="text-3xl font-bold text-green-600 mt-2">
                  ₹{stats.totalRevenue.toLocaleString()}
                </p>
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
                <p className="text-3xl font-bold text-amber-600 mt-2">
                  {stats.pendingBookings}
                </p>
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
                <p className="text-3xl font-bold text-purple-600 mt-2">
                  {stats.activeServices}
                </p>
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
            className="bg-white rounded-xl shadow-md p-8 hover:shadow-lg transition border border-gray-100 group">
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
            className="bg-white rounded-xl shadow-md p-8 hover:shadow-lg transition border border-gray-100 group">
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
              className="text-indigo-600 hover:text-indigo-800 font-medium flex items-center gap-1">
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
              <tbody className="bg-white divide-y divide-gray-200">
                {recentBookings.map((booking) => (
                  <tr key={booking.id} className="hover:bg-gray-50 transition">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {booking.id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      {booking.customer}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      {booking.service}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      {booking.date}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      ₹{booking.amount.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(
                          booking.status,
                        )}`}>
                        {booking.status.charAt(0).toUpperCase() +
                          booking.status.slice(1)}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
