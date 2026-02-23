/* eslint-disable @typescript-eslint/no-explicit-any */
import { injectable } from 'inversify';
import { Booking, IBooking } from '@/models/Booking';
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
}
