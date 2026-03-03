/* eslint-disable @typescript-eslint/no-explicit-any */
import { inject, injectable } from 'inversify';
import { TYPES } from '@/inversify/types';
import { IAdminService } from '@/interfaces/services/IAdminService';
import { IUserRepository } from '@/interfaces/repositories/IUserRepository';
import { IServiceRepository } from '@/interfaces/repositories/IServiceRepository';
import { IBookingRepository } from '@/interfaces/repositories/IBookingRepository';
import {
  AdminDashboardResponse,
  PaginatedResponse,
} from '@/dtos/admin/admin.dto';
import { BookingStatus, IBooking } from '@/models/Booking';
import { IUser } from '@/models/User';

@injectable()
export class AdminService implements IAdminService {
  constructor(
    @inject(TYPES.UserRepository) private _userRepo: IUserRepository,
    @inject(TYPES.ServiceRepository) private _serviceRepo: IServiceRepository,
    @inject(TYPES.BookingRepository) private _bookingRepo: IBookingRepository
  ) {}

  async getDashboardData(): Promise<AdminDashboardResponse> {
    const [userCount, serviceCount, bookingStats, recentBookings] =
      await Promise.all([
        this._userRepo.count({}),
        this._serviceRepo.count({}),
        this._bookingRepo.getRevenueAndCount(),
        this._bookingRepo.findMany(
          { status: BookingStatus.CONFIRMED },
          {
            limit: 5,
            sort: { createdAt: -1 },
            populate: [
              { path: 'user', select: 'name email' },
              { path: 'service', select: 'title pricePerDay' },
            ],
          }
        ),
      ]);

    return {
      stats: {
        totalUsers: userCount,
        totalServices: serviceCount,
        totalBookings: bookingStats.totalConfirmed,
        totalRevenue: bookingStats.totalRevenue || 0,
      },
      recentBookings: recentBookings.map((b) => ({
        _id: b._id.toString(),
        user: b.user as any,
        service: b.service as any,
        startDate: b.startDate,
        endDate: b.endDate,
        totalAmount: b.totalAmount,
        status: b.status,
        createdAt: b.createdAt,
      })),
    };
  }

  async getUsers(
    page: number,
    limit: number,
    search?: string
  ): Promise<PaginatedResponse<IUser>> {
    const filter: any = {};
    if (search?.trim()) {
      filter.$or = [
        { name: { $regex: search.trim(), $options: 'i' } },
        { email: { $regex: search.trim(), $options: 'i' } },
      ];
    }

    const skip = (page - 1) * limit;

    const [users, total] = await Promise.all([
      this._userRepo.findMany(filter, {
        skip,
        limit,
        sort: { createdAt: -1 },
        projection: '-password -refreshToken -otp -otpCreatedAt',
      }),
      this._userRepo.count(filter),
    ]);

    return {
      data: users,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    };
  }

  async getBookings(
    page: number,
    limit: number,
    status?: string
  ): Promise<PaginatedResponse<IBooking>> {
    const filter: any = {};
    if (status) filter.status = status;

    const skip = (page - 1) * limit;

    const [bookings, total] = await Promise.all([
      this._bookingRepo.findMany(filter, {
        skip,
        limit,
        sort: { createdAt: -1 },
        populate: [
          { path: 'user', select: 'name email' },
          { path: 'service', select: 'title pricePerDay location' },
        ],
      }),
      this._bookingRepo.count(filter),
    ]);

    return {
      data: bookings,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    };
  }
}
