import { Link } from "react-router-dom";
import { format } from "date-fns";
import { Calendar, IndianRupee, Tag } from "lucide-react";
import BookingStatusBadge from "./BookingStatusBadge";

interface Booking {
  _id: string;
  service: {
    _id: string;
    title?: string;
    price?: number;
    location?: string;
    category?: string;
  };
  startDate: string;
  endDate: string;
  status: "pending" | "confirmed" | "completed" | "cancelled" | "failed";
  paymentStatus?: string;
  totalAmount?: number;
}

interface Props {
  booking: Booking;
}

export default function BookingCard({ booking }: Props) {
  const start = new Date(booking.startDate);
  const end = new Date(booking.endDate);
  const isMultiDay = end.getTime() - start.getTime() > 24 * 60 * 60 * 1000;

  return (
    <div className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow">
      <div className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="text-xl font-semibold text-gray-900">
              {booking.service.title}
            </h3>
            <div className="flex items-center gap-2 mt-1 text-sm text-gray-500">
              <Tag size={16} />
              <span>{booking.service.category || "Service"}</span>
            </div>
          </div>
          <BookingStatusBadge status={booking.status} />
        </div>

        <div className="space-y-3 mt-5">
          <div className="flex items-center gap-3 text-gray-700">
            <Calendar size={18} className="text-indigo-600" />
            <span>
              {format(start, "dd MMM yyyy")}
              {isMultiDay && ` — ${format(end, "dd MMM yyyy")}`}
            </span>
          </div>

          <div className="flex items-center gap-3 text-gray-900 font-medium mt-4 pt-4 border-t">
            <IndianRupee size={18} className="text-green-600" />
            <span>
              {booking.totalAmount
                ? `₹${booking.totalAmount.toLocaleString()}`
                : `₹${booking.service?.price?.toLocaleString()}`}
            </span>
            {booking.paymentStatus && (
              <span className="text-sm font-normal text-gray-500">
                • {booking.paymentStatus}
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="px-6 py-4 bg-gray-50 border-t flex justify-between items-center">
        <Link
          to={`/services/${booking.service._id}`}
          className="text-indigo-600 hover:text-indigo-800 text-sm font-medium"
        >
          View Service Details
        </Link>
      </div>
    </div>
  );
}
