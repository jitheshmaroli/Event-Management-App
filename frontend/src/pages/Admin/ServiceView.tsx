import { useParams, useNavigate } from "react-router-dom";
import { useAppSelector } from "@/hooks/useAppSelector";
import { ArrowLeft, MapPin, Pencil, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/Button";
import { useCallback, useEffect, useState } from "react";
import { useAppDispatch } from "@/hooks/useAppDispatch";
import {
  deleteService,
  fetchServiceById,
  fetchAvailability,
} from "@/features/services/servicesThunks";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { addMonths, format } from "date-fns";
import { fromDateKey, toDateKey } from "@/utils/date";

export default function ServiceView() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const { currentService, loading, availabilityByMonth } = useAppSelector(
    (state) => state.services,
  );
  const [hasAttemptedFetch, setHasAttemptedFetch] = useState(false);
  const [currentDate, setCurrentDate] = useState(new Date());

  const handleMonthChange = useCallback((date: Date) => {
    setCurrentDate(date);
  }, []);

  useEffect(() => {
    if (id) {
      dispatch(fetchServiceById(id)).finally(() => {
        setHasAttemptedFetch(true);
      });
    }
  }, [id, dispatch]);

  useEffect(() => {
    if (!id || !hasAttemptedFetch || !currentService) return;

    const year = currentDate.getFullYear();
    const month = currentDate.getMonth() + 1;
    const key = `${year}-${month}`;
    if (!availabilityByMonth[key]) {
      dispatch(fetchAvailability({ id, year, month }));
    }
  }, [
    id,
    hasAttemptedFetch,
    currentDate,
    currentService,
    dispatch,
    availabilityByMonth,
  ]);

  useEffect(() => {
    if (!id || !hasAttemptedFetch) return;

    if (!loading && currentService === null) {
      navigate("/admin/services", { replace: true });
    }
  }, [id, hasAttemptedFetch, loading, currentService, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-lg text-gray-600">Loading service...</p>
      </div>
    );
  }

  if (!currentService) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-center px-4 bg-gray-50">
        <div className="text-red-500 text-7xl mb-6">⚠️</div>
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Service Not Found
        </h1>
        <p className="text-gray-600 mb-8 max-w-md">
          The service you're looking for doesn't exist or has been removed.
        </p>
        <Link to="/admin/services">
          <Button size="lg">Back to Services</Button>
        </Link>
      </div>
    );
  }

  const handleDelete = () => {
    if (
      !window.confirm("Delete this service permanently? This cannot be undone.")
    )
      return;
    dispatch(deleteService(currentService._id));
    navigate("/admin/services");
  };

  const getDayClass = (date: Date) => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth() + 1;
    const key = `${year}-${month}`;
    const avail = availabilityByMonth[key];
    if (!avail) return "";

    const dayStr = toDateKey(date);

    if (avail.bookedDates.includes(dayStr)) return "bg-red-500 text-white";
    if (avail.availableDates.includes(dayStr)) return "bg-green-500 text-white";
    return "bg-gray-100 text-gray-400";
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-4 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top bar with back + admin icons */}
        <div className="mb-6 flex items-center justify-between">
          <button
            onClick={() => navigate(-1)}
            className="text-indigo-600 hover:text-indigo-800 font-medium flex items-center gap-2"
          >
            <ArrowLeft size={18} /> Back to Services
          </button>

          {/* Admin icon buttons */}
          <div className="flex items-center gap-3">
            <Link
              to={`/admin/services/${currentService._id}/edit`}
              className="p-2.5 text-gray-600 hover:text-indigo-600 rounded-full hover:bg-indigo-50 transition-colors"
              title="Edit Service"
            >
              <Pencil size={20} />
            </Link>
            <button
              onClick={handleDelete}
              className="p-2.5 text-gray-600 hover:text-red-600 rounded-full hover:bg-red-50 transition-colors"
              title="Delete Service"
            >
              <Trash2 size={20} />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Left column - Images + Details */}
          <div className="lg:col-span-2 space-y-8">
            {/* Hero Image */}
            {currentService.signedImages?.length > 0 ? (
              <div className="rounded-2xl overflow-hidden shadow-xl">
                <img
                  src={currentService.signedImages[0]}
                  alt={currentService.title}
                  className="w-full h-96 md:h-[500px] object-cover"
                />
              </div>
            ) : (
              <div className="h-96 bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl flex items-center justify-center text-gray-400 text-6xl shadow-xl">
                No Image
              </div>
            )}

            {/* More images grid if >1 */}
            {currentService.signedImages?.length > 1 && (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {currentService.signedImages.slice(1).map((img, idx) => (
                  <div
                    key={idx}
                    className="rounded-xl overflow-hidden shadow-md aspect-video"
                  >
                    <img
                      src={img}
                      alt=""
                      className="w-full h-full object-cover"
                    />
                  </div>
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
                    <span className="inline-flex px-5 py-2 bg-indigo-100 text-indigo-800 rounded-full font-medium text-lg">
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

              {/* Contact */}
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

          {/* Right column - Availability Calendar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-xl p-6 lg:sticky lg:top-8">
              <h2 className="text-xl font-bold text-gray-900 mb-5 flex items-center gap-2">
                Availability
                <span className="text-sm font-normal text-gray-500">
                  (Green=Available, Red=Booked)
                </span>
              </h2>

              <DatePicker
                inline
                selected={currentDate}
                onMonthChange={handleMonthChange}
                minDate={new Date()}
                maxDate={addMonths(new Date(), 12)}
                showMonthDropdown
                showYearDropdown
                dropdownMode="select"
                dayClassName={getDayClass}
              />

              {/* Ranges lists */}
              <div className="mt-8 space-y-6">
                <div>
                  <h4 className="text-sm font-medium text-gray-800 mb-3">
                    Available Periods (
                    {currentService.availability.availableRanges.length})
                  </h4>
                  <div className="space-y-2.5">
                    {currentService.availability.availableRanges.map(
                      (range, idx) => (
                        <div
                          key={idx}
                          className="flex items-center bg-green-50 border border-green-100 rounded-lg px-4 py-2.5 text-sm"
                        >
                          <span className="font-medium text-green-800">
                            {format(fromDateKey(range.from), "dd MMM yyyy")} –{" "}
                            {format(fromDateKey(range.to), "dd MMM yyyy")}
                          </span>
                        </div>
                      ),
                    )}
                    {currentService.availability.availableRanges.length ===
                      0 && (
                      <p className="text-sm text-gray-500 italic">
                        Always available (no specific periods defined)
                      </p>
                    )}
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-medium text-gray-800 mb-3">
                    Booked Periods (
                    {currentService.availability.bookedRanges.length})
                  </h4>
                  <div className="space-y-2.5">
                    {currentService.availability.bookedRanges.map(
                      (range, idx) => (
                        <div
                          key={idx}
                          className="flex items-center bg-red-50 border border-red-100 rounded-lg px-4 py-2.5 text-sm"
                        >
                          <span className="font-medium text-red-800">
                            {format(fromDateKey(range.from), "dd MMM yyyy")} –{" "}
                            {format(fromDateKey(range.to), "dd MMM yyyy")}
                          </span>
                        </div>
                      ),
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
