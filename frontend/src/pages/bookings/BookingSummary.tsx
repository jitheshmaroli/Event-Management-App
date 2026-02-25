import { useLocation, useNavigate } from "react-router-dom";
import RefundPolicy from "@/components/booking/RefundPolicy";
import { Button } from "@/components/ui/Button";
import PriceBreakdown from "@/components/booking/PriceBreakDown";
import { showError } from "@/utils/toast";

export default function BookingSummary() {
  const { state } = useLocation();
  const { bookingData } = state || {};
  const navigate = useNavigate();

  if (!bookingData) return <div>No booking data</div>;

  const { booking, order } = bookingData;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Booking Summary</h1>

      <div className="bg-white p-6 rounded-xl shadow mb-6">
        <h2 className="text-xl font-semibold mb-4">Dates</h2>
        <p>From: {new Date(booking.startDate).toDateString()}</p>
        <p>To: {new Date(booking.endDate).toDateString()}</p>
        <p>Days: {booking.numberOfDays}</p>
      </div>

      <PriceBreakdown
        amount={booking.totalAmount}
        days={booking.numberOfDays}
      />

      <RefundPolicy />

      <Button
        size="lg"
        className="w-full mt-8"
        onClick={() => {
          if (!order?.id || !booking?._id) {
            showError("Invalid booking data");
            return;
          }
          navigate("/bookings/payment", {
            state: { order, bookingId: booking._id },
          });
        }}
      >
        Proceed to Payment
      </Button>
    </div>
  );
}
