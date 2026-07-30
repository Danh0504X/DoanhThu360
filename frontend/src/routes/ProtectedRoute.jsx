import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth.js';
import { MobileBottomNav } from '../components/dashboard/MobileBottomNav.jsx';

const FullPageLoader = () => (
  <div className="flex min-h-screen items-center justify-center bg-bone-50">
    <div className="rounded-md border border-bone-200 bg-white px-6 py-4 text-sm text-bone-600 shadow-1">
      Đang tải phiên đăng nhập...
    </div>
  </div>
);

export const ProtectedRoute = () => {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return <FullPageLoader />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return (
    <>
      <Outlet />
      <MobileBottomNav />
    </>
  );
};
