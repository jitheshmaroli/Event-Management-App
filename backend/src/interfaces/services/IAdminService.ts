import {
  AdminDashboardResponse,
  PaginatedResponse,
} from '@/dtos/admin/admin.dto';
import { IBooking } from '@/models/Booking';
import { IUser } from '@/models/User';

export interface IAdminService {
  getDashboardData(): Promise<AdminDashboardResponse>;
  getUsers(
    page: number,
    limit: number,
    search?: string
  ): Promise<PaginatedResponse<IUser>>;
  getBookings(
    page: number,
    limit: number,
    status?: string
  ): Promise<PaginatedResponse<IBooking>>;
}
