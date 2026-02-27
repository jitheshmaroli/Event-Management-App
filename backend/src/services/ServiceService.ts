import {
  CreateServiceInput,
  UpdateServiceInput,
  ServiceQueryParams,
  PaginatedResponse,
} from '@/dtos/service/service.dto';
import { IServiceRepository } from '@/interfaces/repositories/IServiceRepository';
import { IServiceService } from '@/interfaces/services/IServiceService';
import { TYPES } from '@/inversify/types';
import { IService } from '@/models/Service';
import { BadRequestError, NotFoundError } from '@/utils/errors';
import { deleteS3Objects, getSignedImageUrls } from '@/utils/s3Utils';
import { inject, injectable } from 'inversify';
import { QueryFilter } from 'mongoose';
import { isWithinInterval } from 'date-fns';
import {
  normalizeRanges,
  toDateString,
  toUtcMidnight,
} from '@/utils/date.utils';
import logger from '@/utils/logger';
import {
  DEFAULT_LIMIT,
  DEFAULT_PAGE,
  FIXED_IMAGE_COUNT,
  SORT_MAPPING,
  SortOption,
} from '@/constants/service.constants';

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
        ...(service.availability || {}),
        availableRanges:
          data.availability.availableRanges !== undefined
            ? normalizeRanges(data.availability.availableRanges)
            : service.availability?.availableRanges || [],
        bookedRanges:
          data.availability.bookedRanges !== undefined
            ? normalizeRanges(data.availability.bookedRanges)
            : service.availability?.bookedRanges || [],
      };
    }

    let finalImages = [...(service.images || [])];

    if (data.removedImages?.length) {
      finalImages = finalImages.filter(
        (key) => !data.removedImages!.includes(key)
      );

      const deletedCount = await deleteS3Objects(data.removedImages);
      if (deletedCount !== data.removedImages.length) {
        logger.warn(
          `Only ${deletedCount}/${data.removedImages.length} images deleted from S3`
        );
      }
    }

    if (data.images?.length) {
      finalImages.push(...data.images);
    }

    if (finalImages.length !== FIXED_IMAGE_COUNT) {
      throw new BadRequestError(
        `Service must have exactly ${FIXED_IMAGE_COUNT} images after update. Final count: ${finalImages.length}`
      );
    }

    finalImages = [...new Set(finalImages)];

    updateData.images = finalImages;

    const updated = await this.serviceRepo.updateById(id, updateData);
    if (!updated) throw new NotFoundError('Update failed');

    return updated;
  }

  async findMany(
    query: ServiceQueryParams
  ): Promise<PaginatedResponse<IService & { signedImages?: string[] }>> {
    const page = Number(query.page) || DEFAULT_PAGE;
    const limit = Number(query.limit) || DEFAULT_LIMIT;
    const skip = (page - 1) * limit;

    const filter = this.buildFilter(query);

    const sort = SORT_MAPPING[query.sort as SortOption] || SORT_MAPPING.newest;

    const [services, total] = await Promise.all([
      this.serviceRepo.findMany(filter, { skip, limit, sort }),
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

  private buildFilter(query: ServiceQueryParams): QueryFilter<IService> {
    const filter: QueryFilter<IService> = {};
    const { search, category, minPrice, maxPrice, dateFrom, dateTo } = query;

    if (search?.trim()) {
      const searchTerm = search.trim();

      filter.title = { $regex: searchTerm, $options: 'i' };
    }

    if (category) {
      filter.category = category.toLowerCase();
    }

    if (minPrice !== undefined || maxPrice !== undefined) {
      filter.pricePerDay = {};
      if (minPrice !== undefined) {
        filter.pricePerDay.$gte = Number(minPrice);
      }
      if (maxPrice !== undefined) {
        filter.pricePerDay.$lte = Number(maxPrice);
      }
    }

    if (dateFrom || dateTo) {
      const conditions: QueryFilter<IService>[] = [];

      const bookedCondition = {
        'availability.bookedRanges': {
          $not: {
            $elemMatch: {
              $or: [
                {
                  from: { $lte: toUtcMidnight(dateTo || '2099-12-31') },
                  to: { $gte: toUtcMidnight(dateFrom || '2000-01-01') },
                },
              ],
            },
          },
        },
      };

      if (dateFrom && dateTo) {
        const start = toUtcMidnight(dateFrom);
        const end = toUtcMidnight(dateTo);

        conditions.push({
          $and: [
            bookedCondition,
            {
              $or: [
                { 'availability.availableRanges.0': { $exists: false } },
                {
                  'availability.availableRanges': {
                    $elemMatch: {
                      from: { $lte: start },
                      to: { $gte: end },
                    },
                  },
                },
              ],
            },
          ],
        });
      } else if (dateFrom) {
        const start = toUtcMidnight(dateFrom);

        conditions.push({
          $and: [
            bookedCondition,
            {
              $or: [
                { 'availability.availableRanges.0': { $exists: false } },
                {
                  'availability.availableRanges': {
                    $elemMatch: {
                      to: { $gte: start },
                    },
                  },
                },
              ],
            },
          ],
        });
      } else if (dateTo) {
        const end = toUtcMidnight(dateTo);

        conditions.push({
          $and: [
            bookedCondition,
            {
              $or: [
                { 'availability.availableRanges.0': { $exists: false } },
                {
                  'availability.availableRanges': {
                    $elemMatch: {
                      from: { $lte: end },
                    },
                  },
                },
              ],
            },
          ],
        });
      }

      if (conditions.length > 0) {
        filter.$and = conditions;
      }
    }

    return filter;
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
  }> {
    const service = await this.serviceRepo.findById(id);
    if (!service) throw new NotFoundError('Service not found');

    const start = new Date(Date.UTC(year, month - 1, 1));
    const end = new Date(Date.UTC(year, month, 0));

    const availableRanges = service.availability.availableRanges || [];
    const bookedRanges = service.availability.bookedRanges || [];
    const hasAvailableRanges = availableRanges.length > 0;

    const availableDates: string[] = [];
    const bookedDates: string[] = [];

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

      const isAvailable =
        !hasAvailableRanges ||
        availableRanges.some((r) =>
          isWithinInterval(dayMidnight, { start: r.from, end: r.to })
        );

      if (isAvailable) {
        availableDates.push(dayStr);
      }
    }

    return { availableDates, bookedDates };
  }
}
