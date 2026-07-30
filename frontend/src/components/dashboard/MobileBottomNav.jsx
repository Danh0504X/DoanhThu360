import { useLocation, useNavigate } from 'react-router-dom';
import { Icon } from './DashboardIcons.jsx';

const TABS = [
  { id: 'dashboard', label: 'Trang chủ', icon: 'home', to: '/dashboard' },
  { id: 'revenues', label: 'Doanh thu', icon: 'cash', to: '/revenues' },
  { id: 'businesses', label: 'Hộ KD', icon: 'briefcase', to: '/businesses' },
  { id: 'analytics', label: 'Thống kê', icon: 'analytics', to: '/analytics' },
  { id: 'account', label: 'Cá nhân', icon: 'user', to: '/account' },
];

// Routes that own a focused, full-screen flow (forms with their own bottom action
// bar). We hide the global nav there so it never collides with a fixed submit button.
const isFocusedRoute = (pathname) => /\/(create|edit)(\/|$)/.test(pathname) || pathname.endsWith('/create') || pathname.endsWith('/edit');

const resolveActive = (pathname) => {
  if (pathname.startsWith('/dashboard')) return 'dashboard';
  if (pathname.startsWith('/revenues')) return 'revenues';
  if (pathname.startsWith('/businesses')) return 'businesses';
  if (pathname.startsWith('/analytics')) return 'analytics';
  if (pathname.startsWith('/account')) return 'account';
  return '';
};

/**
 * Persistent bottom navigation shown on every authenticated page on mobile.
 * Rendered once globally (see ProtectedRoute) so navigation is consistent across
 * the app instead of each page reinventing its own mobile chrome.
 */
export const MobileBottomNav = () => {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  if (isFocusedRoute(pathname)) return null;

  const active = resolveActive(pathname);

  return (
    <nav className="fixed inset-x-0 bottom-0 z-30 grid grid-cols-5 border-t border-bone-200 bg-white px-1 pb-[env(safe-area-inset-bottom)] shadow-1 lg:hidden">
      {TABS.map((tab) => {
        const isActive = active === tab.id;

        return (
          <button
            key={tab.id}
            type="button"
            onClick={() => navigate(tab.to)}
            aria-current={isActive ? 'page' : undefined}
            className={`relative flex flex-col items-center gap-1 py-2.5 text-[11px] font-semibold transition-brand ${
              isActive ? 'text-primary-700' : 'text-bone-500 active:text-primary-700'
            }`}
          >
            <span
              className={`absolute top-0 h-0.5 w-8 rounded-full bg-primary-600 transition-brand ${
                isActive ? 'opacity-100' : 'opacity-0'
              }`}
            />
            <Icon name={tab.icon} className={`h-5 w-5 transition-brand ${isActive ? '-translate-y-0.5' : ''}`} />
            <span>{tab.label}</span>
          </button>
        );
      })}
    </nav>
  );
};
