import { Icon } from './DashboardIcons.jsx';
import { NotificationBell } from './NotificationBell.jsx';

export const DashboardHeader = ({
  keyword,
  onKeywordChange,
  onProfileClick,
}) => (
  <header className="hidden h-[72px] items-center justify-between border-b border-slate-200 bg-white px-8 lg:flex">
    <div className="text-2xl font-bold text-teal-800">Doanh Thu 360</div>

    <div className="flex items-center gap-5">
      <label className="flex h-11 w-[300px] items-center gap-3 bg-slate-100 px-4 text-slate-500">
        <Icon name="search" className="h-5 w-5" />
        <input
          type="search"
          value={keyword}
          onChange={(event) => onKeywordChange(event.target.value)}
          placeholder="Tìm kiếm giao dịch..."
          className="min-w-0 flex-1 border-0 bg-transparent text-sm text-slate-700 outline-none placeholder:text-slate-500"
        />
      </label>

      <NotificationBell triggerClassName="relative grid h-10 w-10 place-items-center text-slate-600 transition hover:bg-slate-100 hover:text-teal-800" />

      <button
        type="button"
        onClick={onProfileClick}
        className="grid h-10 w-10 place-items-center text-slate-600 transition hover:bg-slate-100 hover:text-teal-800"
        aria-label="Profile"
        title="Profile"
      >
        <Icon name="user" className="h-5 w-5" />
      </button>
    </div>
  </header>
);
