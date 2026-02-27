export const BOOKING_MAX_DAYS = 10;
export const RAZORPAY_KEY_ID = import.meta.env.VITE_RAZORPAY_KEY_ID;

export const BookingStatus = {
  PENDING: "pending",
  CONFIRMED: "confirmed",
  CANCELLED: "cancelled",
  COMPLETED: "completed",
  FAILED: "failed",
} as const;

export type BookingStatus = (typeof BookingStatus)[keyof typeof BookingStatus];
