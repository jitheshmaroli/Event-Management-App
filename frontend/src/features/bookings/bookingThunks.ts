import { createAsyncThunk } from "@reduxjs/toolkit";
import { BOOKING_ACTIONS } from "@/constants/thunk.constants";
import {
  cancelBookingApi,
  createBookingApi,
  fetchUserBookingsApi,
  verifyPaymentApi,
} from "@/lib/booking";
import { getErrorMessage } from "@/lib/errorMessage";

export const createBooking = createAsyncThunk(
  BOOKING_ACTIONS.CREATE,
  async (
    {
      serviceId,
      startDate,
      endDate,
    }: {
      serviceId: string;
      startDate: string;
      endDate: string;
    },
    { rejectWithValue },
  ) => {
    try {
      const res = await createBookingApi({ serviceId, startDate, endDate });
      return res.data.data;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  },
);

export const verifyPayment = createAsyncThunk(
  BOOKING_ACTIONS.VERIFY_PAYMENT,
  async (
    paymentData: {
      razorpay_order_id: string;
      razorpay_payment_id: string;
      razorpay_signature: string;
    },
    { rejectWithValue },
  ) => {
    try {
      const res = await verifyPaymentApi(paymentData);
      return res.data.data.booking;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  },
);

export const cancelBooking = createAsyncThunk(
  BOOKING_ACTIONS.CANCEL,
  async (bookingId: string, { rejectWithValue }) => {
    try {
      const res = await cancelBookingApi(bookingId);
      return res.data.data.booking;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  },
);

export const fetchUserBookings = createAsyncThunk(
  BOOKING_ACTIONS.FETCH,
  async (_, { rejectWithValue }) => {
    try {
      const res = await fetchUserBookingsApi();
      return res.data.data;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  },
);
