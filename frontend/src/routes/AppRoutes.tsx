import { Routes, Route } from "react-router-dom";
import MainLayout from "@/components/layout/MainLayout";
import Home from "@/pages/Home";
import Login from "@/pages/auth/Login";
import Register from "@/pages/auth/Register";
import VerifyEmail from "@/pages/auth/VerifyOtp";
import Dashboard from "@/pages/Dashboard";
import AdminDashboard from "@/pages/Admin/Dashboard";
import ServiceList from "@/pages/services/ServiceList";
import ServiceDetail from "@/pages/services/ServiceDetail";
import ForgotPassword from "@/pages/auth/ForgotPassword";
import ResetPassword from "@/pages/auth/ResetPassword";
import AdminLogin from "@/pages/auth/AdminLogin";
import RoleProtectedRoute from "@/components/RoleProtectedRoute";
import { ROLES } from "@/constants/roles";
import NotFound from "@/pages/errors/NotFound";
import Unauthorized from "@/pages/errors/Unauthorized";

export default function AppRoutes() {
  return (
    <Routes>
      {/* Public pages – no layout */}
      <Route path="/login" element={<Login />} />
      <Route path="/admin/login" element={<AdminLogin />} />
      <Route path="/register" element={<Register />} />
      <Route path="/verify-otp" element={<VerifyEmail />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />

      {/* Protected pages with layout */}
      <Route element={<MainLayout />}>
        <Route path="/" element={<Home />} />
        <Route element={<RoleProtectedRoute allowedRoles={[ROLES.USER]} />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/services" element={<ServiceList />} />
          <Route path="/services/:id" element={<ServiceDetail />} />
        </Route>

        <Route element={<RoleProtectedRoute allowedRoles={[ROLES.ADMIN]} />}>
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          {/* more admin routes later */}
        </Route>
      </Route>

      {/* error routes */}
      <Route path="/404" element={<NotFound />} />
      <Route path="/unauthorized" element={<Unauthorized />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
