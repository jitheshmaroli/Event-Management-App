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

      if ("title" in data) formData.append("title", data.title!);
      if ("category" in data) formData.append("category", data.category!);
      if ("description" in data)
        formData.append("description", data.description!);
      if ("pricePerDay" in data)
        formData.append("pricePerDay", data.pricePerDay!.toString());
      if ("location" in data) formData.append("location", data.location!);
      if ("phone" in data) formData.append("phone", data.phone!);

      if ("availability" in data && data.availability) {
        const cleaned = {
          availableRanges:
            data.availability.availableRanges?.map(
              // eslint-disable-next-line @typescript-eslint/no-unused-vars
              ({ _id, ...rest }) => rest,
            ) ?? [],
          // blockedRanges:
          //   // eslint-disable-next-line @typescript-eslint/no-unused-vars
          //   data.availability.blockedRanges?.map(({ _id, ...rest }) => rest) ??
          //   [],
          bookedRanges:
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            data.availability.bookedRanges?.map(({ _id, ...rest }) => rest) ??
            [],
        };
        formData.append("availability", JSON.stringify(cleaned));
      }

      // New images
      if (data.images?.length) {
        data.images.forEach((file) => formData.append("images", file));
      }

      // Images to remove
      if (data.removedImages?.length) {
        data.removedImages.forEach((key) =>
          formData.append("removedImages[]", key),
        );
      }

      const response = await api.put(`/admin/service/${id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      return response.data.data;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to update service",
      );
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
      return { year, month, data: response.data.data };
    } catch {
      return rejectWithValue("Failed to load availability");
    }
  },
);
