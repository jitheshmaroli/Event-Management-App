import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  IndianRupee,
  Calendar,
  ShoppingBag,
  ChevronRight,
  Users,
  AlertCircle,
} from "lucide-react";

import { useAppSelector } from "@/hooks/useAppSelector";
import api from "@/lib/api";
import {
  type DashboardResponse,
  type RecentBooking,
} from "@/types/admin.types";
import { rupeeFormatter } from "@/utils/format";
import StatCard from "@/components/admin/StatCard";
import QuickActionCard from "@/components/admin/QuickActionCard";
import { DataTable } from "@/components/common/DataTable";

export default function AdminDashboard() {
  const navigate = useNavigate();

  const {
    user,
    isAuthenticated,
    isLoading: authLoading,
  } = useAppSelector((state) => state.auth);

  const [data, setData] = useState<DashboardResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isAuthenticated && !authLoading) {
      navigate("/login", { replace: true });
      return;
    }

    if (user?.role !== "admin" && !authLoading) {
      navigate("/my-bookings", { replace: true });
      return;
    }

    if (isAuthenticated && user?.role === "admin") {
      const fetchDashboard = async () => {
        try {
          setLoading(true);
          setError(null);

          const res = await api.get("/admin/dashboard");
          setData(res.data.data);
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (err: any) {
          setError(
            err.response?.data?.message || "Failed to load dashboard data",
          );
        } finally {
          setLoading(false);
        }
      };

      fetchDashboard();
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

  if (error || !data) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md px-4">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Something went wrong
          </h2>
          <p className="text-gray-600 mb-6">
            {error || "Unable to load dashboard data"}
          </p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  const { stats, recentBookings } = data;

  const bookingColumns = [
    {
      header: "Customer",
      accessor: (booking: RecentBooking) => (
        <div>
          <div className="font-medium text-gray-900">{booking.user.name}</div>
          <div className="text-xs text-gray-500">{booking.user.email}</div>
        </div>
      ),
    },
    {
      header: "Service",
      accessor: (booking: RecentBooking) => booking.service.title,
    },
    {
      header: "Date From",
      accessor: (booking: RecentBooking) =>
        new Date(booking.startDate).toLocaleDateString("en-IN", {
          day: "numeric",
          month: "short",
          year: "numeric",
        }),
    },
    {
      header: "Date To",
      accessor: (booking: RecentBooking) =>
        new Date(booking.endDate).toLocaleDateString("en-IN", {
          day: "numeric",
          month: "short",
          year: "numeric",
        }),
    },
    {
      header: "Amount",
      accessor: (booking: RecentBooking) =>
        rupeeFormatter.format(booking.totalAmount),
      className: "font-medium text-gray-900",
    },
    {
      header: "Status",
      accessor: (booking: RecentBooking) => {
        const isConfirmed = booking.status.toLowerCase() === "confirmed";
        return (
          <span
            className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
              isConfirmed
                ? "bg-green-100 text-green-800"
                : "bg-gray-100 text-gray-800"
            }`}
          >
            {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
          </span>
        );
      },
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-10">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
            Admin Dashboard
          </h1>
          <p className="mt-2 text-lg text-gray-600">
            Welcome back, {user?.name || "Admin"} • Managing platform & services
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <StatCard
            title="Total Bookings"
            value={stats.totalBookings.toLocaleString()}
            icon={<Calendar className="h-7 w-7 text-indigo-600" />}
            color="indigo"
          />
          <StatCard
            title="Total Revenue"
            value={rupeeFormatter.format(stats.totalRevenue)}
            icon={<IndianRupee className="h-7 w-7 text-green-600" />}
            color="green"
          />
          <StatCard
            title="Active Users"
            value={stats.totalUsers.toLocaleString()}
            icon={<Users className="h-7 w-7 text-amber-600" />}
            color="amber"
          />
          <StatCard
            title="Active Services"
            value={stats.totalServices.toLocaleString()}
            icon={<ShoppingBag className="h-7 w-7 text-purple-600" />}
            color="purple"
          />
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <QuickActionCard
            to="/admin/services"
            title="Manage Services"
            desc="Add, edit or remove services"
            icon={<ShoppingBag className="h-8 w-8 text-indigo-600" />}
            bg="indigo"
          />
          <QuickActionCard
            to="/admin/bookings"
            title="View All Bookings"
            desc="Monitor platform bookings"
            icon={<Calendar className="h-8 w-8 text-blue-600" />}
            bg="blue"
          />
          <QuickActionCard
            to="/admin/users"
            title="View All Users"
            desc="View user details"
            icon={<Users className="h-8 w-8 text-green-600" />}
            bg="green"
          />
        </div>

        {/* Recent Bookings Table */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="px-6 py-5 border-b border-gray-200 flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900">
              Recent Bookings
            </h2>
            <Link
              to="/admin/bookings"
              className="text-indigo-600 hover:text-indigo-800 font-medium flex items-center gap-1 transition"
            >
              View All <ChevronRight size={18} />
            </Link>
          </div>

          <DataTable
            columns={bookingColumns}
            data={recentBookings}
            emptyMessage="No recent confirmed bookings yet."
            isLoading={loading}
          />
        </div>
      </div>
    </div>
  );
}
