import { Navigate, Route, Routes } from 'react-router-dom';
import { LoginPage } from '../pages/auth/LoginPage.jsx';
import { RegisterPage } from '../pages/auth/RegisterPage.jsx';
import { ForgotPasswordPage } from '../pages/auth/ForgotPasswordPage.jsx';
import { ResetPasswordPage } from '../pages/auth/ResetPasswordPage.jsx';
import { AccountSettingsPage } from '../pages/account/AccountSettingsPage.jsx';
import { ChangePasswordPage } from '../pages/account/ChangePasswordPage.jsx';
import { VerifyEmailPage } from '../pages/account/VerifyEmailPage.jsx';
import { AnalyticsPage } from '../pages/analytics/AnalyticsPage.jsx';
import { BusinessCreatePage } from '../pages/businesses/BusinessCreatePage.jsx';
import { BusinessEditPage } from '../pages/businesses/BusinessEditPage.jsx';
import { BusinessListPage } from '../pages/businesses/BusinessListPage.jsx';
import { DashboardPage } from '../pages/dashboard/DashboardPage.jsx';
import { RevenueCreatePage } from '../pages/revenues/RevenueCreatePage.jsx';
import { RevenueEditPage } from '../pages/revenues/RevenueEditPage.jsx';
import { RevenueListPage } from '../pages/revenues/RevenueListPage.jsx';
import { ProtectedRoute } from './ProtectedRoute.jsx';
import { PublicRoute } from './PublicRoute.jsx';
import { NotFoundPage } from './NotFoundPage.jsx';

export const AppRoutes = () => (
  <Routes>
    <Route
      path="/login"
      element={(
        <PublicRoute>
          <LoginPage />
        </PublicRoute>
      )}
    />
    <Route
      path="/register"
      element={(
        <PublicRoute>
          <RegisterPage />
        </PublicRoute>
      )}
    />
    <Route
      path="/forgot-password"
      element={(
        <PublicRoute>
          <ForgotPasswordPage />
        </PublicRoute>
      )}
    />
    <Route
      path="/reset-password"
      element={(
        <PublicRoute>
          <ResetPasswordPage />
        </PublicRoute>
      )}
    />

    <Route element={<ProtectedRoute />}>
      <Route path="/dashboard" element={<DashboardPage />} />
      <Route path="/businesses" element={<BusinessListPage />} />
      <Route path="/businesses/create" element={<BusinessCreatePage />} />
      <Route path="/businesses/:id/edit" element={<BusinessEditPage />} />
      <Route path="/revenues" element={<RevenueListPage />} />
      <Route path="/revenues/create" element={<RevenueCreatePage />} />
      <Route path="/revenues/:id/edit" element={<RevenueEditPage />} />
      <Route path="/account" element={<AccountSettingsPage />} />
      <Route path="/account/change-password" element={<ChangePasswordPage />} />
      <Route path="/account/verify-email" element={<VerifyEmailPage />} />
      <Route path="/analytics" element={<AnalyticsPage />} />
    </Route>

    <Route path="/" element={<Navigate to="/dashboard" replace />} />
    <Route path="*" element={<NotFoundPage />} />
  </Routes>
);
