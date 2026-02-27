import { useEffect, useCallback } from "react";
import { useAppDispatch } from "@/hooks/useAppDispatch";
import { useAppSelector } from "@/hooks/useAppSelector";
import { fetchServices } from "@/features/services/servicesThunks";
import { DEFAULT_PAGE_SIZE } from "@/constants/service.constants";
import { type ServiceQueryState } from "@/types/service.types";

interface UseFetchServicesProps {
  queryState: ServiceQueryState;
}

export function useFetchServices({ queryState }: UseFetchServicesProps) {
  const dispatch = useAppDispatch();
  const servicesState = useAppSelector((state) => state.services);

  const fetchData = useCallback(() => {
    dispatch(
      fetchServices({
        search: queryState.search,
        sort: queryState.sort,
        category: queryState.filters.category,
        minPrice: queryState.filters.minPrice,
        maxPrice: queryState.filters.maxPrice,
        dateFrom: queryState.filters.availabilityFrom,
        dateTo: queryState.filters.availabilityTo,
        page: queryState.page,
        limit: DEFAULT_PAGE_SIZE,
      }),
    );
  }, [
    dispatch,
    queryState.filters.availabilityFrom,
    queryState.filters.availabilityTo,
    queryState.filters.category,
    queryState.filters.maxPrice,
    queryState.filters.minPrice,
    queryState.page,
    queryState.search,
    queryState.sort,
  ]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return {
    ...servicesState,
    refetch: fetchData,
  };
}
