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

interface RazorpayOrder {
  id: string;
  amount: number;
  currency: string;
}

interface CurrentBooking {
  booking: Booking;
  order: RazorpayOrder;
}

export interface BookingState {
  currentBooking: CurrentBooking | null;
  bookings: Booking[];
  loading: boolean;
  error: string | null;
}
