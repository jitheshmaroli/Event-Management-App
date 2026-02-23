import { Link } from "react-router-dom";
import { XCircle } from "lucide-react";

export default function BookingFailed() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center max-w-md p-8 bg-white rounded-2xl shadow-xl">
        <XCircle className="mx-auto text-red-500" size={80} />
        <h1 className="text-3xl font-bold mt-6 mb-4">Payment Failed</h1>
        <p className="text-gray-600 mb-8">
          Your payment could not be processed. Please try again.
        </p>
        <Link to="/">
          <button className="bg-indigo-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-indigo-700">
            Back to Home
          </button>
        </Link>
      </div>
    </div>
  );
}
