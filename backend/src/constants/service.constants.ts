export const SERVICE_CATEGORIES = [
  { value: 'venue', label: 'Venue' },
  { value: 'catering', label: 'Catering' },
  { value: 'photography', label: 'Photography' },
  { value: 'videography', label: 'Videography' },
  { value: 'decoration', label: 'Decoration' },
  { value: 'entertainment', label: 'Entertainment' },
  { value: 'transportation', label: 'Transportation' },
  { value: 'makeup', label: 'Makeup & Styling' },
  { value: 'music', label: 'Music & DJ' },
  { value: 'planning', label: 'Event Planning' },
  { value: 'other', label: 'Other' },
] as const;

export type ServiceCategory = (typeof SERVICE_CATEGORIES)[number]['value'];

export const FIXED_IMAGE_COUNT = 6;

export const SORT_OPTIONS = {
  PRICE_ASC: 'price_asc',
  PRICE_DESC: 'price_desc',
  NEWEST: 'newest',
  OLDEST: 'oldest',
} as const;

export type SortOption = (typeof SORT_OPTIONS)[keyof typeof SORT_OPTIONS];

export const SORT_MAPPING: Record<SortOption, Record<string, 1 | -1>> = {
  [SORT_OPTIONS.PRICE_ASC]: { pricePerDay: 1 },
  [SORT_OPTIONS.PRICE_DESC]: { pricePerDay: -1 },
  [SORT_OPTIONS.NEWEST]: { createdAt: -1 },
  [SORT_OPTIONS.OLDEST]: { createdAt: 1 },
};

export const MIN_SEARCH_LENGTH = 2;
export const DEFAULT_PAGE = 1;
export const DEFAULT_LIMIT = 12;
