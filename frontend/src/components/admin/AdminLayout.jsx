import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth.js';

const NAV_ITEMS = [
  { id: 'overview', label: 'Tổng quan', to: '/admin/overview' },
  { id: 'users', label: 'Người dùng', to: '/admin/users' },
  { id: 'settings', label: 'Cấu hình', to: '/admin/settings' },
];

const AdminBrand = () => (
  <div>
    <h1 className="text-xl font-bold tracking-normal text-primary-800">Quản trị hệ thống</h1>
    <p className="mt-0.5 text-xs font-medium text-bone-500">Doanh Thu 360 · Admin</p>
  </div>
);

export const AdminLayout = ({ activeNav, children }) => {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleExit = async () => {
    navigate('/dashboard');
  };

  const handleLogout = async () => {
    await logout();
    navigate('/login', { replace: true });
  };

  return (
    <div className="min-h-screen bg-bone-50">
      {/* Mobile top bar + tab strip */}
      <div className="sticky top-0 z-20 border-b border-bone-200 bg-white lg:hidden">
        <div className="flex h-14 items-center justify-between px-4">
          <AdminBrand />
          <button
            type="button"
            onClick={handleExit}
            className="rounded-sm px-2 py-1.5 text-xs font-bold text-bone-500 transition-brand hover:bg-bone-100"
          >
            Thoát
          </button>
        </div>
        <nav className="flex gap-1 px-3 pb-2">
          {NAV_ITEMS.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => navigate(item.to)}
              className={`flex-1 rounded-sm px-3 py-2 text-xs font-bold transition-brand ${
                activeNav === item.id
                  ? 'bg-primary-50 text-primary-800'
                  : 'text-bone-500 hover:bg-bone-50'
              }`}
            >
              {item.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Desktop sidebar */}
      <aside className="fixed inset-y-0 left-0 z-20 hidden w-[260px] border-r border-bone-200 bg-white lg:flex lg:flex-col">
        <div className="border-b border-bone-200 px-6 py-6">
          <AdminBrand />
        </div>

        <nav className="flex-1 px-4 py-6">
          <div className="space-y-1">
            {NAV_ITEMS.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => navigate(item.to)}
                className={`flex w-full items-center rounded-md px-4 py-3 text-left text-sm font-semibold transition-brand ${
                  activeNav === item.id
                    ? 'bg-primary-50 text-primary-800'
                    : 'text-bone-600 hover:bg-bone-50 hover:text-primary-800'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
        </nav>

        <div className="space-y-2 px-4 py-6">
          <button
            type="button"
            onClick={handleExit}
            className="flex w-full items-center justify-center rounded-md border border-bone-200 px-5 py-3 text-sm font-bold text-bone-600 transition-brand hover:bg-bone-50"
          >
            Về trang người dùng
          </button>
          <button
            type="button"
            onClick={handleLogout}
            className="flex w-full items-center justify-center rounded-md px-5 py-3 text-sm font-bold text-red-600 transition-brand hover:bg-red-50"
          >
            Đăng xuất
          </button>
        </div>
      </aside>

      <main className="px-4 py-6 lg:pl-[260px]">
        <div className="mx-auto max-w-[1100px] lg:px-8 lg:py-2">{children}</div>
      </main>
    </div>
  );
};
