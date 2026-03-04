export interface AdminDashboardStats {
  totalUsers: number;
  totalServices: number;
  totalBookings: number;
  totalRevenue: number;
}

export interface AdminDashboardResponse {
  stats: AdminDashboardStats;
  recentBookings: Array<{
    _id: string;
    user: { name: string; email: string };
    service: { title: string; pricePerDay: number };
    startDate: Date;
    endDate: Date;
    totalAmount: number;
    status: string;
    createdAt: Date;
  }>;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}
