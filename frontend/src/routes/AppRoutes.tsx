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
import { ROUTES } from "@/constants/routes";

export default function AppRoutes() {
  return (
    <Routes>
      {/* Public pages – no layout */}
      <Route path={ROUTES.LOGIN} element={<Login />} />
      <Route path={ROUTES.ADMIN_LOGIN} element={<AdminLogin />} />
      <Route path={ROUTES.REGISTER} element={<Register />} />
      <Route path={ROUTES.VERIFY_OTP} element={<VerifyEmail />} />
      <Route path={ROUTES.FORGOT_PASSWORD} element={<ForgotPassword />} />
      <Route path={ROUTES.RESET_PASSWORD} element={<ResetPassword />} />

      {/* Protected pages with layout */}
      <Route element={<MainLayout />}>
        <Route path={ROUTES.HOME} element={<Home />} />
        <Route path={ROUTES.SERVICES} element={<ServiceList />} />
        <Route path={ROUTES.SERVICE_DETAIL} element={<ServiceDetail />} />
        <Route element={<RoleProtectedRoute allowedRoles={[ROLES.USER]} />}>
          <Route path={ROUTES.USER.BOOKING_NEW} element={<BookingPage />} />
          <Route
            path={ROUTES.USER.BOOKING_SUMMARY}
            element={<BookingSummary />}
          />
          <Route path={ROUTES.USER.BOOKING_PAYMENT} element={<PaymentPage />} />
          <Route
            path={ROUTES.USER.BOOKING_SUCCESS}
            element={<BookingSuccess />}
          />
          <Route
            path={ROUTES.USER.BOOKING_FAILED}
            element={<BookingFailed />}
          />
          <Route path={ROUTES.USER.MY_BOOKINGS} element={<MyBookings />} />
          <Route path={ROUTES.USER.PROFILE} element={<Profile />} />
        </Route>

        <Route element={<RoleProtectedRoute allowedRoles={[ROLES.ADMIN]} />}>
          <Route path={ROUTES.ADMIN.DASHBOARD} element={<AdminDashboard />} />
          <Route path={ROUTES.ADMIN.SERVICES} element={<ServicesList />} />
          <Route
            path={ROUTES.ADMIN.SERVICE_CREATE}
            element={<ServiceCreate />}
          />
          <Route path={ROUTES.ADMIN.SERVICE_VIEW} element={<ServiceView />} />
          <Route path={ROUTES.ADMIN.SERVICE_EDIT} element={<ServiceEdit />} />
          <Route path={ROUTES.ADMIN.USERS} element={<AdminUsers />} />
          <Route path={ROUTES.ADMIN.BOOKINGS} element={<AdminBookings />} />
        </Route>
      </Route>

      {/* error routes */}
      <Route path={ROUTES.NOT_FOUND} element={<NotFound />} />
      <Route path={ROUTES.UNAUTHORIZED} element={<Unauthorized />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
