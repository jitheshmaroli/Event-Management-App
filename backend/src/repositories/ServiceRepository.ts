import { injectable } from 'inversify';
import { Service, IService } from '@/models/Service';
import { IServiceRepository } from '@/interfaces/repositories/IServiceRepository';
import { QueryFilter } from 'mongoose';

@injectable()
export class ServiceRepository implements IServiceRepository {
  async create(data: IService): Promise<IService> {
    const service = new Service(data);
    const saved = await service.save();
    return saved.toObject();
  }

  async updateById(
    id: string,
    update: Partial<IService>
  ): Promise<IService | null> {
    return Service.findByIdAndUpdate(id, update, {
      new: true,
      runValidators: true,
    }).lean();
  }

  async deleteById(id: string): Promise<boolean> {
    const result = await Service.findByIdAndDelete(id);
    return !!result;
  }

  async findById(id: string): Promise<IService | null> {
    return Service.findById(id).lean();
  }

  async findMany(
    filter: QueryFilter<IService>,
    options: {
      skip?: number;
      limit?: number;
      sort?: Record<string, 1 | -1>;
    } = {}
  ): Promise<IService[]> {
    return Service.find(filter)
      .sort(options.sort || { createdAt: -1 })
      .skip(options.skip || 0)
      .limit(options.limit || 12)
      .lean();
  }

  async count(filter: QueryFilter<IService>): Promise<number> {
    return Service.countDocuments(filter);
  }
}
