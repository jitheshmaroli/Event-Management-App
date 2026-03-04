import { ServiceCategory } from '@/constants/service.constants';

export interface ServiceQueryParams {
  search?: string;
  category?: ServiceCategory;
  minPrice?: number;
  maxPrice?: number;
  dateFrom?: string;
  dateTo?: string;
  page?: number;
  limit?: number;
  sort?: string;
}

export interface RangeInput {
  from: string;
  to: string;
  reason?: string;
}

export interface AvailabilityInput {
  availableRanges?: RangeInput[];
  bookedRanges?: RangeInput[];
}

export interface CreateServiceInput {
  title: string;
  category: ServiceCategory;
  description: string;
  pricePerDay: number;
  location: string;
  images?: string[];
  phone: string;
  availability: AvailabilityInput;
}

export interface UpdateServiceInput {
  title?: string;
  category?: ServiceCategory;
  description?: string;
  pricePerDay?: number;
  location?: string;
  images?: string[];
  removedImages?: string[];
  phone?: string;
  availability?: AvailabilityInput;
}

export interface PaginatedResponse<T> {
  services: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}
