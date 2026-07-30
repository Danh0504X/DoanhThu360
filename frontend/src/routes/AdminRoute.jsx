import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth.js';

const FullPageLoader = () => (
  <div className="flex min-h-screen items-center justify-center bg-bone-50">
    <div className="rounded-md border border-bone-200 bg-white px-6 py-4 text-sm text-bone-600 shadow-1">
      Đang tải phiên đăng nhập...
    </div>
  </div>
);

// Standalone guard (not nested under ProtectedRoute) — the admin area has
// its own shell entirely and must not pick up the regular user's MobileBottomNav.
export const AdminRoute = () => {
  const { isAuthenticated, isLoading, user } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return <FullPageLoader />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  if (user?.role !== 'admin') {
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
};
