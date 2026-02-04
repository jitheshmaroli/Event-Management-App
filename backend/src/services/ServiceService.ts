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

@injectable()
export class ServiceService implements IServiceService {
  constructor(
    @inject(TYPES.ServiceRepository) private serviceRepo: IServiceRepository
  ) {}

  async create(data: CreateServiceInput): Promise<IService> {
    const blockedRanges = data.availability.blockedRanges.map((r) => ({
      from: new Date(r.from),
      to: new Date(r.to),
      reason: r.reason,
    }));
    console.log(data);

    return this.serviceRepo.create({
      ...data,
      availability: {
        defaultAvailable: data.availability.defaultAvailable,
        blockedRanges,
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

    if (data.contactDetails) {
      updateData.contactDetails = {
        ...service.contactDetails,
        ...data.contactDetails,
      };
    }
    if (data.availability) {
      updateData.availability = {
        defaultAvailable: data.availability.defaultAvailable,
        blockedRanges: data.availability.blockedRanges.map((r) => ({
          from: new Date(r.from),
          to: new Date(r.to),
          reason: r.reason,
        })),
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
      const target = new Date(date);
      target.setHours(0, 0, 0, 0);

      filter.$or = [
        {
          'availability.defaultAvailable': true,
          $nor: [
            {
              'availability.blockedRanges': {
                $elemMatch: {
                  from: { $lte: target },
                  to: { $gte: target },
                },
              },
            },
          ],
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
}
