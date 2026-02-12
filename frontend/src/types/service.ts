export const SERVICE_CATEGORIES = [
  { value: "venue", label: "Venue" },
  { value: "catering", label: "Catering" },
  { value: "photography", label: "Photography" },
  { value: "videography", label: "Videography" },
  { value: "decoration", label: "Decoration" },
  { value: "entertainment", label: "Entertainment" },
  { value: "transportation", label: "Transportation" },
  { value: "makeup", label: "Makeup & Styling" },
  { value: "music", label: "Music & DJ" },
  { value: "planning", label: "Event Planning" },
  { value: "other", label: "Other" },
] as const;

export type ServiceCategory = (typeof SERVICE_CATEGORIES)[number]["value"];

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
  reason?: string;
  _id?: string;
}

export interface AvailabilitySettings {
  availableRanges: Range[];
  blockedRanges: Range[];
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
  images?: File[];
  existingImages?: string[];
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
  location?: string;
  date?: string;
  page?: number;
  limit?: number;
  sort?: "newest" | "oldest" | "price_asc" | "price_desc";
}

export interface MonthAvailability {
  availableDates: string[];
  bookedDates: string[];
  blockedDates: string[];
}
