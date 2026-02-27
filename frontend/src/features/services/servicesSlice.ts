import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { MonthAvailability, Service } from "@/types/service.types";
import {
  createService,
  deleteService,
  fetchAvailability,
  fetchServiceById,
  fetchServices,
  updateService,
} from "./servicesThunks";

interface ServicesState {
  services: Service[];
  currentService: Service | null;
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  } | null;
  availabilityByMonth: Record<string, MonthAvailability>;
  loading: boolean;
  error: string | null;
}

const initialState: ServicesState = {
  services: [],
  currentService: null,
  pagination: null,
  availabilityByMonth: {},
  loading: false,
  error: null,
};

const servicesSlice = createSlice({
  name: "services",
  initialState,
  reducers: {
    setCurrentService: (state, action: PayloadAction<Service | null>) => {
      state.currentService = action.payload;
    },
    clearServicesError: (state) => {
      state.error = null;
    },
    resetServices: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      //fetch services
      .addCase(fetchServices.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchServices.fulfilled, (state, action) => {
        state.loading = false;
        state.services = action.payload.services;
        state.pagination = action.payload.pagination;
      })
      .addCase(fetchServices.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Create Service
      .addCase(createService.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createService.fulfilled, (state, action) => {
        state.loading = false;
        state.services.unshift(action.payload);
        if (state.pagination) {
          state.pagination.total += 1;
          state.pagination.pages = Math.ceil(
            state.pagination.total / state.pagination.limit,
          );
        }
      })
      .addCase(createService.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Update Service
      .addCase(updateService.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateService.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.services.findIndex(
          (s) => s._id === action.payload._id,
        );
        if (index !== -1) state.services[index] = action.payload;
        if (state.currentService?._id === action.payload._id) {
          state.currentService = action.payload;
        }
      })
      .addCase(updateService.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Delete Service
      .addCase(deleteService.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteService.fulfilled, (state, action) => {
        state.loading = false;
        state.services = state.services.filter((s) => s._id !== action.payload);
        if (state.currentService?._id === action.payload) {
          state.currentService = null;
        }
        if (state.pagination) {
          state.pagination.total -= 1;
          state.pagination.pages = Math.ceil(
            state.pagination.total / state.pagination.limit,
          );
        }
      })
      .addCase(deleteService.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      //fethc by id
      .addCase(fetchServiceById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchServiceById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentService = action.payload;
      })
      .addCase(fetchServiceById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // fetch availability
      .addCase(fetchAvailability.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAvailability.fulfilled, (state, action) => {
        state.loading = false;
        const key = `${action.payload.year}-${action.payload.month}`;
        state.availabilityByMonth[key] = action.payload.data;
      })
      .addCase(fetchAvailability.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { setCurrentService, clearServicesError, resetServices } =
  servicesSlice.actions;

export default servicesSlice.reducer;
