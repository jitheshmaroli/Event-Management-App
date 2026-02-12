import { useParams, useNavigate } from "react-router-dom";
import { useAppSelector } from "@/hooks/useAppSelector";
import { ArrowLeft, MapPin } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { useCallback, useEffect, useState } from "react";
import { useAppDispatch } from "@/hooks/useAppDispatch";
import {
  fetchServiceById,
  fetchAvailability,
} from "@/features/services/servicesThunks";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { addMonths } from "date-fns";
import { toDateKey } from "@/utils/date";

export default function ServiceDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const { currentService, loading, availabilityByMonth } = useAppSelector(
    (state) => state.services,
  );
  const [currentDate, setCurrentDate] = useState(new Date());

  const handleMonthChange = useCallback((date: Date) => {
    setCurrentDate(date);
  }, []);

  useEffect(() => {
    if (id) {
      dispatch(fetchServiceById(id));
    }
  }, [id, dispatch]);

  useEffect(() => {
    if (!id || !currentService) return;

    const year = currentDate.getFullYear();
    const month = currentDate.getMonth() + 1;
    const key = `${year}-${month}`;
    if (!availabilityByMonth[key]) {
      dispatch(fetchAvailability({ id, year, month }));
    }
  }, [id, currentDate, currentService, dispatch, availabilityByMonth]);

  if (loading || !currentService) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-lg text-gray-600">Loading service...</p>
      </div>
    );
  }

  const getDayClass = (date: Date) => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth() + 1;

    const key = `${year}-${month}`;
    const avail = availabilityByMonth[key];
    if (!avail) return "";

    const dayStr = toDateKey(date);

    if (avail.bookedDates.includes(dayStr)) return "bg-red-500 text-white";
    if (avail.availableDates.includes(dayStr)) return "bg-green-500 text-white";
    if (avail.blockedDates.includes(dayStr)) return "bg-gray-500 text-white";

    return "bg-gray-100 text-gray-400";
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-4 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <button
          onClick={() => navigate(-1)}
          className="text-indigo-600 hover:text-indigo-800 font-medium flex items-center gap-2 mb-6"
        >
          <ArrowLeft size={18} /> Back to Services
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          <div className="lg:col-span-2 space-y-8">
            {currentService.signedImages?.length > 0 ? (
              <img
                src={currentService.signedImages[0]}
                alt={currentService.title}
                className="w-full h-96 md:h-[500px] object-cover rounded-2xl shadow-xl"
              />
            ) : (
              <div className="h-96 bg-gray-200 rounded-2xl flex items-center justify-center text-gray-400 text-6xl shadow-xl">
                No Image
              </div>
            )}

            {currentService.signedImages?.length > 1 && (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {currentService.signedImages.slice(1).map((img, idx) => (
                  <img
                    key={idx}
                    src={img}
                    alt=""
                    className="w-full h-auto object-cover rounded-xl shadow-md aspect-video"
                  />
                ))}
              </div>
            )}

            <div className="bg-white rounded-xl shadow-md p-8">
              <div className="flex flex-wrap items-start justify-between gap-6 mb-6">
                <div>
                  <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
                    {currentService.title}
                  </h1>
                  <div className="flex flex-wrap items-center gap-4 mt-4">
                    <span className="px-5 py-2 bg-indigo-100 text-indigo-800 rounded-full font-medium text-lg">
                      {currentService.category}
                    </span>
                    <div className="flex items-center text-gray-700 text-lg">
                      <MapPin size={20} className="mr-2" />
                      {currentService.location}
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-5xl font-bold text-green-600">
                    ₹{currentService.pricePerDay.toLocaleString()}
                  </div>
                  <div className="text-gray-500 text-lg">per day</div>
                </div>
              </div>

              <p className="text-gray-700 text-lg leading-relaxed mb-10 whitespace-pre-line">
                {currentService.description || "No description provided."}
              </p>

              <div className="border-t border-gray-100 pt-8 mt-8">
                <h3 className="text-xl font-semibold mb-4">Contact Details</h3>
                <div className="space-y-3 text-gray-700">
                  <p>
                    <strong>Phone:</strong> {currentService.phone || "—"}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-xl p-6 lg:sticky lg:top-8">
              <h2 className="text-xl font-bold text-gray-900 mb-5 flex items-center gap-2">
                Check Availability
                <span className="text-sm font-normal text-gray-500">
                  (Green=Available, Red=Booked, Gray=Blocked)
                </span>
              </h2>

              <DatePicker
                inline
                selected={currentDate}
                onMonthChange={handleMonthChange}
                minDate={new Date()}
                maxDate={addMonths(new Date(), 12)}
                dayClassName={getDayClass}
              />

              <Button className="w-full mt-6" size="lg">
                Book Now
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
