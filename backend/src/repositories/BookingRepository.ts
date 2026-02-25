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

@injectable()
export class BookingRepository implements IBookingRepository {
  async create(
    booking: Partial<IBooking>,
    session?: ClientSession
  ): Promise<IBooking> {
    const doc = new Booking(booking);
    return session ? doc.save({ session }) : doc.save();
  }

  async findById(id: string): Promise<IBooking | null> {
    return Booking.findById(id).lean();
  }

  async findByUser(userId: string, status?: string): Promise<IBooking[]> {
    const query: any = { user: userId };
    if (status) query.status = status;
    return Booking.find(query).sort({ createdAt: -1 }).lean();
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
    return Booking.findOne(query).lean();
  }

  async hasOverlappingBookingOrReservation(
    serviceId: string,
    start: Date,
    end: Date
  ): Promise<boolean> {
    const conflict = await Booking.findOne({
      service: serviceId,
      status: { $in: [BookingStatus.RESERVED, BookingStatus.CONFIRMED] },
      $or: [{ startDate: { $lte: end }, endDate: { $gte: start } }],
    }).lean();

    return !!conflict;
  }

  async updateStatus(
    id: string,
    status: string,
    session?: ClientSession
  ): Promise<IBooking | null> {
    return Booking.findByIdAndUpdate(
      id,
      { $set: { status } },
      { new: true, session }
    ).lean();
  }

  async updatePaymentStatus(
    referenceId: string,
    data: Partial<IBooking['payment']>,
    session?: ClientSession
  ): Promise<IBooking | null> {
    return Booking.findOneAndUpdate(
      { 'payment.referenceId': referenceId },
      { $set: { payment: data } },
      { new: true, session }
    ).lean();
  }

  async findByPaymentReferenceId(
    orderId: string,
    session?: ClientSession
  ): Promise<IBooking | null> {
    return Booking.findOne({ 'payment.referenceId': orderId })
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
    return Booking.findByIdAndUpdate(
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
    ).lean();
  }

  async markAsFailedById(
    bookingId: string,
    session?: ClientSession
  ): Promise<IBooking | null> {
    return Booking.findByIdAndUpdate(
      bookingId,
      { $set: { status: BookingStatus.FAILED } },
      { new: true, session }
    ).lean();
  }

  async unsetReservationFields(
    bookingId: string,
    session?: ClientSession
  ): Promise<boolean> {
    const result = await Booking.updateOne(
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
}
