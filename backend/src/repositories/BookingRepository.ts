/* eslint-disable @typescript-eslint/no-explicit-any */
import { injectable } from 'inversify';
import {
  Booking,
  BookingStatus,
  IBooking,
  PaymentStatus,
} from '@/models/Booking';
import { IBookingRepository } from '@/interfaces/repositories/IBookingRepository';
import { ClientSession } from 'mongoose';
import { BaseRepository } from './BaseRepository';

@injectable()
export class BookingRepository
  extends BaseRepository<IBooking>
  implements IBookingRepository
{
  constructor() {
    super(Booking);
  }

  async findByUser(userId: string, status?: string): Promise<IBooking[]> {
    const query: any = { user: userId };
    if (status) query.status = status;
    return this.model
      .find(query)
      .populate('service')
      .sort({ createdAt: -1 })
      .lean();
  }

  async findOverlapping(
    serviceId: string,
    start: Date,
    end: Date,
    excludeId?: string
  ): Promise<IBooking | null> {
    const query: any = {
      service: serviceId,
      status: { $in: ['pending', 'confirmed'] },
      $or: [{ startDate: { $lte: end }, endDate: { $gte: start } }],
    };
    if (excludeId) query._id = { $ne: excludeId };
    return this.model.findOne(query).lean();
  }

  async hasOverlappingBookingOrReservation(
    serviceId: string,
    start: Date,
    end: Date
  ): Promise<boolean> {
    const conflict = await this.model
      .findOne({
        service: serviceId,
        status: { $in: [BookingStatus.RESERVED, BookingStatus.CONFIRMED] },
        $or: [{ startDate: { $lte: end }, endDate: { $gte: start } }],
      })
      .lean();

    return !!conflict;
  }

  async updateStatus(
    bookingId: string,
    status: string,
    session?: ClientSession
  ): Promise<IBooking | null> {
    return this.model
      .findByIdAndUpdate(
        bookingId,
        { $set: { status } },
        { new: true, session }
      )
      .lean();
  }

  async updatePaymentStatus(
    referenceId: string,
    data: Partial<IBooking['payment']>,
    session?: ClientSession
  ): Promise<IBooking | null> {
    return this.model
      .findOneAndUpdate(
        { 'payment.referenceId': referenceId },
        { $set: { payment: data } },
        { new: true, session }
      )
      .lean();
  }

  async findByPaymentReferenceId(
    orderId: string,
    session?: ClientSession
  ): Promise<IBooking | null> {
    return this.model
      .findOne({ 'payment.referenceId': orderId })
      .session(session ?? null)
      .lean();
  }

  async confirmBooking(
    bookingId: string,
    paymentData: {
      status: PaymentStatus;
      referenceId: string;
    },
    session?: ClientSession
  ): Promise<IBooking | null> {
    return this.model
      .findByIdAndUpdate(
        bookingId,
        {
          $set: {
            status: BookingStatus.CONFIRMED,
            'payment.status': paymentData.status,
            'payment.referenceId': paymentData.referenceId,
          },
          $unset: {
            reservedUntil: '',
            expiresAt: '',
          },
        },
        { new: true, session }
      )
      .lean();
  }

  async markAsFailedById(
    bookingId: string,
    session?: ClientSession
  ): Promise<IBooking | null> {
    return this.model
      .findByIdAndUpdate(
        bookingId,
        { $set: { status: BookingStatus.FAILED } },
        { new: true, session }
      )
      .lean();
  }

  async unsetReservationFields(
    bookingId: string,
    session?: ClientSession
  ): Promise<boolean> {
    const result = await this.model.updateOne(
      { _id: bookingId },
      {
        $unset: {
          reservedUntil: '',
          expiresAt: '',
        },
      },
      { session }
    );
    return result.modifiedCount === 1;
  }

  async getRevenueAndCount(): Promise<{
    totalConfirmed: number;
    totalRevenue: number;
  }> {
    const result = await this.model.aggregate([
      {
        $match: { status: BookingStatus.CONFIRMED },
      },
      {
        $group: {
          _id: null,
          totalConfirmed: { $sum: 1 },
          totalRevenue: { $sum: '$totalAmount' },
        },
      },
    ]);

    return (
      result[0] || {
        totalConfirmed: 0,
        totalRevenue: 0,
      }
    );
  }
}
