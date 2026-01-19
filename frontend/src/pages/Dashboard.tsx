import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Calendar, DollarSign, MapPin, ChevronRight, AlertCircle, Users } from 'lucide-react';

interface BookingSummary {
  id: string;
  serviceTitle: string;
  category: string;
  date: string;
  status: 'upcoming' | 'completed' | 'cancelled';
  totalPrice: number;
  location?: string;
}

export default function Dashboard() {
  const { user } = useAuth();
  const [bookings, setBookings] = useState<BookingSummary[]>([]);
  const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Simulate API delay
    const timer = setTimeout(() => {
      setBookings([
        {
          id: 'bk-001',
          serviceTitle: 'Luxury Garden Venue - Marine Drive',
          category: 'Venue',
          date: '2026-02-15',
          status: 'upcoming',
          totalPrice: 45000,
          location: 'Marine Drive, Mumbai'
        },
        {
          id: 'bk-002',
          serviceTitle: 'Professional Wedding Photography Team',
          category: 'Photographer',
          date: '2025-12-28',
          status: 'completed',
          totalPrice: 28000,
          location: 'Grand Hyatt, Mumbai'
        },
        {
          id: 'bk-003',
          serviceTitle: 'Live Band Performance',
          category: 'Music',
          date: '2026-01-10',
          status: 'cancelled',
          totalPrice: 18000,
          location: 'Taj Lands End'
        }
      ]);
      setLoading(false);
    }, 1200);

    return () => clearTimeout(timer);
  }, []);

  const upcomingBookings = bookings.filter(b => b.status === 'upcoming');
  const pastBookings = bookings.filter(b => b.status !== 'upcoming');

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Welcome Header */}
        <div className="mb-10">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
            Welcome back, {user?.name?.split(' ')[0] || 'User'}!
          </h1>
          <p className="mt-2 text-lg text-gray-600">
            Manage your bookings and explore more event services
          </p>
        </div>

        {/* Quick Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Upcoming Bookings</p>
                <p className="text-3xl font-bold text-indigo-600 mt-1">
                  {upcomingBookings.length}
                </p>
              </div>
              <div className="bg-indigo-100 p-3 rounded-full">
                <Calendar className="h-6 w-6 text-indigo-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Total Spent</p>
                <p className="text-3xl font-bold text-green-600 mt-1">
                  ₹{bookings.reduce((sum, b) => sum + b.totalPrice, 0).toLocaleString()}
                </p>
              </div>
              <div className="bg-green-100 p-3 rounded-full">
                <DollarSign className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Active Services</p>
                <p className="text-3xl font-bold text-purple-600 mt-1">
                  {new Set(bookings.map(b => b.category)).size}
                </p>
              </div>
              <div className="bg-purple-100 p-3 rounded-full">
                <Users className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Upcoming Bookings */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden mb-12">
          <div className="px-6 py-5 border-b border-gray-200 flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900">Upcoming Bookings</h2>
            <Link
              to="/bookings/new"
              className="text-indigo-600 hover:text-indigo-800 font-medium flex items-center gap-1"
            >
              Book New Service <ChevronRight size={18} />
            </Link>
          </div>

          {loading ? (
            <div className="p-12 text-center text-gray-500">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600 mx-auto mb-4"></div>
              Loading your bookings...
            </div>
          ) : upcomingBookings.length === 0 ? (
            <div className="p-12 text-center">
              <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 text-lg">No upcoming bookings yet</p>
              <Link
                to="/services"
                className="mt-4 inline-block px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
              >
                Explore Services
              </Link>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {upcomingBookings.map(booking => (
                <div key={booking.id} className="p-6 hover:bg-gray-50 transition">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">
                        {booking.serviceTitle}
                      </h3>
                      <div className="mt-1 flex flex-wrap gap-x-6 gap-y-1 text-sm text-gray-600">
                        <span className="flex items-center gap-1">
                          <Calendar size={16} /> {booking.date}
                        </span>
                        <span className="flex items-center gap-1">
                          <MapPin size={16} /> {booking.location}
                        </span>
                        <span className="flex items-center gap-1">
                          <DollarSign size={16} /> ₹{booking.totalPrice.toLocaleString()}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                        Upcoming
                      </span>
                      <Link
                        to={`/bookings/${booking.id}`}
                        className="text-indigo-600 hover:text-indigo-800 font-medium flex items-center gap-1"
                      >
                        View Details <ChevronRight size={16} />
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Past Bookings (collapsible or simple list) */}
        {pastBookings.length > 0 && (
          <div className="bg-white rounded-xl shadow-md overflow-hidden">
            <div className="px-6 py-5 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">Past Bookings</h2>
            </div>
            <div className="divide-y divide-gray-200">
              {pastBookings.map(booking => (
                <div key={booking.id} className="p-6 hover:bg-gray-50 transition opacity-75">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <h3 className="text-lg font-medium text-gray-800">
                        {booking.serviceTitle}
                      </h3>
                      <div className="mt-1 text-sm text-gray-600">
                        {booking.date} • {booking.category}
                      </div>
                    </div>
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                      booking.status === 'completed' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {booking.status === 'completed' ? 'Completed' : 'Cancelled'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}