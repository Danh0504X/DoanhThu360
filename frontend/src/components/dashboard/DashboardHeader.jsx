import { useNavigate } from 'react-router-dom';
import { Icon } from './DashboardIcons.jsx';
import { NotificationBell } from './NotificationBell.jsx';
import { useAuth } from '../../hooks/useAuth.js';

export const DashboardHeader = ({
  keyword,
  onKeywordChange,
  onProfileClick,
}) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin';

  return (
  <header className="hidden h-[72px] items-center justify-between border-b border-bone-200 bg-white px-8 lg:flex">
    <div className="text-2xl font-bold text-primary-800">Doanh Thu 360</div>

    <div className="flex items-center gap-5">
      <label className="flex h-11 w-[300px] items-center gap-3 rounded-sm bg-bone-100 px-4 text-bone-500">
        <Icon name="search" className="h-5 w-5" />
        <input
          type="search"
          value={keyword}
          onChange={(event) => onKeywordChange(event.target.value)}
          placeholder="Tìm kiếm giao dịch..."
          className="min-w-0 flex-1 border-0 bg-transparent text-sm text-bone-700 outline-none placeholder:text-bone-500"
        />
      </label>

      <NotificationBell triggerClassName="relative grid h-10 w-10 place-items-center rounded-sm text-bone-600 transition-brand hover:bg-bone-100 hover:text-primary-800" />

      {isAdmin ? (
        <button
          type="button"
          onClick={() => navigate('/admin')}
          className="grid h-10 w-10 place-items-center rounded-sm text-bone-600 transition-brand hover:bg-bone-100 hover:text-primary-800"
          aria-label="Quản trị hệ thống"
          title="Quản trị hệ thống"
        >
          <Icon name="shield" className="h-5 w-5" />
        </button>
      ) : null}

      <button
        type="button"
        onClick={onProfileClick}
        className="grid h-10 w-10 place-items-center rounded-sm text-bone-600 transition-brand hover:bg-bone-100 hover:text-primary-800"
        aria-label="Profile"
        title="Profile"
      >
        <Icon name="user" className="h-5 w-5" />
      </button>
    </div>
  </header>
  );
};
