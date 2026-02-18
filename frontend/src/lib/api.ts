/* eslint-disable @typescript-eslint/no-unused-vars */
import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
  withCredentials: true,
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      document.cookie.includes("refreshToken=")
    ) {
      originalRequest._retry = true;

      try {
        const res = await api.post("/auth/refresh");
        console.log("res:", res);
        return api(originalRequest);
      } catch (refreshError) {
        // Clear cookies & redirect
        document.cookie = "accessToken=; Max-Age=0; path=/;";
        document.cookie = "refreshToken=; Max-Age=0; path=/;";
        window.location.href = "/login";
      }
    }

    return Promise.reject(error);
  },
);
export default api;
