import {
  CreateServiceInput,
  ServiceQueryParams,
  UpdateServiceInput,
} from '@/dtos/service/service.dto';
import { IService } from '@/models/Service';

export interface IServiceService {
  create(data: CreateServiceInput): Promise<IService>;
  update(id: string, data: UpdateServiceInput): Promise<IService>;
  delete(id: string, userId: string): Promise<void>;
  findById(id: string): Promise<IService>;
  findMany(query: ServiceQueryParams): Promise<{
    services: Array<IService & { signedImages?: string[] }>;
    pagination: { page: number; limit: number; total: number; pages: number };
  }>;
}
