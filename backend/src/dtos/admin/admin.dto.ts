import { IBooking } from '@/models/Booking';
import { UserDto } from '../auth/user.dto';

export interface AdminDashboardStats {
  totalUsers: number;
  totalServices: number;
  totalBookings: number;
  totalRevenue: number;
}

export interface RecentBookingResponse {
  _id: string;
  user: Pick<UserDto, 'name' | 'email'>;
  service: { title: string; pricePerDay: number };
  startDate: Date;
  endDate: Date;
  totalAmount: number;
  status: string;
  createdAt: Date;
}

export interface AdminDashboardResponse {
  stats: AdminDashboardStats;
  recentBookings: RecentBookingResponse[];
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

export interface PopulatedBooking extends Omit<IBooking, 'user' | 'service'> {
  user: Pick<UserDto, 'name' | 'email'>;
  service: { title: string; pricePerDay: number };
  createdAt: Date;
}
