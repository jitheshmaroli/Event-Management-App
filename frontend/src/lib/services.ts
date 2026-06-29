import {
  getServiceDetailPath,
  ROUTES,
  serviceAvailabilityEditPath,
  serviceEditPath,
} from "@/constants/routes";
import api from "@/lib/api";
import type {
  ServiceQueryParams,
} from "@/types/service.types";

export const fetchServicesApi = async (query: ServiceQueryParams = {}) => {
  const response = await api.get(ROUTES.API.SERVICE, { params: query });
  return response;
};

export const fetchServiceByIdApi = async (id: string) => {
  const response = await api.get(getServiceDetailPath(id));
  return response;
};

export const createServiceApi = async (data: FormData) => {
  const response = await api.post(ROUTES.API.ADMIN_SERVICE, data);

  return response;
};

export const updateServiceApi = async ({
  id,
  data,
}: {
  id: string;
  data: FormData;
}) => {
  const response = await api.put(serviceEditPath(id), data, {
    headers: { "Content-Type": "multipart/form-data" },
  });

  return response;
};

export const deleteServiceApi = async (id: string) => {
  await api.delete(serviceEditPath(id));
  return id;
};

export const fetchAvailabilityApi = async ({
  id,
  year,
  month,
}: {
  id: string;
  year: number;
  month: number;
}) => {
  const response = await api.get(serviceAvailabilityEditPath(id), {
    params: { year, month },
  });
  return response;
};
