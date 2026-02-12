import api from "@/lib/api";
import type { ServiceFormData, ServiceQueryParams } from "@/types/service";
import { createAsyncThunk } from "@reduxjs/toolkit";

export const fetchServices = createAsyncThunk(
  "services/fetchAll",
  async (query: ServiceQueryParams = {}, { rejectWithValue }) => {
    try {
      const response = await api.get("/service", { params: query });
      return response.data.data;
    } catch {
      return rejectWithValue("Failed to load services");
    }
  },
);

export const fetchServiceById = createAsyncThunk(
  "services/fetchById",
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await api.get(`/service/${id}`);
      return response.data.data;
    } catch {
      return rejectWithValue("Failed to load service");
    }
  },
);

export const createService = createAsyncThunk(
  "services/create",
  async (data: ServiceFormData, { rejectWithValue }) => {
    try {
      const formData = new FormData();

      formData.append("title", data.title);
      formData.append("category", data.category);
      formData.append("description", data.description);
      formData.append("pricePerDay", data.pricePerDay.toString());
      formData.append("location", data.location);
      formData.append("phone", data.phone);
      formData.append("availability", JSON.stringify(data.availability));

      if (data.images && data.images.length > 0) {
        data.images.forEach((file) => {
          formData.append("images", file);
        });
      }

      const response = await api.post("/admin/service", formData);

      return response.data.data;
    } catch {
      return rejectWithValue("Failed to create service");
    }
  },
);

export const updateService = createAsyncThunk(
  "services/update",
  async (
    { id, data }: { id: string; data: Partial<ServiceFormData> },
    { rejectWithValue },
  ) => {
    try {
      const formData = new FormData();

      if (data.title !== undefined) formData.append("title", data.title);
      if (data.category !== undefined)
        formData.append("category", data.category);
      if (data.description !== undefined)
        formData.append("description", data.description);
      if (data.pricePerDay !== undefined) {
        formData.append("pricePerDay", data.pricePerDay.toString());
      }
      if (data.location !== undefined)
        formData.append("location", data.location);

      if (data.phone) {
        formData.append("phone", data.phone);
      }

      if (data.availability) {
        const cleaned = {
          availableRanges: data.availability.availableRanges.map(
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            ({ _id, ...rest }) => rest,
          ),
          blockedRanges: data.availability.blockedRanges.map(
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            ({ _id, ...rest }) => rest,
          ),
          bookedRanges: data.availability.bookedRanges.map(
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            ({ _id, ...rest }) => rest,
          ),
        };
        formData.append("availability", JSON.stringify(cleaned));
      }

      if (data.images && data.images.length > 0) {
        data.images.forEach((file) => {
          formData.append("images", file);
        });
      }

      const response = await api.put(`/admin/service/${id}`, formData);

      return response.data.data;
    } catch {
      return rejectWithValue("Failed to update service");
    }
  },
);

export const deleteService = createAsyncThunk(
  "services/delete",
  async (id: string, { rejectWithValue }) => {
    try {
      await api.delete(`/admin/service/${id}`);
      return id;
    } catch {
      return rejectWithValue("Failed to delete service");
    }
  },
);

export const fetchAvailability = createAsyncThunk(
  "services/fetchAvailability",
  async (
    { id, year, month }: { id: string; year: number; month: number },
    { rejectWithValue },
  ) => {
    try {
      const response = await api.get(`/service/${id}/availability`, {
        params: { year, month },
      });
      console.log("thunk:", response);
      return { year, month, data: response.data.data };
    } catch {
      return rejectWithValue("Failed to load availability");
    }
  },
);
