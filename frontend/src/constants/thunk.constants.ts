export const AUTH_ACTIONS = {
  CHECK_CURRENT_USER: "auth/checkCurrentUser",
  LOGIN: "auth/login",
  LOGOUT: "auth/logout",
  REGISTER: "auth/register",
  SEND_OTP: "auth/sendOtp",
  VERIFY_OTP: "auth/verifyOtp",
  RESET_PASSWORD: "auth/resetPassword",
} as const;

export const BOOKING_ACTIONS = {
    CREATE: "bookings/create",
    VERIFY_PAYMENT: "bookings/verifyPayment",
    CANCEL: "bookings/cancel",
    FETCH: "bookings/fetchMyBookings",
}as const;

export const SERVICE_ACTIONS = {
    FETCH_ALL: "services/fetchAll",
    FETCH_BY_ID: "services/fetchById",
    CREATE: "services/create",
    UPDATE: "services/update",
    DELETE: "services/delete",
    AVAILABILITY: "services/fetchAvailability",
} 