/* eslint-disable @typescript-eslint/no-explicit-any */
import { createSlice } from "@reduxjs/toolkit";
import { createBooking, verifyPayment, cancelBooking, fetchUserBookings } from "./bookingThunks";
import type { Booking } from "@/types/booking.types";

interface BookingState {
  currentBooking: { booking: Booking; order: any } | null;
  bookings: Booking[];
  loading: boolean;
  error: string | null;
}

const initialState: BookingState = {
  currentBooking: null,
  bookings: [],
  loading: false,
  error: null,
};

const bookingSlice = createSlice({
  name: "bookings",
  initialState,
  reducers: {
    clearCurrentBooking(state) {
      state.currentBooking = null;
    },
  },
  extraReducers: (builder) => {
    // create
    builder
      .addCase(createBooking.pending, (state) => { state.loading = true; })
      .addCase(createBooking.fulfilled, (state, action) => {
        state.loading = false;
        state.currentBooking = action.payload;
      })
      .addCase(createBooking.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to create booking";
      });

    // verify
    builder
      .addCase(verifyPayment.fulfilled, (state, action) => {
        state.currentBooking!.booking = action.payload;
      });

    // fetch
    builder
      .addCase(fetchUserBookings.fulfilled, (state, action) => {
        state.bookings = action.payload;
      });

    // cancel
    builder
      .addCase(cancelBooking.fulfilled, (state, action) => {
        const idx = state.bookings.findIndex(b => b._id === action.payload._id);
        if (idx !== -1) state.bookings[idx] = action.payload;
      });
  },
});

export const { clearCurrentBooking } = bookingSlice.actions;
export default bookingSlice.reducer;