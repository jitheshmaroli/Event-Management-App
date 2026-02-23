import { Link } from "react-router-dom";
import { CheckCircle } from "lucide-react";

export default function BookingSuccess() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center max-w-md p-8 bg-white rounded-2xl shadow-xl">
        <CheckCircle className="mx-auto text-green-500" size={80} />
        <h1 className="text-3xl font-bold mt-6 mb-4">Booking Confirmed!</h1>
        <p className="text-gray-600 mb-8">
          Your booking has been successfully confirmed. You will receive a
          confirmation email shortly.
        </p>
        <Link to="/dashboard">
          <button className="bg-indigo-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-indigo-700">
            Go to Dashboard
          </button>
        </Link>
      </div>
    </div>
  );
}
