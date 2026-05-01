import { NavLink } from 'react-router-dom';

const mobileItems = [
  { id: 'overview', label: 'Trang chủ', to: '/dashboard', icon: '⌂' },
  { id: 'revenue', label: 'Doanh thu', to: '/revenues', icon: '◫' },
  { id: 'reports', label: 'Báo cáo', icon: '▥' },
  { id: 'profile', label: 'Cá nhân', icon: '◌' },
];

export const MobileBottomNav = ({ activeItem = 'overview' }) => (
  <nav className="fixed inset-x-0 bottom-0 z-20 border-t border-slate-200 bg-white/95 px-2 py-2 backdrop-blur lg:hidden">
    <div className="mx-auto grid max-w-md grid-cols-4 gap-1">
      {mobileItems.map((item) => {
        const isActive = activeItem === item.id;
        const className = `rounded-2xl px-2 py-2 text-center text-xs font-medium ${
          isActive ? 'bg-teal-50 text-teal-800' : 'text-slate-500'
        }`;

        if (item.to) {
          return (
            <NavLink key={item.id} to={item.to} className={className}>
              <span className="mb-1 block text-base">{item.icon}</span>
              {item.label}
            </NavLink>
          );
        }

        return (
          <button key={item.id} type="button" className={className}>
            <span className="mb-1 block text-base">{item.icon}</span>
            {item.label}
          </button>
        );
      })}
    </div>
  </nav>
);
