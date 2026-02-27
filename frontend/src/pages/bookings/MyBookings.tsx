import { useEffect, useState } from "react";
import { fetchUserBookings } from "@/features/bookings/bookingThunks";
import { Calendar, CheckCircle, Clock, Loader2 } from "lucide-react";
import BookingCard from "@/components/booking/BookingCard";
import { useAppDispatch } from "@/hooks/useAppDispatch";
import { useAppSelector } from "@/hooks/useAppSelector";

type Tab = "ongoing" | "upcoming" | "past";

export default function MyBookings() {
  const dispatch = useAppDispatch();
  const { bookings, loading, error } = useAppSelector(
    (state) => state.bookings,
  );

  const [activeTab, setActiveTab] = useState<Tab>("upcoming");

  useEffect(() => {
    dispatch(fetchUserBookings());
  }, [dispatch]);

  const now = new Date();

  const upcoming = bookings.filter((b) => new Date(b.startDate) > now);
  const ongoing = bookings.filter((b) => {
    const start = new Date(b.startDate);
    const end = new Date(b.endDate);
    return start <= now && end > now;
  });
  const past = bookings.filter((b) => new Date(b.endDate) <= now);

  const getCurrentData = () => {
    switch (activeTab) {
      case "ongoing":
        return { list: ongoing, label: "Ongoing", icon: Clock, color: "amber" };
      case "upcoming":
        return {
          list: upcoming,
          label: "Upcoming",
          icon: Calendar,
          color: "indigo",
        };
      case "past":
        return {
          list: past,
          label: "Completed & Past",
          icon: CheckCircle,
          color: "green",
        };
      default:
        return {
          list: upcoming,
          label: "Upcoming",
          icon: Calendar,
          color: "indigo",
        };
    }
  };

  const { list: currentList, label, icon: Icon } = getCurrentData();

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-indigo-600" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12 text-red-600">
        Failed to load bookings: {error}
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-2">My Bookings</h1>
      <p className="text-gray-600 mb-8">
        View and manage all your event service bookings
      </p>

      {/* Tabs */}
      <div className="mb-8 border-b border-gray-200">
        <nav className="-mb-px flex space-x-8" aria-label="Tabs">
          <button
            onClick={() => setActiveTab("ongoing")}
            className={`group inline-flex items-center px-1 py-4 border-b-2 font-medium text-sm ${
              activeTab === "ongoing"
                ? `border-amber-500 text-amber-600`
                : `border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300`
            }`}
          >
            <Clock
              className={`-ml-0.5 mr-2 h-5 w-5 ${
                activeTab === "ongoing"
                  ? "text-amber-500"
                  : "text-gray-400 group-hover:text-gray-500"
              }`}
              aria-hidden="true"
            />
            Ongoing
            {ongoing.length > 0 && (
              <span className="ml-2 py-0.5 px-2.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800">
                {ongoing.length}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab("upcoming")}
            className={`group inline-flex items-center px-1 py-4 border-b-2 font-medium text-sm ${
              activeTab === "upcoming"
                ? `border-indigo-500 text-indigo-600`
                : `border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300`
            }`}
          >
            <Calendar
              className={`-ml-0.5 mr-2 h-5 w-5 ${
                activeTab === "upcoming"
                  ? "text-indigo-500"
                  : "text-gray-400 group-hover:text-gray-500"
              }`}
              aria-hidden="true"
            />
            Upcoming
            {upcoming.length > 0 && (
              <span className="ml-2 py-0.5 px-2.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                {upcoming.length}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab("past")}
            className={`group inline-flex items-center px-1 py-4 border-b-2 font-medium text-sm ${
              activeTab === "past"
                ? `border-green-500 text-green-600`
                : `border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300`
            }`}
          >
            <CheckCircle
              className={`-ml-0.5 mr-2 h-5 w-5 ${
                activeTab === "past"
                  ? "text-green-500"
                  : "text-gray-400 group-hover:text-gray-500"
              }`}
              aria-hidden="true"
            />
            Past
            {past.length > 0 && (
              <span className="ml-2 py-0.5 px-2.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                {past.length}
              </span>
            )}
          </button>
        </nav>
      </div>

      {/* Content Area */}
      <section>
        {currentList.length === 0 ? (
          <div className="bg-white rounded-xl p-10 text-center border border-gray-200 shadow-sm">
            <Icon className={`mx-auto h-12 w-12 text-gray-400 mb-4`} />
            <h3 className="text-xl font-medium text-gray-700 mb-2">
              No {label.toLowerCase()} bookings
            </h3>
            <p className="text-gray-500 mb-6">
              {activeTab === "upcoming"
                ? "When you book a service, it will appear here."
                : activeTab === "ongoing"
                  ? "Bookings that are currently active will appear here."
                  : "Your completed or past bookings will appear here."}
            </p>

            {activeTab === "upcoming" && (
              <a
                href="/services"
                className="inline-block bg-indigo-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-indigo-700"
              >
                Browse Services
              </a>
            )}
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3">
            {currentList.map((booking) => (
              <BookingCard key={booking._id} booking={booking} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
