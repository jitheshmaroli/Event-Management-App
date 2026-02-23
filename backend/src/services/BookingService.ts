/* eslint-disable @typescript-eslint/no-explicit-any */
import { inject, injectable } from 'inversify';
import { startSession, Types } from 'mongoose';
import { TYPES } from '@/inversify/types';
import { IBookingRepository } from '@/interfaces/repositories/IBookingRepository';
import { IServiceService } from '@/interfaces/services/IServiceService';
import {
  IBookingService,
  CreateBookingInput,
} from '@/interfaces/services/IBookingService';
import { PaymentFactory } from './payment/PaymentFactory';
import { BadRequestError, NotFoundError, ConflictError } from '@/utils/errors';
import {
  Booking,
  BookingStatus,
  IBooking,
  PaymentStatus,
} from '@/models/Booking';
import {
  BOOKING_MAX_DAYS,
  REFUND_ALLOWED_DAYS_BEFORE,
  REFUND_PERCENTAGE,
  CURRENCY,
} from '@/constants/booking.constants';
import { differenceInDays, isBefore, startOfDay } from 'date-fns';

@injectable()
export class BookingService implements IBookingService {
  constructor(
    @inject(TYPES.BookingRepository) private bookingRepo: IBookingRepository,
    @inject(TYPES.ServiceService) private serviceService: IServiceService,
    @inject(TYPES.PaymentFactory) private paymentFactory: PaymentFactory
  ) {}

  async createBooking({
    serviceId,
    startDate,
    endDate,
    userId,
  }: CreateBookingInput) {
    const session = await startSession();
    session.startTransaction();

    try {
      const start = startOfDay(new Date(startDate));
      const end = startOfDay(new Date(endDate));

      if (isBefore(end, start)) {
        throw new BadRequestError('End date must be after start date');
      }

      const days = differenceInDays(end, start) + 1;
      if (days > BOOKING_MAX_DAYS) {
        throw new BadRequestError(
          `Maximum booking duration is ${BOOKING_MAX_DAYS} days`
        );
      }
      if (days < 1) {
        throw new BadRequestError('Invalid date range');
      }

      const service = await this.serviceService.findById(serviceId);
      if (!service) throw new NotFoundError('Service not found');

      const conflict = await this.bookingRepo.findOverlapping(
        serviceId,
        start,
        end
      );
      if (conflict) {
        throw new ConflictError('Selected dates are not available');
      }

      const totalAmount = service.pricePerDay * days;

      // Razorpay Order
      const paymentService = this.paymentFactory.getProvider('razorpay');
      const order = await paymentService.createOrder(
        totalAmount,
        `booking-user-${userId}`
      );

      if (!order?.id) {
        throw new Error('Failed to create Razorpay order');
      }

      const booking = await this.bookingRepo.create(
        {
          user: new Types.ObjectId(userId),
          service: new Types.ObjectId(serviceId),
          startDate: start,
          endDate: end,
          numberOfDays: days,
          totalAmount,
          status: BookingStatus.PENDING,
          payment: {
            provider: 'razorpay',
            referenceId: order.id,
            status: PaymentStatus.PENDING,
            amount: totalAmount,
            currency: CURRENCY,
          },
        },
        session
      );

      await session.commitTransaction();

      return {
        booking,
        order: {
          id: order.id,
          amount: order.amount,
          currency: order.currency,
        },
      };
    } catch (err) {
      await session.abortTransaction();
      throw err;
    } finally {
      session.endSession();
    }
  }

  async verifyAndConfirmPayment(orderId: string, paymentData: any) {
    const session = await startSession();
    session.startTransaction();

    try {
      const booking = await Booking.findOne({
        'payment.referenceId': orderId,
      }).session(session);
      if (!booking) throw new NotFoundError('Booking not found');

      if (booking.payment.status !== PaymentStatus.PENDING) {
        throw new BadRequestError('Payment already processed');
      }

      const paymentService = this.paymentFactory.getProvider(
        booking.payment.provider
      );
      const isValid = await paymentService.verifyPayment(paymentData);

      if (!isValid) {
        await this.bookingRepo.updateStatus(
          booking._id.toString(),
          BookingStatus.FAILED,
          session
        );
        throw new BadRequestError('Invalid payment signature');
      }

      await this.bookingRepo.updatePaymentStatus(
        orderId,
        {
          status: PaymentStatus.SUCCESS,
          referenceId: paymentData.razorpay_payment_id,
        },
        session
      );

      await this.bookingRepo.updateStatus(
        booking._id.toString(),
        BookingStatus.CONFIRMED,
        session
      );

      await session.commitTransaction();
      return booking;
    } catch (err) {
      await session.abortTransaction();
      throw err;
    } finally {
      session.endSession();
    }
  }

  async cancelBooking(bookingId: string, userId: string) {
    const booking = await this.bookingRepo.findById(bookingId);
    if (!booking) throw new NotFoundError('Booking not found');
    if (booking.user.toString() !== userId) {
      throw new BadRequestError('Not authorized');
    }
    if (booking.status !== BookingStatus.CONFIRMED) {
      throw new BadRequestError('Cannot cancel this booking');
    }

    const daysUntilStart = differenceInDays(booking.startDate, new Date());
    if (daysUntilStart < REFUND_ALLOWED_DAYS_BEFORE) {
      throw new BadRequestError(
        `Cancellation not allowed within ${REFUND_ALLOWED_DAYS_BEFORE} days`
      );
    }

    const refundAmount = Math.round(booking.totalAmount * REFUND_PERCENTAGE);

    const paymentService = this.paymentFactory.getProvider(
      booking.payment.provider
    );
    const refund = await paymentService.refundPayment(
      booking.payment.referenceId,
      refundAmount
    );

    const updated = await this.bookingRepo.updateStatus(
      bookingId,
      BookingStatus.CANCELLED
    );
    if (!updated) throw new Error('Failed to update booking');

    // Update payment info
    await this.bookingRepo.updatePaymentStatus(booking.payment.referenceId, {
      refundReferenceId: refund.id,
      refundStatus: PaymentStatus.REFUNDED,
    });

    return updated!;
  }

  async markAsFailed(
    bookingId: string
  ): Promise<IBooking | { message: string }> {
    const booking = await this.bookingRepo.findById(bookingId);
    if (!booking) throw new NotFoundError('Booking not found');

    if (booking.status !== BookingStatus.PENDING) {
      return { message: 'Booking already processed' };
    }
    const updated = await this.bookingRepo.updateStatus(
      bookingId,
      BookingStatus.FAILED
    );
    if (!updated) throw new NotFoundError('Failed to update booking');

    await this.bookingRepo.updatePaymentStatus(updated.payment.referenceId, {
      status: PaymentStatus.FAILED,
    });

    return updated;
  }

  async getUserBookings(userId: string): Promise<IBooking[]> {
    return this.bookingRepo.findByUser(userId);
  }
}
