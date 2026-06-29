import { IBooking } from '@/models/Booking';
import { BookingOrder } from '@/types/Booking';
import { PaymentVerificationData } from '@/types/razorpay';

export interface CreateBookingInput {
  serviceId: string;
  startDate: string;
  endDate: string;
  userId: string;
}

export interface IBookingService {
  createBooking(
    input: CreateBookingInput
  ): Promise<{ booking: IBooking; order: BookingOrder }>;
  verifyAndConfirmPayment(
    orderId: string,
    paymentData: PaymentVerificationData
  ): Promise<IBooking>;
  cancelBooking(bookingId: string, userId: string): Promise<IBooking>;
  markAsFailed(bookingId: string): Promise<IBooking | { message: string }>;
  getUserBookings(userId: string): Promise<IBooking[]>;
}
