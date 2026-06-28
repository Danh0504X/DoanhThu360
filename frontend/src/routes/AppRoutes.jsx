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

const NotFoundPage = () => <Navigate to="/login" replace />;

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
    <Route
      path="/dashboard"
      element={(
        <ProtectedRoute>
          <DashboardPage />
        </ProtectedRoute>
      )}
    />
    <Route
      path="/businesses"
      element={(
        <ProtectedRoute>
          <BusinessListPage />
        </ProtectedRoute>
      )}
    />
    <Route
      path="/businesses/create"
      element={(
        <ProtectedRoute>
          <BusinessCreatePage />
        </ProtectedRoute>
      )}
    />
    <Route
      path="/businesses/:id/edit"
      element={(
        <ProtectedRoute>
          <BusinessEditPage />
        </ProtectedRoute>
      )}
    />
    <Route
      path="/revenues"
      element={(
        <ProtectedRoute>
          <RevenueListPage />
        </ProtectedRoute>
      )}
    />
    <Route
      path="/revenues/create"
      element={(
        <ProtectedRoute>
          <RevenueCreatePage />
        </ProtectedRoute>
      )}
    />
    <Route
      path="/revenues/:id/edit"
      element={(
        <ProtectedRoute>
          <RevenueEditPage />
        </ProtectedRoute>
      )}
    />
    <Route
      path="/account"
      element={(
        <ProtectedRoute>
          <AccountSettingsPage />
        </ProtectedRoute>
      )}
    />
    <Route
      path="/account/change-password"
      element={(
        <ProtectedRoute>
          <ChangePasswordPage />
        </ProtectedRoute>
      )}
    />
    <Route
      path="/account/verify-email"
      element={(
        <ProtectedRoute>
          <VerifyEmailPage />
        </ProtectedRoute>
      )}
    />
    <Route
      path="/analytics"
      element={(
        <ProtectedRoute>
          <AnalyticsPage />
        </ProtectedRoute>
      )}
    />
    <Route path="/" element={<Navigate to="/dashboard" replace />} />
    <Route path="*" element={<NotFoundPage />} />
  </Routes> 
);
