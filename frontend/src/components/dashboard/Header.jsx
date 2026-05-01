import { getGreeting } from '../../utils/formatters.js';

export const Header = ({ userName, businessOptions, selectedBusiness, onBusinessChange, onLogout }) => (
  <>
    <div className="flex items-center justify-between rounded-[28px] border border-slate-200 bg-white px-4 py-4 shadow-sm lg:hidden">
      <div className="flex items-center gap-3">
        <div className="h-11 w-11 rounded-2xl bg-teal-100" />
        <div>
          <p className="font-semibold text-teal-800">Doanh Thu 360</p>
          <p className="text-xs text-slate-500">Tổng quan tài chính</p>
        </div>
      </div>
      <button type="button" className="rounded-2xl border border-slate-200 p-3 text-slate-500">
        ⌁
      </button>
    </div>

    <header className="rounded-[28px] border border-slate-200 bg-white px-5 py-5 shadow-sm">
      <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-teal-700">
            {getGreeting()}, {String(userName || 'Bạn').toUpperCase()}
          </p>
          <h1 className="mt-2 text-2xl font-semibold text-slate-800">Tổng quan tài chính</h1>
          <p className="mt-2 text-sm text-slate-500">
            Theo dõi doanh thu, dòng tiền và nhịp tăng trưởng theo ngày.
          </p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <select
            value={selectedBusiness}
            onChange={(event) => onBusinessChange(event.target.value)}
            className="h-12 rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm text-slate-700 outline-none focus:border-teal-500"
          >
            {businessOptions.map((option) => (
              <option key={option.id} value={option.id}>{option.name}</option>
            ))}
          </select>
          <div className="hidden items-center gap-3 rounded-2xl bg-slate-50 px-4 py-3 lg:flex">
            <div className="h-11 w-11 rounded-2xl bg-teal-100" />
            <div className="min-w-0">
              <p className="truncate text-sm font-medium text-slate-700">{userName || 'Người dùng'}</p>
              <p className="text-xs text-slate-500">Chủ tài khoản</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onLogout}
            className="hidden rounded-2xl border border-slate-200 px-4 py-3 text-sm font-medium text-slate-600 hover:bg-slate-50 lg:inline-flex"
          >
            Đăng xuất
          </button>
        </div>
      </div>
    </header>
  </>
);
