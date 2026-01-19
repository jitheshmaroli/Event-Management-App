import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { MapPin, CheckCircle, AlertCircle } from 'lucide-react';

interface Service {
  id: string;
  title: string;
  category: string;
  pricePerDay: number;
  location: string;
  description: string;
  features: string[];
  contactName: string;
  contactPhone: string;
  imageUrl?: string;
}

export default function ServiceDetail() {
  const { id } = useParams<{ id: string }>();
  const [service, setService] = useState<Service | null>(null);
  const [loading, setLoading] = useState(true);
  const [bookingForm, setBookingForm] = useState({
    startDate: '',
    endDate: '',
    eventType: '',
    guests: '',
    specialRequests: ''
  });
  const [bookingStatus, setBookingStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    // Simulate fetch single service
    setTimeout(() => {
      const mockService: Service = {
        id: id || 's1',
        title: 'Luxury Garden Venue Marine Drive',
        category: 'Venue',
        pricePerDay: 45000,
        location: 'Marine Drive, Mumbai',
        description: 'Stunning sea-facing garden venue perfect for weddings and receptions. Capacity up to 500 guests. Includes basic lighting, parking, and green room facilities.',
        features: ['Sea view', 'Capacity 500+', 'Parking available', 'Green room', 'Basic lighting', 'Power backup'],
        contactName: 'Rajesh Patel',
        contactPhone: '+91 98765 43210',
        imageUrl: 'https://images.unsplash.com/photo-1519167758481-83f269a55a6c'
      };
      setService(mockService);
      setLoading(false);
    }, 800);
  }, [id]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setBookingForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmitBooking = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!bookingForm.startDate || !bookingForm.endDate) {
      setErrorMessage('Please select both start and end dates');
      setBookingStatus('error');
      return;
    }

    // Here you would call real API to create booking
    setBookingStatus('success');
    setTimeout(() => {
      setBookingStatus('idle');
    }, 4000);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (!service) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-center px-4">
        <AlertCircle size={64} className="text-red-500 mb-6" />
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Service Not Found</h1>
        <p className="text-gray-600 mb-8">The service you're looking for doesn't exist or has been removed.</p>
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
          <Link to="/services" className="text-indigo-600 hover:text-indigo-800">
            ← All Services
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Left - Images + Description */}
          <div className="lg:col-span-2 space-y-8">
            <div className="rounded-2xl overflow-hidden shadow-xl">
              <img 
                src={service.imageUrl} 
                alt={service.title}
                className="w-full h-96 object-cover"
              />
            </div>

            <div className="bg-white rounded-xl shadow-md p-8">
              <div className="flex flex-wrap items-start justify-between gap-4 mb-6">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">{service.title}</h1>
                  <div className="flex items-center gap-4 mt-3">
                    <span className="inline-flex px-4 py-2 bg-indigo-100 text-indigo-800 rounded-full font-medium">
                      {service.category}
                    </span>
                    <div className="flex items-center text-gray-600">
                      <MapPin size={18} className="mr-1" />
                      {service.location}
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-4xl font-bold text-green-600">
                    ₹{service.pricePerDay.toLocaleString()}
                  </div>
                  <div className="text-gray-500">per day</div>
                </div>
              </div>

              <p className="text-gray-700 text-lg leading-relaxed mb-8">
                {service.description}
              </p>

              <div>
                <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  <CheckCircle size={22} className="text-green-600" />
                  Features & Amenities
                </h3>
                <ul className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {service.features.map((feature, idx) => (
                    <li key={idx} className="flex items-center gap-2 text-gray-700">
                      <CheckCircle size={16} className="text-green-500" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Right - Booking Form */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-xl p-8 sticky top-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Book This Service</h2>

              {bookingStatus === 'success' ? (
                <div className="bg-green-50 border border-green-200 rounded-xl p-6 text-center">
                  <CheckCircle size={48} className="text-green-600 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-green-800 mb-2">Booking Request Sent!</h3>
                  <p className="text-green-700">
                    We'll contact you shortly to confirm availability and details.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmitBooking} className="space-y-6">
                  {bookingStatus === 'error' && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-sm text-red-700 flex items-start gap-3">
                      <AlertCircle size={20} className="mt-0.5" />
                      {errorMessage || 'Please check your dates and try again'}
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
                        min={new Date().toISOString().split('T')[0]}
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
                        min={bookingForm.startDate || new Date().toISOString().split('T')[0]}
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
                    <strong>{service.contactName}</strong> • {service.contactPhone}
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