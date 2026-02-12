// Convert Date -> yyyy-MM-dd (LOCAL timezone safe)
export const toDateKey = (date: Date): string => {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
};

// Convert yyyy-MM-dd -> Date (LOCAL, NOT UTC)
export const fromDateKey = (input: string | Date): Date => {
  if (!input) return new Date(NaN);

  if (input instanceof Date) return input;

  // Convert ISO or yyyy-MM-dd → yyyy-MM-dd first
  const datePart = input.includes("T") ? input.split("T")[0] : input;

  const [y, m, d] = datePart.split("-").map(Number);

  return new Date(y, m - 1, d);
};

// Normalize any input to yyyy-MM-dd
export const normalizeDateString = (input: string | Date): string => {
  if (input instanceof Date) return toDateKey(input);

  // ISO string
  if (input.includes("T")) return input.split("T")[0];

  // already yyyy-MM-dd
  return input;
};

// Check if dateKey is between from & to (inclusive)
export const isInRange = (dateKey: string, from: string, to: string) => {
  const d = normalizeDateString(dateKey);
  const f = normalizeDateString(from);
  const t = normalizeDateString(to);

  return d >= f && d <= t;
};
