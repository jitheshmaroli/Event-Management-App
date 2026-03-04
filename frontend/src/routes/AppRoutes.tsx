import { Routes, Route } from "react-router-dom";
import MainLayout from "@/components/layout/MainLayout";
import Home from "@/pages/Home";
import Login from "@/pages/auth/Login";
import Register from "@/pages/auth/Register";
import VerifyEmail from "@/pages/auth/VerifyOtp";
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
import ServicesList from "@/pages/Admin/ServiceList";
import ServiceCreate from "@/pages/Admin/ServiceCreate";
import ServiceView from "@/pages/Admin/ServiceView";
import ServiceEdit from "@/pages/Admin/ServiceEdit";
import BookingPage from "@/pages/bookings/BookingPage";
import BookingSummary from "@/pages/bookings/BookingSummary";
import PaymentPage from "@/pages/bookings/PaymentPage";
import BookingSuccess from "@/pages/bookings/BookingSuccess";
import BookingFailed from "@/pages/bookings/BookingFailed";
import MyBookings from "@/pages/bookings/MyBookings";
import AdminUsers from "@/pages/Admin/Users";
import AdminBookings from "@/pages/Admin/Bookings";
import Profile from "@/pages/user/Profile";

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
        <Route path="/services" element={<ServiceList />} />
        <Route path="/services/:id" element={<ServiceDetail />} />
        <Route element={<RoleProtectedRoute allowedRoles={[ROLES.USER]} />}>
          <Route path="/bookings/new/:serviceId" element={<BookingPage />} />
          <Route path="/bookings/summary" element={<BookingSummary />} />
          <Route path="/bookings/payment" element={<PaymentPage />} />
          <Route path="/bookings/success" element={<BookingSuccess />} />
          <Route path="/bookings/failed" element={<BookingFailed />} />
          <Route path="/my-bookings" element={<MyBookings />} />
          <Route path="/profile" element={<Profile />} />
        </Route>

        <Route element={<RoleProtectedRoute allowedRoles={[ROLES.ADMIN]} />}>
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/services" element={<ServicesList />} />
          <Route path="/admin/services/new" element={<ServiceCreate />} />
          <Route path="/admin/services/:id" element={<ServiceView />} />
          <Route path="/admin/services/:id/edit" element={<ServiceEdit />} />
          <Route path="/admin/users" element={<AdminUsers />} />
          <Route path="/admin/bookings" element={<AdminBookings />} />
        </Route>
      </Route>

      {/* error routes */}
      <Route path="/404" element={<NotFound />} />
      <Route path="/unauthorized" element={<Unauthorized />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
