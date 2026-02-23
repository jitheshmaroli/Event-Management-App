import type { Service } from "@/types/service";

export const BookingStatus = {
  PENDING: "pending",
  CONFIRMED: "confirmed",
  CANCELLED: "cancelled",
  COMPLETED: "completed",
  FAILED: "failed",
} as const;

export type BookingStatus = (typeof BookingStatus)[keyof typeof BookingStatus];

export interface Booking {
  _id: string;
  service: Service;
  startDate: string;
  endDate: string;
  numberOfDays: number;
  totalAmount: number;
  status: BookingStatus;
  payment: {
    provider: string;
    referenceId: string;
    status: string;
    amount: number;
    currency: string;
  };
  createdAt: string;
}
