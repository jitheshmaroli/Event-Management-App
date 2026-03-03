/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AlertCircle } from "lucide-react";
import { useAppSelector } from "@/hooks/useAppSelector";
import api from "@/lib/api";
import { DataTable } from "@/components/common/DataTable";
import Pagination from "@/components/common/Pagination";
import SearchBar from "@/components/common/SearchBar";
import { rupeeFormatter } from "@/utils/format";
import type { ApiResponse, Booking } from "@/types/booking.types";

export default function AdminBookings() {
  const navigate = useNavigate();
  const {
    user,
    isAuthenticated,
    isLoading: authLoading,
  } = useAppSelector((state) => state.auth);

  const [bookings, setBookings] = useState<Booking[]>([]);
  const [pagination, setPagination] = useState<
    ApiResponse["data"]["pagination"] | null
  >(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);

  useEffect(() => {
    if (!isAuthenticated && !authLoading) navigate("/login", { replace: true });
    if (user?.role !== "admin" && !authLoading)
      navigate("/my-bookings", { replace: true });
  }, [isAuthenticated, authLoading, user?.role, navigate]);

  useEffect(() => {
    if (!isAuthenticated || user?.role !== "admin") return;

    const fetchBookings = async () => {
      try {
        setLoading(true);
        setError(null);

        const params: Record<string, any> = { page, limit: 10 };
        if (statusFilter) params.status = statusFilter;
        if (searchTerm.trim()) params.search = searchTerm.trim();

        const res = await api.get<ApiResponse>("/admin/bookings", { params });
        const responseData = res.data.data;

        setBookings(responseData.data);
        setPagination(responseData.pagination);
      } catch (err: any) {
        setError(err.response?.data?.message || "Failed to load bookings");
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, [page, statusFilter, searchTerm, isAuthenticated, user?.role]);

  const columns = [
    {
      header: "Customer",
      accessor: (b: Booking) => (
        <div>
          <div className="font-medium text-gray-900">{b.user.name}</div>
          <div className="text-gray-500 text-xs">{b.user.email}</div>
        </div>
      ),
    },
    { header: "Service", accessor: (b: Booking) => b.service.title },
    {
      header: "Date From",
      accessor: (b: Booking) =>
        new Date(b.startDate).toLocaleDateString("en-IN", {
          day: "numeric",
          month: "short",
          year: "numeric",
        }),
    },
    {
      header: "Date To",
      accessor: (b: Booking) =>
        new Date(b.endDate).toLocaleDateString("en-IN", {
          day: "numeric",
          month: "short",
          year: "numeric",
        }),
    },
    {
      header: "Amount",
      accessor: (b: Booking) => rupeeFormatter.format(b.totalAmount),
      className: "font-medium text-gray-900",
    },
    {
      header: "Status",
      accessor: (b: Booking) => {
        const colors: Record<string, string> = {
          confirmed: "bg-green-100 text-green-800",
          pending: "bg-yellow-100 text-yellow-800",
          reserved: "bg-yellow-100 text-yellow-800",
          cancelled: "bg-red-100 text-red-800",
          failed: "bg-red-100 text-red-800",
        };
        return (
          <span
            className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
              colors[b.status.toLowerCase()] || "bg-gray-100 text-gray-800"
            }`}
          >
            {b.status.charAt(0).toUpperCase() + b.status.slice(1)}
          </span>
        );
      },
    },
    {
      header: "Booked On",
      accessor: (b: Booking) =>
        new Date(b.createdAt).toLocaleDateString("en-IN", {
          day: "numeric",
          month: "short",
          year: "numeric",
        }),
    },
  ];

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center text-center">
        <div className="max-w-md px-4">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Error</h2>
          <p className="text-gray-600 mb-6">{error}</p>
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

  return (
    <div className="min-h-screen bg-gray-50 py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Bookings</h1>
            <p className="mt-2 text-gray-600">Monitor all platform bookings</p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <SearchBar
              onSearch={setSearchTerm}
              placeholder="Search by customer or service..."
              className="w-full sm:w-80"
            />

            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setPage(1);
              }}
              className="px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
            >
              <option value="">All Statuses</option>
              <option value="confirmed">Confirmed</option>
              <option value="reserved">Reserved</option>
              <option value="pending">Pending</option>
              <option value="cancelled">Cancelled</option>
              <option value="failed">Failed</option>
            </select>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <DataTable
            columns={columns}
            data={bookings}
            isLoading={loading}
            emptyMessage={
              statusFilter || searchTerm
                ? "No matching bookings found"
                : "No bookings found"
            }
          />

          {pagination && pagination.pages > 1 && (
            <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
              <Pagination
                currentPage={page}
                totalPages={pagination.pages}
                totalItems={pagination.total}
                onPageChange={setPage}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
