import {
  CreateServiceInput,
  UpdateServiceInput,
  ServiceQueryParams,
} from '@/dtos/service/service.dto';
import { IServiceRepository } from '@/interfaces/repositories/IServiceRepository';
import { IServiceService } from '@/interfaces/services/IServiceService';
import { TYPES } from '@/inversify/types';
import { IService } from '@/models/Service';
import { NotFoundError } from '@/utils/errors';
import { getSignedImageUrls } from '@/utils/s3Utils';
import { inject, injectable } from 'inversify';
import { QueryFilter } from 'mongoose';
import { isWithinInterval } from 'date-fns';
import {
  normalizeRanges,
  toDateString,
  toUtcMidnight,
} from '@/utils/date.utils';

@injectable()
export class ServiceService implements IServiceService {
  constructor(
    @inject(TYPES.ServiceRepository) private serviceRepo: IServiceRepository
  ) {}

  async create(data: CreateServiceInput): Promise<IService> {
    const { availability } = data;

    return this.serviceRepo.create({
      ...data,
      availability: {
        availableRanges: normalizeRanges(availability?.availableRanges),
        blockedRanges: normalizeRanges(availability?.blockedRanges),
        bookedRanges: normalizeRanges(availability?.bookedRanges),
      },
      images: data.images ?? [],
    });
  }

  async update(id: string, data: UpdateServiceInput): Promise<IService> {
    const service = await this.serviceRepo.findById(id);
    if (!service) throw new NotFoundError('Service not found');

    const updateData: Partial<IService> = {};

    if (data.title !== undefined) updateData.title = data.title;
    if (data.category !== undefined) updateData.category = data.category;
    if (data.description !== undefined)
      updateData.description = data.description;
    if (data.pricePerDay !== undefined)
      updateData.pricePerDay = data.pricePerDay;
    if (data.location !== undefined) updateData.location = data.location;
    if (data.phone !== undefined) updateData.phone = data.phone;

    if (data.availability) {
      updateData.availability = {
        availableRanges: normalizeRanges(data.availability.availableRanges),
        blockedRanges: normalizeRanges(data.availability.blockedRanges),
        bookedRanges: normalizeRanges(data.availability.bookedRanges),
      };
    }

    if (data.images !== undefined) {
      updateData.images = data.images;
    }

    const updated = await this.serviceRepo.updateById(id, updateData);
    if (!updated) throw new NotFoundError('Update failed');

    return updated;
  }

  async findMany(query: ServiceQueryParams): Promise<{
    services: Array<IService & { signedImages?: string[] }>;
    pagination: { page: number; limit: number; total: number; pages: number };
  }> {
    const {
      search,
      category,
      location,
      minPrice,
      maxPrice,
      date,
      page = 1,
      limit = 12,
      sort = 'newest',
    } = query;

    const filter: QueryFilter<IService> = {};

    if (search?.trim()) {
      filter.$text = { $search: search.trim() };
    }

    if (category) {
      filter.category = category.toLowerCase();
    }

    if (location?.trim()) {
      filter.location = { $regex: location.trim(), $options: 'i' };
    }

    if (minPrice !== undefined || maxPrice !== undefined) {
      filter.pricePerDay = {};
      if (minPrice !== undefined) filter.pricePerDay.$gte = minPrice;
      if (maxPrice !== undefined) filter.pricePerDay.$lte = maxPrice;
    }

    if (date) {
      const target = toUtcMidnight(date);

      filter.$and = [
        {
          $or: [
            { 'availability.availableRanges.0': { $exists: false } },
            {
              'availability.availableRanges': {
                $elemMatch: {
                  from: { $lte: target },
                  to: { $gte: target },
                },
              },
            },
          ],
        },
        {
          'availability.blockedRanges': {
            $not: {
              $elemMatch: {
                from: { $lte: target },
                to: { $gte: target },
              },
            },
          },
        },
        {
          'availability.bookedRanges': {
            $not: {
              $elemMatch: {
                from: { $lte: target },
                to: { $gte: target },
              },
            },
          },
        },
      ];
    }

    let sortOption: Record<string, 1 | -1> = { createdAt: -1 };
    if (sort === 'price_asc') sortOption = { pricePerDay: 1 };
    if (sort === 'price_desc') sortOption = { pricePerDay: -1 };
    if (sort === 'oldest') sortOption = { createdAt: 1 };

    const skip = (page - 1) * limit;

    const [services, total] = await Promise.all([
      this.serviceRepo.findMany(filter, { skip, limit, sort: sortOption }),
      this.serviceRepo.count(filter),
    ]);

    const servicesWithSignedUrls = await Promise.all(
      services.map(async (service) => {
        const signedImages = await getSignedImageUrls(
          service.images || [],
          7200
        );
        return { ...service, signedImages };
      })
    );

    return {
      services: servicesWithSignedUrls,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    };
  }

  async findById(id: string): Promise<IService & { signedImages?: string[] }> {
    const service = await this.serviceRepo.findById(id);
    if (!service) throw new NotFoundError('Service not found');

    const signedImages = await getSignedImageUrls(service.images || [], 7200);

    return { ...service, signedImages };
  }

  async delete(id: string): Promise<void> {
    const service = await this.serviceRepo.findById(id);
    if (!service) throw new NotFoundError('Service not found');

    await this.serviceRepo.deleteById(id);
  }

  async getAvailability(
    id: string,
    year: number,
    month: number
  ): Promise<{
    availableDates: string[];
    bookedDates: string[];
    blockedDates: string[];
  }> {
    const service = await this.serviceRepo.findById(id);
    if (!service) throw new NotFoundError('Service not found');

    const start = new Date(Date.UTC(year, month - 1, 1));
    const end = new Date(Date.UTC(year, month, 0));

    const availableRanges = service.availability.availableRanges || [];
    const blockedRanges = service.availability.blockedRanges || [];
    const bookedRanges = service.availability.bookedRanges || [];
    const hasAvailableRanges = availableRanges.length > 0;

    const availableDates: string[] = [];
    const bookedDates: string[] = [];
    const blockedDates: string[] = [];

    for (
      let d = new Date(start);
      d <= end;
      d = new Date(
        Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate() + 1)
      )
    ) {
      const dayMidnight = new Date(
        Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate())
      );

      const dayStr = toDateString(dayMidnight);

      const isBooked = bookedRanges.some((r) =>
        isWithinInterval(dayMidnight, { start: r.from, end: r.to })
      );
      if (isBooked) {
        bookedDates.push(dayStr);
        continue;
      }

      const isBlocked = blockedRanges.some((r) =>
        isWithinInterval(dayMidnight, { start: r.from, end: r.to })
      );
      if (isBlocked) {
        blockedDates.push(dayStr);
        continue;
      }

      const isAvailable =
        !hasAvailableRanges ||
        availableRanges.some((r) =>
          isWithinInterval(dayMidnight, { start: r.from, end: r.to })
        );

      if (isAvailable) {
        availableDates.push(dayStr);
      }
    }

    return { availableDates, bookedDates, blockedDates };
  }
}
