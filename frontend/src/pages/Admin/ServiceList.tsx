import { useState } from "react";
import { Link } from "react-router-dom";
import { deleteService } from "@/features/services/servicesThunks";
import { Pencil, Trash2, Eye, SlidersHorizontal } from "lucide-react";
import { useAppDispatch } from "@/hooks/useAppDispatch";
import { Button } from "@/components/ui/Button";
import { useServiceQuery } from "@/hooks/useServiceQuery";
import SearchBar from "@/components/common/SearchBar";
import SortDropdown from "@/components/common/SortDropdown";
import Pagination from "@/components/common/Pagination";
import FilterPanel from "@/components/common/FilterPanel";
import { type ServiceSortOption } from "@/constants/service.constants";
import { useFetchServices } from "@/hooks/useFetchServices";
import { serviceFilterFields, serviceSortOptions } from "@/types/service.types";

export default function ServiceList() {
  const dispatch = useAppDispatch();
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const { queryState, setSearch, setSort, setFilters, setPage, resetFilters } =
    useServiceQuery();
  const { services, loading, pagination, refetch } = useFetchServices({
    queryState,
  });

  const handleDelete = (id: string) => {
    if (!window.confirm("Delete this service permanently?")) return;
    dispatch(deleteService(id)).then(() => {
      refetch();
    });
  };

  if (loading && services.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 pt-4 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-10">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
              Manage Services
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
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-10 gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
              Manage Services
            </h1>
            <p className="mt-2 text-lg text-gray-600">
              {pagination?.total || 0} services listed
            </p>
          </div>
          <Link to="/admin/services/new">
            <Button size="lg">+ Add New Service</Button>
          </Link>
        </div>

        {/* Search and Filter Bar */}
        <div className="mb-8 flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <SearchBar
              onSearch={setSearch}
              initialValue={queryState.search}
              placeholder="Search services..."
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

        {/* Results */}
        {services.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-xl shadow-md">
            <div className="text-gray-400 text-6xl mb-6">📦</div>
            <h3 className="text-2xl font-semibold text-gray-700 mb-3">
              No services yet
            </h3>
            <p className="text-gray-600 mb-8">
              Start by adding your first service
            </p>
            <Link to="/admin/services/new">
              <Button>+ Create First Service</Button>
            </Link>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {services.map((service) => (
                <div
                  key={service._id}
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

                      <div className="flex items-center gap-3">
                        <Link to={`/admin/services/${service._id}`}>
                          <Button variant="ghost" size="sm" className="p-2">
                            <Eye size={18} />
                          </Button>
                        </Link>
                        <Link to={`/admin/services/${service._id}/edit`}>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="p-2 text-amber-600 hover:text-amber-800"
                          >
                            <Pencil size={18} />
                          </Button>
                        </Link>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="p-2 text-red-600 hover:text-red-800"
                          onClick={() => handleDelete(service._id)}
                        >
                          <Trash2 size={18} />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
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
