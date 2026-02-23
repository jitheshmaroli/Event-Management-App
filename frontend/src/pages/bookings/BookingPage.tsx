import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { fetchServiceById } from "@/features/services/servicesThunks";
import { createBooking } from "@/features/bookings/bookingThunks";
import AvailabilityDatePicker from "@/components/booking/AvailabilityDatePicker";
import PriceBreakdown from "@/components/booking/PriceBreakDown";
import { Button } from "@/components/ui/Button";
import { showError } from "@/utils/toast";
import { differenceInDays } from "date-fns";
import { BOOKING_MAX_DAYS } from "@/constants/booking";
import { useAppDispatch } from "@/hooks/useAppDispatch";
import { useAppSelector } from "@/hooks/useAppSelector";

export default function BookingPage() {
  const { serviceId } = useParams<{ serviceId: string }>();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const { currentService, loading } = useAppSelector((state) => state.services);

  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  useEffect(() => {
    if (serviceId) {
      dispatch(fetchServiceById(serviceId));
    }
  }, [serviceId, dispatch]);

  const handleDateChange = (start: Date | null, end: Date | null) => {
    setStartDate(start);
    setEndDate(end);
  };

  const handleBooking = async () => {
    if (!serviceId || !startDate || !endDate) return;

    const days = differenceInDays(endDate, startDate) + 1;
    if (days > BOOKING_MAX_DAYS) {
      showError(`Maximum ${BOOKING_MAX_DAYS} days allowed`);
      return;
    }

    setIsCreating(true);
    try {
      const result = await dispatch(
        createBooking({
          serviceId,
          startDate: startDate.toISOString(),
          endDate: endDate.toISOString(),
        }),
      ).unwrap();

      navigate("/bookings/summary", { state: { bookingData: result } });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      showError(err.message || "Failed to create booking");
    } finally {
      setIsCreating(false);
    }
  };

  const totalDays =
    startDate && endDate ? differenceInDays(endDate, startDate) + 1 : 0;
  const totalAmount =
    currentService && totalDays > 0
      ? currentService.pricePerDay * totalDays
      : 0;

  if (loading || !currentService) {
    return <div className="p-10 text-center">Loading service details...</div>;
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-2">Book {currentService.title}</h1>
      <p className="text-gray-600 mb-8">Select your preferred dates</p>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <AvailabilityDatePicker
            serviceId={serviceId!}
            startDate={startDate}
            endDate={endDate}
            onChange={handleDateChange}
            maxBookingDays={BOOKING_MAX_DAYS}
          />
        </div>

        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow-lg p-6 sticky top-6">
            <h2 className="text-xl font-semibold mb-6">Your Selection</h2>

            {startDate && endDate ? (
              <>
                <div className="space-y-4 mb-6">
                  <div className="flex justify-between text-lg">
                    <span>Check-in</span>
                    <span className="font-medium">
                      {startDate.toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex justify-between text-lg">
                    <span>Check-out</span>
                    <span className="font-medium">
                      {endDate.toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex justify-between text-lg font-medium">
                    <span>Total days</span>
                    <span>{totalDays}</span>
                  </div>
                </div>

                <PriceBreakdown amount={totalAmount} days={totalDays} />

                <Button
                  className="w-full mt-6"
                  size="lg"
                  onClick={handleBooking}
                  disabled={isCreating || totalDays === 0}
                  isLoading={isCreating}
                >
                  Proceed to Summary
                </Button>
              </>
            ) : (
              <div className="text-center py-10 text-gray-500">
                Select check-in and check-out dates to see the price
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
