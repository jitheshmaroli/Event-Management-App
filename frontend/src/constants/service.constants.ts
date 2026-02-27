export const DEFAULT_PAGE_SIZE = 6;
export const DEBOUNCE_DELAY = 500;
export const FIXED_IMAGE_COUNT = 6;

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

export const SERVICE_SORT_OPTIONS = {
  PRICE_ASC: "price_asc",
  PRICE_DESC: "price_desc",
  NEWEST: "newest",
  OLDEST: "oldest",
} as const;

export type ServiceSortOption =
  (typeof SERVICE_SORT_OPTIONS)[keyof typeof SERVICE_SORT_OPTIONS];

export const SORT_LABELS: Record<ServiceSortOption, string> = {
  [SERVICE_SORT_OPTIONS.PRICE_ASC]: "Price: Low to High",
  [SERVICE_SORT_OPTIONS.PRICE_DESC]: "Price: High to Low",
  [SERVICE_SORT_OPTIONS.NEWEST]: "Newest First",
  [SERVICE_SORT_OPTIONS.OLDEST]: "Oldest First",
};
