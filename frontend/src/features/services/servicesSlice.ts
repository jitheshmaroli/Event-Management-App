import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { Service } from "@/types/service";
import {
  createService,
  deleteService,
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
  loading: boolean;
  error: string | null;
}

const initialState: ServicesState = {
  services: [],
  currentService: null,
  pagination: null,
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
  },
  extraReducers: (builder) => {
    builder
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

      // create
      .addCase(createService.fulfilled, (state, action) => {
        state.services.push(action.payload);
      })

      // update
      .addCase(updateService.fulfilled, (state, action) => {
        const index = state.services.findIndex(
          (s) => s._id === action.payload._id,
        );
        if (index !== -1) state.services[index] = action.payload;
        if (state.currentService?._id === action.payload._id) {
          state.currentService = action.payload;
        }
      })

      // delete
      .addCase(deleteService.fulfilled, (state, action) => {
        state.services = state.services.filter((s) => s._id !== action.payload);
        if (state.currentService?._id === action.payload) {
          state.currentService = null;
        }
      })

      //fethc by id
      .addCase(fetchServiceById.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchServiceById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentService = action.payload;
      })
      .addCase(fetchServiceById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { setCurrentService } = servicesSlice.actions;

export default servicesSlice.reducer;
