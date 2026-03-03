/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AlertCircle } from "lucide-react";
import { useAppSelector } from "@/hooks/useAppSelector";
import api from "@/lib/api";
import { DataTable } from "@/components/common/DataTable";
import Pagination from "@/components/common/Pagination";
import SearchBar from "@/components/common/SearchBar";

interface User {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  role: string;
  isVerified: boolean;
  createdAt: string;
}

interface ApiResponse {
  success: boolean;
  message: string;
  data: {
    data: User[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      pages: number;
    };
  };
}

export default function AdminUsers() {
  const navigate = useNavigate();
  const {
    user,
    isAuthenticated,
    isLoading: authLoading,
  } = useAppSelector((state) => state.auth);

  const [users, setUsers] = useState<User[]>([]);
  const [pagination, setPagination] = useState<
    ApiResponse["data"]["pagination"] | null
  >(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);

  useEffect(() => {
    if (!isAuthenticated && !authLoading) navigate("/login", { replace: true });
    if (user?.role !== "admin" && !authLoading)
      navigate("/my-bookings", { replace: true });
  }, [isAuthenticated, authLoading, user?.role, navigate]);

  useEffect(() => {
    if (!isAuthenticated || user?.role !== "admin") return;

    const fetchUsers = async () => {
      try {
        setLoading(true);
        setError(null);

        const params: Record<string, any> = { page, limit: 10 };
        if (searchTerm.trim()) params.search = searchTerm.trim();

        const res = await api.get<ApiResponse>("/admin/users", { params });
        const responseData = res.data.data;

        setUsers(responseData.data);
        setPagination(responseData.pagination);
      } catch (err: any) {
        setError(err.response?.data?.message || "Failed to load users");
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [page, searchTerm, isAuthenticated, user?.role]);

  const columns = [
    {
      header: "Name",
      accessor: (u: User) => (
        <div className="font-medium text-gray-900">{u.name}</div>
      ),
    },
    {
      header: "Email",
      accessor: "email" as keyof User,
    },
    {
      header: "Phone",
      accessor: "phone" as keyof User,
    },
    {
      header: "Role",
      accessor: (u: User) => (
        <span
          className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
            u.role === "admin"
              ? "bg-purple-100 text-purple-800"
              : "bg-blue-100 text-blue-800"
          }`}
        >
          {u.role}
        </span>
      ),
    },
    {
      header: "Verified",
      accessor: (u: User) => (
        <span
          className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
            u.isVerified
              ? "bg-green-100 text-green-800"
              : "bg-red-100 text-red-800"
          }`}
        >
          {u.isVerified ? "Yes" : "No"}
        </span>
      ),
    },
    {
      header: "Joined",
      accessor: (u: User) =>
        new Date(u.createdAt).toLocaleDateString("en-IN", {
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
            <h1 className="text-3xl font-bold text-gray-900">Users</h1>
            <p className="mt-2 text-gray-600">Manage platform users</p>
          </div>

          <SearchBar
            onSearch={setSearchTerm}
            placeholder="Search by name or email..."
            className="w-full sm:w-80"
          />
        </div>

        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <DataTable
            columns={columns}
            data={users}
            isLoading={loading}
            emptyMessage={
              searchTerm
                ? `No users matching "${searchTerm}"`
                : "No users found"
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
