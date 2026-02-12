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
