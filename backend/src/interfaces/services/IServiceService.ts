import {
  CreateServiceInput,
  PaginatedResponse,
  ServiceQueryParams,
  UpdateServiceInput,
} from '@/dtos/service/service.dto';
import { IService } from '@/models/Service';

export interface IServiceService {
  create(data: CreateServiceInput): Promise<IService>;
  update(id: string, data: UpdateServiceInput): Promise<IService>;
  delete(id: string, userId: string): Promise<void>;
  findById(id: string): Promise<IService>;
  findMany(
    query: ServiceQueryParams
  ): Promise<PaginatedResponse<IService & { signedImages?: string[] }>>;
  getAvailability(
    id: string,
    year: number,
    month: number
  ): Promise<{
    availableDates: string[];
    bookedDates: string[];
  }>;
}
