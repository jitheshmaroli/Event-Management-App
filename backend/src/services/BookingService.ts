/* eslint-disable @typescript-eslint/no-explicit-any */
import { inject, injectable } from 'inversify';
import { startSession, Types } from 'mongoose';
import { TYPES } from '@/inversify/types';
import { IBookingRepository } from '@/interfaces/repositories/IBookingRepository';
import { IServiceRepository } from '@/interfaces/repositories/IServiceRepository';
import { IServiceService } from '@/interfaces/services/IServiceService';
import {
  IBookingService,
  CreateBookingInput,
} from '@/interfaces/services/IBookingService';
import { PaymentFactory } from './payment/PaymentFactory';
import { BadRequestError, NotFoundError, ConflictError } from '@/utils/errors';
import { BookingStatus, IBooking, PaymentStatus } from '@/models/Booking';
import {
  BOOKING_MAX_DAYS,
  REFUND_ALLOWED_DAYS_BEFORE,
  REFUND_PERCENTAGE,
  CURRENCY,
  RESERVED_TIMEOUT_MINUTES,
} from '@/constants/booking.constants';
import { addMinutes, differenceInDays, isBefore } from 'date-fns';
import { toUtcMidnight } from '@/utils/date.utils';

@injectable()
export class BookingService implements IBookingService {
  constructor(
    @inject(TYPES.BookingRepository) private _bookingRepo: IBookingRepository,
    @inject(TYPES.ServiceRepository) private _serviceRepo: IServiceRepository,
    @inject(TYPES.ServiceService) private _serviceService: IServiceService,
    @inject(TYPES.PaymentFactory) private _paymentFactory: PaymentFactory
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
      const start = toUtcMidnight(startDate);
      const end = toUtcMidnight(endDate);

      if (isBefore(end, start)) {
        throw new BadRequestError('End date must be after start date');
      }

      const days = differenceInDays(end, start) + 1;
      if (days > BOOKING_MAX_DAYS) {
        throw new BadRequestError(
          `Maximum booking duration is ${BOOKING_MAX_DAYS} days`
        );
      }
      if (days < 1) throw new BadRequestError('Invalid date range');

      const service = await this._serviceService.findById(serviceId);
      if (!service) throw new NotFoundError('Service not found');

      const hasConflict =
        await this._bookingRepo.hasOverlappingBookingOrReservation(
          serviceId,
          start,
          end
        );

      if (hasConflict) {
        throw new ConflictError('Selected dates are not available');
      }

      const totalAmount = service.pricePerDay * days;

      const paymentService = this._paymentFactory.getProvider('razorpay');
      const order = await paymentService.createOrder(
        totalAmount,
        `booking-user-${userId}`
      );

      if (!order?.id) {
        throw new Error('Failed to create Razorpay order');
      }

      const expiresAt = addMinutes(new Date(), RESERVED_TIMEOUT_MINUTES);

      const booking = await this._bookingRepo.create(
        {
          user: new Types.ObjectId(userId),
          service: new Types.ObjectId(serviceId),
          startDate: start,
          endDate: end,
          numberOfDays: days,
          totalAmount,
          status: BookingStatus.RESERVED,
          reservedUntil: expiresAt,
          expiresAt,
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

      const reservationAdded = await this._serviceRepo.addReservationRange(
        serviceId,
        {
          from: start,
          to: end,
          bookingId: booking._id,
        },
        session
      );

      if (!reservationAdded) {
        throw new ConflictError(
          'Reservation conflict - dates were taken in the meantime'
        );
      }

      await session.commitTransaction();

      return {
        booking,
        order: {
          id: order.id,
          amount: order.amount,
          currency: order.currency,
        },
        expiresAt: expiresAt.toISOString(),
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
      const booking = await this._bookingRepo.findByPaymentReferenceId(
        orderId,
        session
      );

      if (!booking) {
        throw new NotFoundError('Booking not found');
      }

      if (booking.status === BookingStatus.CONFIRMED) {
        throw new BadRequestError('Booking already confirmed');
      }

      if (booking.status !== BookingStatus.RESERVED) {
        throw new BadRequestError('Booking is not in reservable state');
      }

      if (new Date() > (booking.expiresAt || new Date(0))) {
        throw new BadRequestError('Reservation timeout expired');
      }

      const paymentService = this._paymentFactory.getProvider(
        booking.payment?.provider || 'razorpay'
      );

      const isValid = await paymentService.verifyPayment(paymentData);

      if (!isValid) {
        await this._bookingRepo.markAsFailedById(
          booking._id.toString(),
          session
        );
        throw new BadRequestError('Invalid payment signature');
      }

      // Confirm booking + unset reservation fields + update payment
      const confirmedBooking = await this._bookingRepo.confirmBooking(
        booking._id.toString(),
        {
          status: PaymentStatus.SUCCESS,
          referenceId: paymentData.razorpay_payment_id,
        },
        session
      );

      if (!confirmedBooking) {
        throw new Error('Failed to confirm booking');
      }

      // Finalize ranges (reserved → booked)
      await this._serviceRepo.finalizeBookingRanges(
        booking.service.toString(),
        booking._id,
        booking.startDate,
        booking.endDate,
        session
      );

      await session.commitTransaction();

      return confirmedBooking;
    } catch (err) {
      await session.abortTransaction();
      throw err;
    } finally {
      session.endSession();
    }
  }

  async cancelBooking(bookingId: string, userId: string) {
    const booking = await this._bookingRepo.findById(bookingId);
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

    const paymentService = this._paymentFactory.getProvider(
      booking.payment?.provider || 'razorpay'
    );

    const refund = await paymentService.refundPayment(
      booking.payment?.referenceId || '',
      refundAmount
    );

    const updated = await this._bookingRepo.updateStatus(
      bookingId,
      BookingStatus.CANCELLED
    );

    if (!updated) throw new Error('Failed to update booking status');

    await this._bookingRepo.updatePaymentStatus(
      booking.payment?.referenceId || '',
      {
        refundReferenceId: refund.id,
        refundStatus: PaymentStatus.REFUNDED,
      }
    );

    return updated;
  }

  async markAsFailed(
    bookingId: string
  ): Promise<IBooking | { message: string }> {
    const booking = await this._bookingRepo.findById(bookingId);
    if (!booking) throw new NotFoundError('Booking not found');

    if (
      booking.status !== BookingStatus.PENDING &&
      booking.status !== BookingStatus.RESERVED
    ) {
      return { message: 'Booking already processed' };
    }

    const updated = await this._bookingRepo.markAsFailedById(bookingId);
    if (!updated) throw new NotFoundError('Failed to update booking');

    if (booking.status === BookingStatus.RESERVED) {
      await this._bookingRepo.unsetReservationFields(bookingId);
    }

    return updated;
  }

  async getUserBookings(userId: string): Promise<IBooking[]> {
    return this._bookingRepo.findByUser(userId);
  }
}
