import type { ApiErrorResponse } from "./types";

export const getErrorMessage = (error: unknown): string => {
  const err = error as ApiErrorResponse;
  return (
    err.response?.data?.message ||
    (err as Error).message ||
    "An unexpected error occurred"
  );
};
