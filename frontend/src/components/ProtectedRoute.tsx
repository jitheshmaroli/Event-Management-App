import { Navigate, Outlet } from "react-router-dom";
import AuthLoading from "./AuthLoading";
import { useAppSelector } from "@/hooks/useAppSelector";

export default function ProtectedRoute() {
  const { isAuthenticated, isLoading } = useAppSelector((state) => state.auth);

  if (isLoading) return <AuthLoading />;
  if (!isAuthenticated) return <Navigate to="/login" replace />;

  return <Outlet />;
}
