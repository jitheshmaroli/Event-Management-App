import { useAppSelector } from "@/hooks/useAppSelector";
import AuthLoading from "./AuthLoading";
import { Navigate, Outlet } from "react-router-dom";

export default function RoleProtectedRoute({
  allowedRoles,
}: {
  allowedRoles: string[];
}) {
  const { isAuthenticated, user, isLoading } = useAppSelector(
    (state) => state.auth,
  );

  if (isLoading) return <AuthLoading />;

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (!user || !allowedRoles.includes(user.role)) {
    return <Navigate to="/unauthorized" replace />;
  }
  return <Outlet />;
}
