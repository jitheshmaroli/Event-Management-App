import { ROUTES } from "@/constants/routes";
import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !originalRequest.url?.includes(ROUTES.API.REFRESH)
    ) {
      originalRequest._retry = true;

      try {
        await api.post(ROUTES.API.REFRESH);
        return api(originalRequest);
      } catch (refreshError) {
        console.log("Refresh failed → going to login", refreshError);
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  },
);
export default api;
