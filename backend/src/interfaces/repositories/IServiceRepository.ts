import { ClientSession, Types } from 'mongoose';
import { IBaseRepository } from './IBaseRepository';
import { IService } from '@/models/Service';

export interface IServiceRepository extends IBaseRepository<IService> {
  addReservationRange(
    serviceId: string,
    range: { from: Date; to: Date; bookingId: Types.ObjectId },
    session?: ClientSession
  ): Promise<boolean>;
  finalizeBookingRanges(
    serviceId: string,
    bookingId: Types.ObjectId,
    start: Date,
    end: Date,
    session?: ClientSession
  ): Promise<void>;
  releaseExpiredReservation(
    bookingId: Types.ObjectId,
    session?: ClientSession
  ): Promise<void>;
}
