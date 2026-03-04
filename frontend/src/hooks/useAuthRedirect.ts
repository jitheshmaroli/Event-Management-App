import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAppSelector } from "@/hooks/useAppSelector";
import { ROLES } from "@/constants/roles";

export const useAuthRedirect = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user, isLoading } = useAppSelector(
    (state) => state.auth,
  );

  useEffect(() => {
    if (isLoading) return;

    if (isAuthenticated && user) {
      if (user.role === ROLES.ADMIN) {
        navigate("/admin/dashboard", { replace: true });
      } else {
        navigate("/my-bookings", { replace: true });
      }
    }
  }, [isAuthenticated, user, isLoading, navigate]);
};
