import { NavLink } from 'react-router-dom';

const navItems = [
  { id: 'overview', label: 'Tổng quan', to: '/dashboard' },
  { id: 'revenue', label: 'Doanh thu', to: '/revenues' },
  { id: 'business', label: 'Hộ kinh doanh', to: '/businesses' },
  { id: 'reports', label: 'Báo cáo' },
  { id: 'account', label: 'Tài khoản', to: '/account' },
];

export const Sidebar = ({ onLogout, activeItem = 'overview' }) => (
  <aside className="hidden w-72 shrink-0 rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm lg:flex lg:flex-col">
    <div className="flex items-center gap-3">
      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-teal-700 text-white">
        <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
          <path d="M4 9.5 12 5l8 4.5" />
          <path d="M6 10.5V19h12v-8.5" />
          <path d="M9 12h6" />
          <path d="M9 15h6" />
        </svg>
      </div>
      <div>
        <p className="text-lg font-semibold text-teal-800">Doanh Thu 360</p>
        <p className="text-sm text-slate-500">Quản lý doanh thu</p>
      </div>
    </div>

    <nav className="mt-8 space-y-2">
      {navItems.map((item) => {
        const isActive = activeItem === item.id;
        const className = `flex w-full items-center rounded-2xl px-4 py-3 text-left text-sm font-medium ${
          isActive
            ? 'bg-teal-50 text-teal-800'
            : 'text-slate-600 hover:bg-slate-50 hover:text-slate-800'
        }`;

        if (item.to) {
          return (
            <NavLink key={item.id} to={item.to} className={className}>
              {item.label}
            </NavLink>
          );
        }

        return (
          <button key={item.id} type="button" className={className}>
            {item.label}
          </button>
        );
      })}
    </nav>

    <div className="mt-auto rounded-3xl bg-slate-50 p-4">
      <p className="text-sm font-medium text-slate-700">Đăng xuất phiên hiện tại</p>
      <p className="mt-1 text-xs leading-5 text-slate-500">Kết thúc làm việc an toàn sau khi kiểm tra số liệu.</p>
      <button
        type="button"
        onClick={onLogout}
        className="mt-4 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-700 hover:bg-slate-100"
      >
        Đăng xuất
      </button>
    </div>
  </aside>
);
