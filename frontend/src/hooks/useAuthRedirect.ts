import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAppSelector } from "@/hooks/useAppSelector";
import { ROLES } from "@/constants/roles";
import { ROUTES } from "@/constants/routes";

export const useAuthRedirect = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user, isLoading } = useAppSelector(
    (state) => state.auth,
  );

  useEffect(() => {
    if (isLoading) return;

    if (isAuthenticated && user) {
      if (user.role === ROLES.ADMIN) {
        navigate(ROUTES.ADMIN.DASHBOARD, { replace: true });
      } else {
        navigate(ROUTES.USER.MY_BOOKINGS, { replace: true });
      }
    }
  }, [isAuthenticated, user, isLoading, navigate]);
};
