import { injectable } from 'inversify';
import { Service, IService } from '@/models/Service';
import { IServiceRepository } from '@/interfaces/repositories/IServiceRepository';
import { ClientSession, Types } from 'mongoose';
import { BaseRepository } from './BaseRepository';

@injectable()
export class ServiceRepository
  extends BaseRepository<IService>
  implements IServiceRepository
{
  constructor() {
    super(Service);
  }

  async addReservationRange(
    serviceId: string,
    range: { from: Date; to: Date; bookingId: Types.ObjectId },
    session?: ClientSession
  ): Promise<boolean> {
    const result = await this.model.updateOne(
      {
        _id: serviceId,
        $nor: [
          {
            'availability.reservedRanges': {
              $elemMatch: {
                $or: [{ from: { $lte: range.to }, to: { $gte: range.from } }],
              },
            },
          },
        ],
      },
      {
        $addToSet: {
          'availability.reservedRanges': range,
        },
      },
      { session }
    );

    return result.modifiedCount === 1;
  }

  async finalizeBookingRanges(
    serviceId: string,
    bookingId: Types.ObjectId,
    start: Date,
    end: Date,
    session?: ClientSession
  ): Promise<void> {
    await this.model.updateOne(
      { _id: serviceId },
      {
        $pull: {
          'availability.reservedRanges': { bookingId },
        },
        $addToSet: {
          'availability.bookedRanges': { from: start, to: end },
        },
      },
      { session }
    );
  }

  async releaseExpiredReservation(
    bookingId: Types.ObjectId,
    session?: ClientSession
  ): Promise<void> {
    await this.model.updateOne(
      { 'availability.reservedRanges.bookingId': bookingId },
      {
        $pull: {
          'availability.reservedRanges': { bookingId },
        },
      },
      { session }
    );
  }
}
