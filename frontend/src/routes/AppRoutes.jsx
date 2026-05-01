import { Navigate, Route, Routes } from 'react-router-dom';
import { LoginPage } from '../pages/auth/LoginPage.jsx';
import { RegisterPage } from '../pages/auth/RegisterPage.jsx';
import { ForgotPasswordPage } from '../pages/auth/ForgotPasswordPage.jsx';
import { ResetPasswordPage } from '../pages/auth/ResetPasswordPage.jsx';
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
    <Route path="/" element={<Navigate to="/dashboard" replace />} />
    <Route path="*" element={<NotFoundPage />} />
  </Routes> 
);
