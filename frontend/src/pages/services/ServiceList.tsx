// F:\Event-Management\frontend\src\pages\services\ServiceList.tsx
import { useState, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Search, SlidersHorizontal, MapPin, DollarSign } from "lucide-react";
import { useAppDispatch } from "@/hooks/useAppDispatch"; // Assuming useAppDispatch is correctly defined
import { fetchServices } from "@/features/services/servicesThunks";
import { useAppSelector } from "@/hooks/useAppSelector";

const CATEGORIES = [
  "Venue",
  "Caterer",
  "Photographer",
  "DJ/Music",
  "Decorator",
  "Makeup Artist",
  "Event Planner",
];

function useDebounce(value: string, delay: number) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

export default function ServicesList() {
  const dispatch = useAppDispatch();
  const { services, loading, pagination } = useAppSelector(
    (state) => state.services,
  );
  const [searchParams, setSearchParams] = useSearchParams();
  const [filters, setFilters] = useState({
    search: "",
    category: "",
    priceMin: "",
    priceMax: "",
    location: "",
    date: "",
  });
  const [page, setPage] = useState(Number(searchParams.get("page")) || 1);

  const debouncedSearch = useDebounce(filters.search, 300);
  const debouncedLocation = useDebounce(filters.location, 300);

  useEffect(() => {
    const params = new URLSearchParams();
    if (filters.search) params.set("search", filters.search);
    if (filters.category) params.set("category", filters.category);
    if (filters.priceMin) params.set("minPrice", filters.priceMin);
    if (filters.priceMax) params.set("maxPrice", filters.priceMax);
    if (filters.location) params.set("location", filters.location);
    if (filters.date) params.set("date", filters.date);
    if (page > 1) params.set("page", page.toString());
    setSearchParams(params, { replace: true });
  }, [filters, page, setSearchParams]);

  useEffect(() => {
    const query = {
      search: debouncedSearch || undefined,
      category: filters.category || undefined,
      minPrice: filters.priceMin ? Number(filters.priceMin) : undefined,
      maxPrice: filters.priceMax ? Number(filters.priceMax) : undefined,
      location: debouncedLocation || undefined,
      date: filters.date || undefined,
      page,
      limit: 12,
    };
    dispatch(fetchServices(query));
  }, [
    debouncedSearch,
    debouncedLocation,
    filters.category,
    filters.priceMin,
    filters.priceMax,
    filters.date,
    page,
    dispatch,
  ]);

  const handleFilterChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
    setPage(1);
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-4 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-10">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
            All Services
          </h1>
          <p className="mt-3 text-lg text-gray-600">
            Find the perfect service providers for your event •{" "}
            {pagination?.total || 0} services found
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
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Search
              </label>
              <div className="relative">
                <Search
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                  size={18}
                />
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
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category
              </label>
              <select
                name="category"
                value={filters.category}
                onChange={handleFilterChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white"
              >
                <option value="">All Categories</option>
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Price min
                </label>
                <div className="relative">
                  <DollarSign
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                    size={18}
                  />
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
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Price max
                </label>
                <div className="relative">
                  <DollarSign
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                    size={18}
                  />
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
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Location
              </label>
              <div className="relative">
                <MapPin
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                  size={18}
                />
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
              <div
                key={i}
                className="bg-white rounded-xl shadow-md overflow-hidden h-96 animate-pulse"
              ></div>
            ))}
          </div>
        ) : (pagination?.total || 0) === 0 ? (
          <div className="text-center py-20">
            <div className="text-gray-400 text-6xl mb-6">😔</div>
            <h3 className="text-2xl font-semibold text-gray-700 mb-3">
              No services found
            </h3>
            <p className="text-gray-600 mb-6">Try adjusting your filters</p>
            <button
              onClick={() =>
                setFilters({
                  search: "",
                  category: "",
                  priceMin: "",
                  priceMax: "",
                  location: "",
                  date: "",
                })
              }
              className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service) => (
              <Link
                key={service._id}
                to={`/services/${service._id}`}
                className="group bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl hover:border-indigo-200 border border-gray-100 transition-all duration-300 flex flex-col"
              >
                <div className="relative h-56 overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200">
                  {service.signedImages?.[0] && (
                    <img
                      src={service.signedImages[0]}
                      alt={service.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                    />
                  )}
                  <span className="absolute top-4 right-4 px-3 py-1.5 bg-indigo-600/90 text-white text-xs font-medium rounded-full backdrop-blur-sm">
                    {service.category}
                  </span>
                </div>

                <div className="p-6 flex flex-col flex-grow">
                  <h3 className="text-xl font-bold text-gray-900 group-hover:text-indigo-700 transition-colors mb-2 line-clamp-2">
                    {service.title}
                  </h3>

                  <p className="text-gray-600 text-sm mb-4 line-clamp-2 flex-grow">
                    {service.description}
                  </p>

                  <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-100">
                    <div className="text-2xl font-bold text-green-600">
                      ₹{service.pricePerDay.toLocaleString()}
                      <span className="text-base font-normal text-gray-500">
                        {" "}
                        /day
                      </span>
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <MapPin size={16} className="mr-1.5" />
                      {service.location}
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* Pagination */}
        {pagination && pagination.pages > 1 && (
          <div className="flex justify-between items-center mt-12 max-w-md mx-auto">
            <button
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg disabled:bg-gray-300 disabled:cursor-not-allowed"
              disabled={page === 1}
              onClick={() => setPage(page - 1)}
            >
              Previous
            </button>
            <span className="text-gray-600">
              Page {page} of {pagination.pages}
            </span>
            <button
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg disabled:bg-gray-300 disabled:cursor-not-allowed"
              disabled={page === pagination.pages}
              onClick={() => setPage(page + 1)}
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
