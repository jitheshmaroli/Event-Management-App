import { inject, injectable } from 'inversify';
import { Request, Response, NextFunction } from 'express';
import { TYPES } from '@/inversify/types';
import { IBookingService } from '@/interfaces/services/IBookingService';
import { AuthenticatedRequest } from '@/middlewares/auth.middleware';
import { successResponse } from '@/utils/response';
import { HTTP_STATUS } from '@/constants/httpStatusCode';

@injectable()
export class BookingController {
  constructor(
    @inject(TYPES.BookingService) private bookingService: IBookingService
  ) {}

  async createBooking(
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { serviceId, startDate, endDate } = req.body;
      const result = await this.bookingService.createBooking({
        serviceId,
        startDate,
        endDate,
        userId: req.user!.userId,
      });

      return successResponse(
        res,
        'Booking initiated',
        result,
        HTTP_STATUS.CREATED
      );
    } catch (err) {
      next(err);
    }
  }

  async verifyPayment(req: Request, res: Response, next: NextFunction) {
    try {
      const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
        req.body;

      const booking = await this.bookingService.verifyAndConfirmPayment(
        razorpay_order_id,
        {
          razorpay_order_id,
          razorpay_payment_id,
          razorpay_signature,
        }
      );

      return successResponse(res, 'Payment verified & booking confirmed', {
        booking,
      });
    } catch (err) {
      next(err);
    }
  }

  async cancelBooking(
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ) {
    try {
      const id = req.params.id as string;
      const booking = await this.bookingService.cancelBooking(
        id,
        req.user!.userId
      );
      return successResponse(res, 'Booking cancelled successfully', {
        booking,
      });
    } catch (err) {
      next(err);
    }
  }

  async markBookingAsFailed(
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ) {
    try {
      const id = req.params.id as string;

      const updated = await this.bookingService.markAsFailed(id);

      return successResponse(res, 'Booking marked as failed', {
        booking: updated,
      });
    } catch (err) {
      next(err);
    }
  }

  async getMyBookings(
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ) {
    try {
      const bookings = await this.bookingService.getUserBookings(
        req.user!.userId
      );
      return successResponse(res, 'Bookings fetched', bookings);
    } catch (err) {
      next(err);
    }
  }
}
