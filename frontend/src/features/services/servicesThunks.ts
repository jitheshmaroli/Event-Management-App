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
      formData.append("contactDetails", JSON.stringify(data.contactDetails));
      formData.append(
        "availability",
        JSON.stringify({
          defaultAvailable: data.availability.defaultAvailable,
          blockedRanges: data.availability.blockedRanges,
        }),
      );

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

      if (data.contactDetails) {
        formData.append("contactDetails", JSON.stringify(data.contactDetails));
      }

      if (data.availability) {
        const cleaned = {
          defaultAvailable: data.availability.defaultAvailable,
          blockedRanges: data.availability.blockedRanges.map(
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
