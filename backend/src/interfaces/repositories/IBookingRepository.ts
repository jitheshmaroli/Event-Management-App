import { ClientSession } from 'mongoose';
import { IBooking, PaymentStatus } from '@/models/Booking';
import { IBaseRepository } from './IBaseRepository';

export interface IBookingRepository extends IBaseRepository<IBooking> {
  findByUser(userId: string, status?: string): Promise<IBooking[]>;
  findOverlapping(
    serviceId: string,
    start: Date,
    end: Date,
    excludeId?: string
  ): Promise<IBooking | null>;
  hasOverlappingBookingOrReservation(
    serviceId: string,
    start: Date,
    end: Date
  ): Promise<boolean>;
  updateStatus(
    bookingId: string,
    status: string,
    session?: ClientSession
  ): Promise<IBooking | null>;
  updatePaymentStatus(
    orderId: string,
    data: Partial<IBooking['payment']>,
    session?: ClientSession
  ): Promise<IBooking | null>;
  findByPaymentReferenceId(
    orderId: string,
    session?: ClientSession
  ): Promise<IBooking | null>;
  confirmBooking(
    bookingId: string,
    paymentData: {
      status: PaymentStatus;
      referenceId: string;
    },
    session?: ClientSession
  ): Promise<IBooking | null>;
  markAsFailedById(
    bookingId: string,
    session?: ClientSession
  ): Promise<IBooking | null>;
  unsetReservationFields(
    bookingId: string,
    session?: ClientSession
  ): Promise<boolean>;
  getRevenueAndCount(): Promise<{
    totalConfirmed: number;
    totalRevenue: number;
  }>;
}
