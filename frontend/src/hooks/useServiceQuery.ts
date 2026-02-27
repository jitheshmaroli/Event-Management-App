import { useState, useEffect, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import {
  type ServiceFilters,
  type ServiceQueryState,
} from "@/types/service.types";
import {
  SERVICE_SORT_OPTIONS,
  type ServiceSortOption,
  DEFAULT_PAGE_SIZE,
} from "@/constants/service.constants";

interface UseServiceQueryProps {
  initialFilters?: Partial<ServiceFilters>;
}

export function useServiceQuery({
  initialFilters = {},
}: UseServiceQueryProps = {}) {
  const [searchParams, setSearchParams] = useSearchParams();

  const [queryState, setQueryState] = useState<ServiceQueryState>(() => {
    // Parse URL params
    const search = searchParams.get("search") || "";
    const sort =
      (searchParams.get("sort") as ServiceSortOption) ||
      SERVICE_SORT_OPTIONS.NEWEST;
    const category =
      searchParams.get("category") || initialFilters.category || "";
    const minPriceParam = searchParams.get("minPrice");
    const maxPriceParam = searchParams.get("maxPrice");
    const minPrice = minPriceParam ? Number(minPriceParam) : undefined;
    const maxPrice = maxPriceParam ? Number(maxPriceParam) : undefined;
    const availabilityFrom =
      searchParams.get("dateFrom") || initialFilters.availabilityFrom || "";
    const availabilityTo =
      searchParams.get("dateTo") || initialFilters.availabilityTo || "";
    const page = Number(searchParams.get("page")) || 1;

    return {
      search,
      sort,
      filters: {
        category,
        minPrice,
        maxPrice,
        location,
        availabilityFrom,
        availabilityTo,
      },
      page,
      limit: DEFAULT_PAGE_SIZE,
    };
  });

  // Update URL when query changes
  useEffect(() => {
    const params = new URLSearchParams();

    if (queryState.search) params.set("search", queryState.search);
    if (queryState.sort !== SERVICE_SORT_OPTIONS.NEWEST)
      params.set("sort", queryState.sort);
    if (queryState.filters.category)
      params.set("category", queryState.filters.category);
    if (queryState.filters.minPrice !== undefined)
      params.set("minPrice", queryState.filters.minPrice.toString());
    if (queryState.filters.maxPrice !== undefined)
      params.set("maxPrice", queryState.filters.maxPrice.toString());
    if (queryState.filters.availabilityFrom)
      params.set("dateFrom", queryState.filters.availabilityFrom);
    if (queryState.filters.availabilityTo)
      params.set("dateTo", queryState.filters.availabilityTo);
    if (queryState.page > 1) params.set("page", queryState.page.toString());

    setSearchParams(params, { replace: true });
  }, [queryState, setSearchParams]);

  const setSearch = useCallback((search: string) => {
    setQueryState((prev) => ({
      ...prev,
      search,
      page: 1,
    }));
  }, []);

  const setSort = useCallback((sort: ServiceSortOption) => {
    setQueryState((prev) => ({
      ...prev,
      sort,
      page: 1,
    }));
  }, []);

  const setFilters = useCallback((filters: ServiceFilters) => {
    setQueryState((prev) => ({
      ...prev,
      filters,
      page: 1,
    }));
  }, []);

  const setPage = useCallback((page: number) => {
    setQueryState((prev) => ({
      ...prev,
      page,
    }));
  }, []);

  const resetFilters = useCallback(() => {
    setQueryState((prev) => ({
      ...prev,
      search: "",
      sort: SERVICE_SORT_OPTIONS.NEWEST,
      filters: {
        category: "",
        minPrice: undefined,
        maxPrice: undefined,
        location: "",
        availabilityFrom: "",
        availabilityTo: "",
      },
      page: 1,
    }));
  }, []);

  return {
    queryState,
    setSearch,
    setSort,
    setFilters,
    setPage,
    resetFilters,
  };
}
