//  Convert any date input to UTC midnight Date object
export const toUtcMidnight = (input: string | Date): Date => {
  if (typeof input === 'string') {
    const [y, m, d] = input.split('T')[0].split('-').map(Number);
    return new Date(Date.UTC(y, m - 1, d));
  }

  return new Date(
    Date.UTC(input.getFullYear(), input.getMonth(), input.getDate())
  );
};

// Convert Date to yyyy-MM-dd string (UTC)
export const toDateString = (date: Date): string => {
  return date.toISOString().slice(0, 10);
};

// Normalize date range array
export const normalizeRanges = (
  ranges?: { from: string | Date; to: string | Date; reason?: string }[]
) => {
  return (
    ranges?.map((r) => ({
      from: toUtcMidnight(r.from),
      to: toUtcMidnight(r.to),
      reason: r.reason,
    })) ?? []
  );
};
