import { IService } from '@/models/Service';
import { ClientSession, QueryFilter, Types } from 'mongoose';

export interface IServiceRepository {
  create(serviceData: IService): Promise<IService>;
  updateById(id: string, update: Partial<IService>): Promise<IService | null>;
  deleteById(id: string): Promise<boolean>;
  findById(id: string): Promise<IService | null>;
  findMany(
    filter: QueryFilter<IService>,
    options: {
      skip?: number;
      limit?: number;
      sort?: Record<string, 1 | -1>;
    }
  ): Promise<IService[]>;
  count(filter: QueryFilter<IService>): Promise<number>;
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
