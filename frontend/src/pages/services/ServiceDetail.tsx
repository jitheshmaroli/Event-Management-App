// F:\Event-Management\frontend\src\pages\services\ServiceDetail.tsx
import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { MapPin, AlertCircle } from "lucide-react";
import { useAppDispatch } from "@/hooks/useAppDispatch";
import { fetchServiceById } from "@/features/services/servicesThunks";
import { useAppSelector } from "@/hooks/useAppSelector";

export default function ServiceDetail() {
  const { id } = useParams<{ id: string }>();
  const dispatch = useAppDispatch();
  const { currentService, loading } = useAppSelector((state) => state.services);

  const [bookingForm, setBookingForm] = useState({
    startDate: "",
    endDate: "",
    eventType: "",
    guests: "",
    specialRequests: "",
  });
  const [bookingStatus, setBookingStatus] = useState<
    "idle" | "success" | "error"
  >("idle");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (id) {
      dispatch(fetchServiceById(id));
    }
  }, [id, dispatch]);

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target;
    setBookingForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmitBooking = (e: React.FormEvent) => {
    e.preventDefault();

    if (!bookingForm.startDate || !bookingForm.endDate) {
      setErrorMessage("Please select both start and end dates");
      setBookingStatus("error");
      return;
    }

    // Here you would call real API to create booking
    setBookingStatus("success");
    setTimeout(() => {
      setBookingStatus("idle");
    }, 4000);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (!currentService) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-center px-4">
        <AlertCircle size={64} className="text-red-500 mb-6" />
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Service Not Found
        </h1>
        <p className="text-gray-600 mb-8">
          The service you're looking for doesn't exist or has been removed.
        </p>
        <Link
          to="/services"
          className="px-8 py-4 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition"
        >
          Browse All Services
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-4 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <div className="mb-8">
          <Link
            to="/services"
            className="text-indigo-600 hover:text-indigo-800"
          >
            ← All Services
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Left - Images + Description */}
          <div className="lg:col-span-2 space-y-8">
            <div className="rounded-2xl overflow-hidden shadow-xl">
              <img
                src={currentService.signedImages?.[0]}
                alt={currentService.title}
                className="w-full h-96 object-cover"
              />
            </div>

            {/* More images grid if >1 */}
            {currentService.signedImages?.length > 1 && (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
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
              <div className="flex flex-wrap items-start justify-between gap-4 mb-6">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">
                    {currentService.title}
                  </h1>
                  <div className="flex items-center gap-4 mt-3">
                    <span className="inline-flex px-4 py-2 bg-indigo-100 text-indigo-800 rounded-full font-medium">
                      {currentService.category}
                    </span>
                    <div className="flex items-center text-gray-600">
                      <MapPin size={18} className="mr-1" />
                      {currentService.location}
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-4xl font-bold text-green-600">
                    ₹{currentService.pricePerDay.toLocaleString()}
                  </div>
                  <div className="text-gray-500">per day</div>
                </div>
              </div>

              <p className="text-gray-700 text-lg leading-relaxed mb-8">
                {currentService.description}
              </p>
            </div>
          </div>

          {/* Right - Booking Form */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-xl p-8 sticky top-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Book This Service
              </h2>

              {bookingStatus === "success" ? (
                <div className="bg-green-50 border border-green-200 rounded-xl p-6 text-center">
                  <h3 className="text-xl font-semibold text-green-800 mb-2">
                    Booking Request Sent!
                  </h3>
                  <p className="text-green-700">
                    We'll contact you shortly to confirm availability and
                    details.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmitBooking} className="space-y-6">
                  {bookingStatus === "error" && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-sm text-red-700 flex items-start gap-3">
                      <AlertCircle size={20} className="mt-0.5" />
                      {errorMessage || "Please check your dates and try again"}
                    </div>
                  )}

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Start Date
                      </label>
                      <input
                        type="date"
                        name="startDate"
                        value={bookingForm.startDate}
                        onChange={handleInputChange}
                        required
                        min={new Date().toISOString().split("T")[0]}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        End Date
                      </label>
                      <input
                        type="date"
                        name="endDate"
                        value={bookingForm.endDate}
                        onChange={handleInputChange}
                        required
                        min={
                          bookingForm.startDate ||
                          new Date().toISOString().split("T")[0]
                        }
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Event Type
                    </label>
                    <select
                      name="eventType"
                      value={bookingForm.eventType}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    >
                      <option value="">Select event type</option>
                      <option>Wedding</option>
                      <option>Reception</option>
                      <option>Engagement</option>
                      <option>Birthday</option>
                      <option>Corporate Event</option>
                      <option>Other</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Expected Number of Guests
                    </label>
                    <input
                      type="number"
                      name="guests"
                      value={bookingForm.guests}
                      onChange={handleInputChange}
                      min="1"
                      placeholder="e.g. 250"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Special Requests / Notes
                    </label>
                    <textarea
                      name="specialRequests"
                      value={bookingForm.specialRequests}
                      onChange={handleInputChange}
                      rows={4}
                      placeholder="Any special requirements..."
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    />
                  </div>

                  <div className="pt-4">
                    <button
                      type="submit"
                      className="w-full bg-indigo-600 text-white py-4 rounded-xl font-semibold hover:bg-indigo-700 transition transform hover:-translate-y-1 shadow-lg"
                    >
                      Send Booking Request
                    </button>
                  </div>

                  <div className="text-center text-sm text-gray-500 mt-4">
                    Contact provider directly: <br />
                    <strong>{currentService.contactDetails.phone}</strong>
                    {currentService.contactDetails.email &&
                      ` • ${currentService.contactDetails.email}`}
                    {currentService.contactDetails.whatsapp &&
                      ` • WhatsApp: ${currentService.contactDetails.whatsapp}`}
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
