import { useEffect, useState, type ReactNode } from "react";
import { getCurrentUser, logout } from "@/lib/auth";
import { AuthContext, type AuthContextType } from "@/context/AuthContext";
import type { SendOtpData, User } from "@/lib/types";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadUser = async () => {
      try {
        const response = await getCurrentUser();
        setUser(response?.data?.user ?? null);
      } catch {
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };
    loadUser();
  }, []);

  const signOut = async () => {
    try {
      await logout();
    } finally {
      setUser(null);
      window.location.href = "/login";
    }
  };

  const login = async (credentials: { email: string; password: string }) => {
    await import("@/lib/auth").then((m) => m.login(credentials));

    const userResponse = await getCurrentUser();
    console.log(userResponse);
    setUser(userResponse?.data?.user ?? null);
  };

  const register = async (data: {
    name: string;
    email: string;
    password: string;
    phone?: string;
  }) => {
    await import("@/lib/auth").then((m) => m.register(data));
  };

  const verifyOtp = async (email: string, otp: string) => {
    await import("@/lib/auth").then((m) => m.verifyOtp({ email, otp }));

    const userResponse = await getCurrentUser();
    setUser(userResponse?.data?.user ?? null);
  };

  const resetPassword = async (email: string, newPassword: string) => {
    await import("@/lib/auth").then((m) => m.resetPassword(email, newPassword));
  };

  const sendOtp = async (data: SendOtpData) => {
    await import("@/lib/auth").then((m) => m.sendOtp(data));
  };

  const value: AuthContextType = {
    user,
    isLoading,
    isAuthenticated: !!user,
    login,
    register,
    verifyOtp,
    sendOtp,
    resetPassword,
    signOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
