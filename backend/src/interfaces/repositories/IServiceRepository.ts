import { IService } from '@/models/Service';
import { QueryFilter } from 'mongoose';

export interface IServiceRepository {
  create(serviceData: IService): Promise<IService>;
  updateById(id: string, update: Partial<IService>): Promise<IService | null>;
  deleteById(id: string): Promise<boolean>;
  findById(id: string): Promise<IService | null>;
  findMany(
    filter: QueryFilter<IService>,
    options?: {
      skip?: number;
      limit?: number;
      sort?: Record<string, 1 | -1>;
    }
  ): Promise<IService[]>;
  count(filter: QueryFilter<IService>): Promise<number>;
}
