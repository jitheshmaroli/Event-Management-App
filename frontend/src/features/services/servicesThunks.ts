/* eslint-disable @typescript-eslint/no-explicit-any */
import { SERVICE_ACTIONS } from "@/constants/thunk.constants";
import {
  createServiceApi,
  deleteServiceApi,
  fetchAvailabilityApi,
  fetchServiceByIdApi,
  fetchServicesApi,
  updateServiceApi,
} from "@/lib/services";
import type {
  ServiceFormData,
  ServiceQueryParams,
} from "@/types/service.types";
import type { PaginatedResponse } from "@/types/service.types";
import { createAsyncThunk } from "@reduxjs/toolkit";

export const fetchServices = createAsyncThunk(
  SERVICE_ACTIONS.FETCH_ALL,
  async (query: ServiceQueryParams = {}, { rejectWithValue }) => {
    try {
      const response = await fetchServicesApi(query);
      return response.data.data as PaginatedResponse<any>;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to load services",
      );
    }
  },
);

export const fetchServiceById = createAsyncThunk(
  SERVICE_ACTIONS.FETCH_BY_ID,
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await fetchServiceByIdApi(id);
      return response.data.data;
    } catch {
      return rejectWithValue("Failed to load service");
    }
  },
);

export const createService = createAsyncThunk(
  SERVICE_ACTIONS.CREATE,
  async (data: ServiceFormData, { rejectWithValue }) => {
    try {
      const formData = new FormData();

      formData.append("title", data.title);
      formData.append("category", data.category);
      formData.append("description", data.description);
      formData.append("pricePerDay", data.pricePerDay.toString());
      formData.append("location", data.location);
      formData.append("phone", data.phone);

      if (data.availability) {
        formData.append("availability", JSON.stringify(data.availability));
      } else {
        formData.append(
          "availability",
          JSON.stringify({
            availableRanges: [],
            bookedRanges: [],
          }),
        );
      }

      if (data.images && data.images.length > 0) {
        data.images.forEach((file) => {
          formData.append("images", file);
        });
      }

      const response = await createServiceApi(formData);

      return response.data.data;
    } catch {
      return rejectWithValue("Failed to create service");
    }
  },
);

export const updateService = createAsyncThunk(
  SERVICE_ACTIONS.UPDATE,
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

      const response = await updateServiceApi({id, data: formData})

      return response.data.data;
    } catch (err: any) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to update service",
      );
    }
  },
);

export const deleteService = createAsyncThunk(
  SERVICE_ACTIONS.DELETE,
  async (id: string, { rejectWithValue }) => {
    try {
      await deleteServiceApi(id);
      return id;
    } catch {
      return rejectWithValue("Failed to delete service");
    }
  },
);

export const fetchAvailability = createAsyncThunk(
  SERVICE_ACTIONS.AVAILABILITY,
  async (
    { id, year, month }: { id: string; year: number; month: number },
    { rejectWithValue },
  ) => {
    try {
      const response = await fetchAvailabilityApi({ id, year, month });
      return { year, month, data: response.data.data };
    } catch {
      return rejectWithValue("Failed to load availability");
    }
  },
);
