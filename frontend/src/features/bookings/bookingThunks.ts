import { createAsyncThunk } from "@reduxjs/toolkit";
import api from "@/lib/api";
import { BOOKING_ACTIONS } from "@/constants/thunk.constants";

export const createBooking = createAsyncThunk(
  BOOKING_ACTIONS.CREATE,
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
  BOOKING_ACTIONS.VERIFY_PAYMENT,
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
  BOOKING_ACTIONS.CANCEL,
  async (bookingId: string) => {
    const res = await api.patch(`/booking/${bookingId}/cancel`);
    return res.data.data.booking;
  },
);

export const fetchUserBookings = createAsyncThunk(
  BOOKING_ACTIONS.FETCH,
  async () => {
    const res = await api.get("/booking/my-bookings");
    return res.data.data;
  },
);
