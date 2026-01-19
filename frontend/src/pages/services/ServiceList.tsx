import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, SlidersHorizontal, MapPin, DollarSign } from 'lucide-react';

// Placeholder type - replace with real type from backend later
interface Service {
  id: string;
  title: string;
  category: string;
  pricePerDay: number;
  location: string;
  description: string;
  imageUrl?: string;
  availableDates?: string[]; // simplified
}

const CATEGORIES = ['Venue', 'Caterer', 'Photographer', 'DJ/Music', 'Decorator', 'Makeup Artist', 'Event Planner'];

export default function ServicesList() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    search: '',
    category: '',
    priceMin: '',
    priceMax: '',
    location: '',
    date: '',
  });

  // Simulate API fetch
  useEffect(() => {
    setTimeout(() => {
      setServices([
        { id: 's1', title: 'Luxury Garden Venue Marine Drive', category: 'Venue', pricePerDay: 45000, location: 'Mumbai', description: 'Beautiful sea-facing garden...', imageUrl: 'https://images.unsplash.com/photo-1519167758481-83f269a55a6c' },
        { id: 's2', title: 'Premium Wedding Catering - 300 pax', category: 'Caterer', pricePerDay: 1200, location: 'Delhi', description: 'Multi-cuisine wedding specialist...', imageUrl: 'https://images.unsplash.com/photo-1555244162-803834f70033' },
        { id: 's3', title: 'Professional Candid Photography Team', category: 'Photographer', pricePerDay: 28000, location: 'Bangalore', description: 'Candid & cinematic style...', imageUrl: 'https://images.unsplash.com/photo-1523438885200-e635ba2c371e' },
        { id: 's4', title: 'Live Band + DJ Combo', category: 'DJ/Music', pricePerDay: 38000, location: 'Pune', description: 'High energy performances...', imageUrl: 'https://images.unsplash.com/photo-1501612780327-45045538702b' },
      ]);
      setLoading(false);
    }, 1200);
  }, []);

  const filteredServices = services.filter(service => {
    const matchesSearch = !filters.search || 
      service.title.toLowerCase().includes(filters.search.toLowerCase()) ||
      service.description.toLowerCase().includes(filters.search.toLowerCase());
    
    const matchesCategory = !filters.category || service.category === filters.category;
    
    const price = service.pricePerDay;
    const matchesPrice = 
      (!filters.priceMin || price >= Number(filters.priceMin)) &&
      (!filters.priceMax || price <= Number(filters.priceMax));
    
    const matchesLocation = !filters.location || 
      service.location.toLowerCase().includes(filters.location.toLowerCase());
    
    // Date availability would need real backend logic - placeholder
    const matchesDate = !filters.date || true;

    return matchesSearch && matchesCategory && matchesPrice && matchesLocation && matchesDate;
  });

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-4 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-10">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900">All Services</h1>
          <p className="mt-3 text-lg text-gray-600">
            Find the perfect service providers for your event • {filteredServices.length} services found
          </p>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-10 border border-gray-100">
          <div className="flex items-center gap-3 mb-5">
            <SlidersHorizontal className="text-indigo-600" size={22} />
            <h2 className="text-xl font-semibold text-gray-900">Filters</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input
                  name="search"
                  value={filters.search}
                  onChange={handleFilterChange}
                  placeholder="Venue, caterer, DJ..."
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
              <select
                name="category"
                value={filters.category}
                onChange={handleFilterChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white"
              >
                <option value="">All Categories</option>
                {CATEGORIES.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Price min</label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                  <input
                    name="priceMin"
                    type="number"
                    value={filters.priceMin}
                    onChange={handleFilterChange}
                    placeholder="₹0"
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Price max</label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                  <input
                    name="priceMax"
                    type="number"
                    value={filters.priceMax}
                    onChange={handleFilterChange}
                    placeholder="₹100000"
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input
                  name="location"
                  value={filters.location}
                  onChange={handleFilterChange}
                  placeholder="Mumbai, Delhi..."
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Services Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-white rounded-xl shadow-md overflow-hidden h-96 animate-pulse"></div>
            ))}
          </div>
        ) : filteredServices.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-gray-400 text-6xl mb-6">😔</div>
            <h3 className="text-2xl font-semibold text-gray-700 mb-3">No services found</h3>
            <p className="text-gray-600 mb-6">Try adjusting your filters</p>
            <button 
              onClick={() => setFilters({ search: '', category: '', priceMin: '', priceMax: '', location: '', date: '' })}
              className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredServices.map(service => (
              <Link
                key={service.id}
                to={`/services/${service.id}`}
                className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 border border-gray-100 group"
              >
                <div className="h-56 bg-gradient-to-br from-gray-200 to-gray-300 relative overflow-hidden">
                  {service.imageUrl && (
                    <img 
                      src={service.imageUrl} 
                      alt={service.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  )}
                </div>
                
                <div className="p-6">
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="text-xl font-bold text-gray-900 group-hover:text-indigo-600 transition-colors">
                      {service.title}
                    </h3>
                    <span className="inline-flex px-3 py-1 bg-indigo-100 text-indigo-800 rounded-full text-sm font-medium">
                      {service.category}
                    </span>
                  </div>

                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                    {service.description}
                  </p>

                  <div className="flex items-center justify-between">
                    <div className="text-xl font-bold text-green-600">
                      ₹{service.pricePerDay.toLocaleString()}<span className="text-sm font-normal text-gray-500"> /day</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-500">
                      <MapPin size={16} className="mr-1" />
                      {service.location}
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}