import { createAsyncThunk } from "@reduxjs/toolkit";
import api from "@/lib/api";

export const createBooking = createAsyncThunk(
  "bookings/create",
  async ({
    serviceId,
    startDate,
    endDate,
  }: {
    serviceId: string;
    startDate: string;
    endDate: string;
  }) => {
    const res = await api.post("/booking", { serviceId, startDate, endDate });
    return res.data.data;
  },
);

export const verifyPayment = createAsyncThunk(
  "bookings/verifyPayment",
  async (paymentData: {
    razorpay_order_id: string;
    razorpay_payment_id: string;
    razorpay_signature: string;
  }) => {
    const res = await api.post("/booking/verify-payment", paymentData);
    return res.data.data.booking;
  },
);

export const cancelBooking = createAsyncThunk(
  "bookings/cancel",
  async (bookingId: string) => {
    const res = await api.patch(`/booking/${bookingId}/cancel`);
    return res.data.data.booking;
  },
);

export const fetchUserBookings = createAsyncThunk(
  "bookings/fetchMyBookings",
  async () => {
    const res = await api.get("/booking/my-bookings");
    return res.data.data;
  },
);
