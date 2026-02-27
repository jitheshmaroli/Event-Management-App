import {
  SERVICE_CATEGORIES,
  SERVICE_SORT_OPTIONS,
  SORT_LABELS,
  type ServiceSortOption,
} from "@/constants/service.constants";

export interface PaginatedResponse<T> {
  services: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export interface ServiceFilters {
  category: string;
  minPrice?: number;
  maxPrice?: number;
  availabilityFrom: string;
  availabilityTo: string;
}

export interface ServiceQueryState {
  search: string;
  sort: ServiceSortOption;
  filters: ServiceFilters;
  page: number;
  limit: number;
}

import type { ServiceCategory } from "@/constants/service.constants";

export interface Service {
  _id: string;
  title: string;
  category: ServiceCategory;
  description: string;
  pricePerDay: number;
  location: string;
  phone: string;
  images: string[];
  signedImages: string[];
  existingImages?: string[];
  availability: AvailabilitySettings;
  createdAt: string;
  updatedAt: string;
  status?: "active" | "inactive" | "draft";
}

export interface Range {
  from: string;
  to: string;
  _id?: string;
}

export interface AvailabilitySettings {
  availableRanges: Range[];
  bookedRanges: Range[];
}

export interface ServiceFormData {
  title: string;
  category: ServiceCategory;
  description: string;
  pricePerDay: number;
  location: string;
  phone: string;
  availability: AvailabilitySettings;
  images: File[];
  existingImages?: string[];
  removedImages?: string[];
}

export interface CreateServicePayload extends Omit<
  ServiceFormData,
  "images" | "existingImages"
> {
  images?: string[];
}

export interface ServiceQueryParams {
  search?: string;
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  dateFrom?: string;
  dateTo?: string;
  page?: number;
  limit?: number;
  sort?: string;
}

export interface MonthAvailability {
  availableDates: string[];
  bookedDates: string[];
}

export type PriceBreakDownProps = {
  amount: number;
  days: number;
};

export type FilterField =
  | {
      type: "select";
      name: string;
      label: string;
      options?: readonly { label: string; value: string }[];
    }
  | {
      type: "number";
      name: string;
      label: string;
      min?: number;
      max?: number;
    }
  | {
      type: "date";
      name: string;
      label: string;
    };

export const serviceFilterFields: FilterField[] = [
  {
    type: "select",
    name: "category",
    label: "Category",
    options: SERVICE_CATEGORIES,
  },
  {
    type: "number",
    name: "minPrice",
    label: "Min Price",
  },
  {
    type: "number",
    name: "maxPrice",
    label: "Max Price",
  },
  {
    type: "date",
    name: "availabilityFrom",
    label: "Available From",
  },
  {
    type: "date",
    name: "availabilityTo",
    label: "Available To",
  },
];

export const serviceSortOptions = [
  {
    value: SERVICE_SORT_OPTIONS.NEWEST,
    label: SORT_LABELS[SERVICE_SORT_OPTIONS.NEWEST],
  },
  {
    value: SERVICE_SORT_OPTIONS.OLDEST,
    label: SORT_LABELS[SERVICE_SORT_OPTIONS.OLDEST],
  },
  {
    value: SERVICE_SORT_OPTIONS.PRICE_ASC,
    label: SORT_LABELS[SERVICE_SORT_OPTIONS.PRICE_ASC],
  },
  {
    value: SERVICE_SORT_OPTIONS.PRICE_DESC,
    label: SORT_LABELS[SERVICE_SORT_OPTIONS.PRICE_DESC],
  },
];
