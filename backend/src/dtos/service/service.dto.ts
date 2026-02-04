export interface ServiceQueryParams {
  search?: string;
  category?: string;
  location?: string;
  minPrice?: number;
  maxPrice?: number;
  date?: string;
  page?: number;
  limit?: number;
  sort?: string;
}

export interface BlockedRangeInput {
  from: string;
  to: string;
  reason?: string;
}

export interface AvailabilityInput {
  defaultAvailable: boolean;
  blockedRanges: BlockedRangeInput[];
}

export interface CreateServiceInput {
  title: string;
  category: string;
  description: string;
  pricePerDay: number;
  location: string;
  images?: string[];
  contactDetails: {
    phone: string;
    email?: string;
    whatsapp?: string;
  };
  availability: AvailabilityInput;
}

export interface UpdateServiceInput {
  title?: string;
  category?: string;
  description?: string;
  pricePerDay?: number;
  location?: string;
  images?: string[];
  contactDetails?: {
    phone?: string;
    email?: string;
    whatsapp?: string;
  };
  availability?: AvailabilityInput;
}
