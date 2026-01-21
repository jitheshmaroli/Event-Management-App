import { Navigate, Outlet } from "react-router-dom";
import AuthLoading from "./AuthLoading";
import { useAppSelector } from "@/hooks/useAppSelector";

export default function AdminRoute() {
  const { isAuthenticated, user, isLoading } = useAppSelector(
    (state) => state.auth,
  );

  if (isLoading) {
    return <AuthLoading />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (user?.role !== "admin") {
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
}
