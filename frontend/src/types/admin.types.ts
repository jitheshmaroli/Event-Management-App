export interface AdminStats {
  totalUsers: number;
  totalServices: number;
  totalBookings: number;
  totalRevenue: number;
}

export interface RecentBooking {
  _id: string;
  user: { name: string; email: string };
  service: { title: string; pricePerDay: number };
  startDate: string;
  endDate: string;
  totalAmount: number;
  status: string;
  createdAt: string;
}

export interface DashboardResponse {
  stats: AdminStats;
  recentBookings: RecentBooking[];
}
