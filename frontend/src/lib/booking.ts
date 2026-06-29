import api from "@/lib/api";
import { cancelBookingEditPath, ROUTES } from "@/constants/routes";

export const createBookingApi = async ({
  serviceId,
  startDate,
  endDate,
}: {
  serviceId: string;
  startDate: string;
  endDate: string;
}) => {
  const response = await api.post(ROUTES.API.BOOKING, {
    serviceId,
    startDate,
    endDate,
  });
  return response;
};

export const verifyPaymentApi = async (paymentData: {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
}) => {
  const response = await api.post(ROUTES.API.VERIFY_PAYMENT, paymentData);
  return response;
};

export const cancelBookingApi = async (bookingId: string) => {
  const response = await api.patch(cancelBookingEditPath(bookingId));
  return response;
};

export const fetchUserBookingsApi = async () => {
  const response = await api.get(ROUTES.API.MY_BOOKINGS);
  return response;
};
