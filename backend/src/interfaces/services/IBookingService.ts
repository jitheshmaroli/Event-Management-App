/* eslint-disable @typescript-eslint/no-explicit-any */
import { IBooking } from '@/models/Booking';

export interface CreateBookingInput {
  serviceId: string;
  startDate: string;
  endDate: string;
  userId: string;
}

export interface IBookingService {
  createBooking(
    input: CreateBookingInput
  ): Promise<{ booking: IBooking; order: any }>;
  verifyAndConfirmPayment(orderId: string, paymentData: any): Promise<IBooking>;
  cancelBooking(bookingId: string, userId: string): Promise<IBooking>;
  markAsFailed(bookingId: string): Promise<IBooking | { message: string }>;
  getUserBookings(userId: string): Promise<IBooking[]>;
}
