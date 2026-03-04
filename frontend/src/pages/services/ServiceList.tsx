import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/Button";
import { useServiceQuery } from "@/hooks/useServiceQuery";
import { SlidersHorizontal } from "lucide-react";
import SearchBar from "@/components/common/SearchBar";
import SortDropdown from "@/components/common/SortDropdown";
import Pagination from "@/components/common/Pagination";
import FilterPanel from "@/components/common/FilterPanel";
import { type ServiceSortOption } from "@/constants/service.constants";
import { useFetchServices } from "@/hooks/useFetchServices";
import { serviceFilterFields, serviceSortOptions } from "@/types/service.types";

export default function ServiceList() {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const { queryState, setSearch, setSort, setFilters, setPage, resetFilters } =
    useServiceQuery();

  const { services, loading, pagination } = useFetchServices({
    queryState,
  });

  if (loading && services.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 pt-4 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-10">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
              Services
            </h1>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="bg-white rounded-xl shadow-md overflow-hidden h-[420px] animate-pulse"
              />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-4 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
            Available Services
          </h1>
          <p className="mt-2 text-lg text-gray-600">
            {pagination?.total || 0} services available
          </p>
        </div>

        {/* Search and Filter Bar */}
        <div className="mb-8 flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <SearchBar
              onSearch={setSearch}
              initialValue={queryState.search}
              placeholder="Search by service name..."
            />
          </div>
          <div className="flex gap-3">
            <SortDropdown<ServiceSortOption>
              value={queryState.sort}
              options={serviceSortOptions}
              onChange={setSort}
            />
            <button
              onClick={() => setIsFilterOpen(true)}
              className="px-4 py-3 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 flex items-center gap-2"
            >
              <SlidersHorizontal size={18} />
              <span className="hidden sm:inline">Filters</span>
            </button>
          </div>
        </div>

        {/* Active Filters Summary */}
        {(queryState.filters.category ||
          queryState.filters.availabilityFrom ||
          queryState.filters.availabilityTo ||
          queryState.filters.minPrice !== undefined ||
          queryState.filters.maxPrice !== undefined) && (
          <div className="mb-6 flex flex-wrap gap-2">
            {queryState.filters.category && (
              <span className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-sm">
                Category: {queryState.filters.category}
              </span>
            )}
            {queryState.filters.availabilityFrom &&
              queryState.filters.availabilityTo && (
                <span className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-sm">
                  From{" "}
                  {new Date(
                    queryState.filters.availabilityFrom,
                  ).toLocaleDateString()}
                  to{" "}
                  {new Date(
                    queryState.filters.availabilityTo,
                  ).toLocaleDateString()}
                </span>
              )}
            {queryState.filters.availabilityFrom &&
              !queryState.filters.availabilityTo && (
                <span className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-sm">
                  From{" "}
                  {new Date(
                    queryState.filters.availabilityFrom,
                  ).toLocaleDateString()}{" "}
                  onwards
                </span>
              )}
            {!queryState.filters.availabilityFrom &&
              queryState.filters.availabilityTo && (
                <span className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-sm">
                  Available until{" "}
                  {new Date(
                    queryState.filters.availabilityTo,
                  ).toLocaleDateString()}
                </span>
              )}
            {(queryState.filters.minPrice !== undefined ||
              queryState.filters.maxPrice !== undefined) && (
              <span className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-sm">
                Price: ₹{queryState.filters.minPrice ?? 0} - ₹
                {queryState.filters.maxPrice ?? "∞"}
              </span>
            )}
          </div>
        )}

        {/* Results */}
        {services.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-xl shadow-md">
            <div className="text-gray-400 text-6xl mb-6">📦</div>
            <h3 className="text-2xl font-semibold text-gray-700 mb-3">
              No services found
            </h3>
            <p className="text-gray-600">
              Try adjusting your search or filters
            </p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {services.map((service) => (
                <Link
                  key={service._id}
                  to={`/services/${service._id}`}
                  className="group bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl hover:border-indigo-200 border border-gray-100 transition-all duration-300 flex flex-col"
                >
                  <div className="relative h-48 overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200">
                    {service.signedImages?.[0] ? (
                      <img
                        src={service.signedImages[0]}
                        alt={service.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400 text-5xl">
                        📷
                      </div>
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

                      <Button variant="default" size="sm">
                        View Details
                      </Button>
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            {/* Pagination */}
            {pagination && pagination.pages > 1 && (
              <div className="mt-12">
                <Pagination
                  currentPage={queryState.page}
                  totalPages={pagination.pages}
                  totalItems={pagination.total}
                  onPageChange={setPage}
                />
              </div>
            )}
          </>
        )}
      </div>

      {/* Filter Panel */}
      <FilterPanel
        isOpen={isFilterOpen}
        onClose={() => setIsFilterOpen(false)}
        filters={queryState.filters}
        fields={serviceFilterFields}
        onApplyFilters={setFilters}
        onReset={resetFilters}
      />
    </div>
  );
}
