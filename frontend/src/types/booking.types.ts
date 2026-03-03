import type { BookingStatus } from "@/constants/booking.constants";
import type { Service } from "./service.types";

export interface Booking {
  _id: string;
  service: Service;
  startDate: string;
  user: { name: string; email: string };
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

export interface ApiResponse {
  success: boolean;
  message: string;
  data: {
    data: Booking[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      pages: number;
    };
  };
}
