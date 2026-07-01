export const ROUTES = {
  // Public routes
  LOGIN: "/login",
  ADMIN_LOGIN: "/admin/login",
  REGISTER: "/register",
  VERIFY_OTP: "/verify-otp",
  FORGOT_PASSWORD: "/forgot-password",
  RESET_PASSWORD: "/reset-password",

  // Public pages with MainLayout
  HOME: "/",
  SERVICES: "/services",
  SERVICE_DETAIL: "/services/:id",

  // User Protected Routes
  USER: {
    BOOKING_NEW: "/bookings/new/:serviceId",
    BOOKING_SUMMARY: "/bookings/summary",
    BOOKING_PAYMENT: "/bookings/payment",
    BOOKING_SUCCESS: "/bookings/success",
    BOOKING_FAILED: "/bookings/failed",
    MY_BOOKINGS: "/my-bookings",
    PROFILE: "/profile",
  },

  // Admin Protected Routes
  ADMIN: {
    DASHBOARD: "/admin/dashboard",
    SERVICES: "/admin/services",
    SERVICE_CREATE: "/admin/services/new",
    SERVICE_VIEW: "/admin/services/:id",
    SERVICE_EDIT: "/admin/services/:id/edit",
    USERS: "/admin/users",
    BOOKINGS: "/admin/bookings",
  },

  // Error routes
  NOT_FOUND: "/404",
  UNAUTHORIZED: "/unauthorized",

  //API ROUTES
  API: {
    REFRESH: "/auth/refresh",
    LOGIN: "/auth/login",
    REGISTER: "/auth/register",
    SEND_OTP: "/auth/send-otp",
    VERIFY_OTP: "/auth/verify-otp",
    RESET_PASSWORD: "/auth/reset-password",
    CURRENT_USER: "/auth/me",
    LOGOUT: "/auth/logout",
    BOOKING: "/booking",
    MY_BOOKINGS: "/booking/my-bookings",
    VERIFY_PAYMENT: "/booking/verify-payment",
    ADMIN_SERVICE: "/admin/service",
    SERVICE: "/service",
  },
} as const;

// Helper functions for dynamic routes
export const getServiceDetailPath = (id: string | number): string =>
  `/service/${id}`;

export const getBookingNewPath = (serviceId: string | number): string =>
  `/bookings/new/${serviceId}`;

export const getAdminServiceViewPath = (id: string | number): string =>
  `/admin/services/${id}`;

export const getAdminServiceEditPath = (id: string | number): string =>
  `/admin/services/${id}/edit`;

export const cancelBookingEditPath = (id: string | number): string =>
  `/booking/${id}/cancel`;

export const serviceAvailabilityEditPath = (id: string | number): string =>
  `/service/${id}/availability`;

export const serviceEditPath = (id: string | number): string =>
  `/admin/service/${id}`;
