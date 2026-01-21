import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAppSelector } from "@/hooks/useAppSelector";

export function useAuthRedirect() {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAppSelector((state) => state.auth);

  useEffect(() => {
    if (isAuthenticated && user) {
      switch (user.role) {
        case "user":
          navigate("/dashboard", { replace: true });
          break;
        case "admin":
          navigate("/admin/dashboard", { replace: true });
          break;
        default:
          // fallback
          navigate("/dashboard", { replace: true });
          break;
      }
    }
  }, [isAuthenticated, user, navigate]);
}
