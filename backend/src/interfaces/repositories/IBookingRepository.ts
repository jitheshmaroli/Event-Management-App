import { ClientSession } from 'mongoose';
import { IBooking } from '@/models/Booking';

export interface IBookingRepository {
  create(
    booking: Partial<IBooking>,
    session?: ClientSession
  ): Promise<IBooking>;
  findById(id: string): Promise<IBooking | null>;
  findByUser(userId: string, status?: string): Promise<IBooking[]>;
  findOverlapping(
    serviceId: string,
    start: Date,
    end: Date,
    excludeId?: string
  ): Promise<IBooking | null>;
  updateStatus(
    id: string,
    status: string,
    session?: ClientSession
  ): Promise<IBooking | null>;
  updatePaymentStatus(
    orderId: string,
    data: Partial<IBooking['payment']>,
    session?: ClientSession
  ): Promise<IBooking | null>;
}
