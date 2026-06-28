import { Icon } from './DashboardIcons.jsx';
import { formatCurrency } from '../../utils/formatCurrency.js';
import { formatDate } from '../../utils/formatDate.js';
import { MobileTopHeader } from './MobileTopHeader.jsx';

const formatCompact = (value) => {
  const amount = Number(value || 0);

  if (amount >= 1000000000) return `${new Intl.NumberFormat('vi-VN', { maximumFractionDigits: 1 }).format(amount / 1000000000)}t`;
  if (amount >= 1000000) return `${new Intl.NumberFormat('vi-VN', { maximumFractionDigits: 1 }).format(amount / 1000000)}tr`;
  if (amount >= 1000) return `${new Intl.NumberFormat('vi-VN', { maximumFractionDigits: 1 }).format(amount / 1000)}k`;
  return new Intl.NumberFormat('vi-VN').format(amount);
};

export const MobileDashboard = ({
  userName,
  selectedPeriod,
  periodLabel = 'hôm nay',
  previousPeriodLabel = 'kỳ trước',
  revenueTrend = { hasBaseline: false, isUp: false, percent: 0 },
  isTrendLoading = false,
  periodOptions,
  onPeriodChange,
  totalRevenue,
  totalCash,
  totalBank,
  recentRows,
  isLoading,
  onExportWord,
  onViewAll,
  onAddTransaction,
  onRowClick,
}) => {
  return (
    <div className="min-h-screen bg-slate-50 pb-28 lg:hidden">
    <MobileTopHeader title="Trang chủ" />

    <main className="px-4 pt-4">
    <div>
      <p className="text-sm font-medium text-slate-500">Xin chào,</p>
      <h1 className="text-2xl font-bold text-teal-800">{userName}</h1>
    </div>

    <div className="mt-6 grid grid-cols-3 border border-slate-200 bg-white p-1">
      {periodOptions.map((period) => (
        <button
          key={period.id}
          type="button"
          onClick={() => onPeriodChange(period.id)}
          className={`py-3 text-sm font-bold transition ${
            selectedPeriod === period.id ? 'bg-white text-teal-800 shadow-sm' : 'text-slate-600 hover:text-teal-800'
          }`}
        >
          {period.label}
        </button>
      ))}
    </div>

    <section className="mt-6 border border-slate-200 bg-white p-5">
      <div className="flex items-start justify-between gap-4">
        <p className="text-xs font-bold uppercase tracking-[0.08em] text-slate-500">Tổng doanh thu {periodLabel}</p>
        <button
          type="button"
          onClick={onExportWord}
          className="flex shrink-0 items-center gap-2 border border-slate-200 px-3 py-2 text-xs font-bold text-slate-700"
        >
          <Icon name="download" className="h-4 w-4" />
          Xuất Word
        </button>
      </div>

      {isLoading ? (
        <div className="mt-5 h-11 w-52 animate-pulse bg-slate-100" />
      ) : (
        <p className="mt-4 text-5xl font-bold leading-none tracking-normal text-teal-800">
          {formatCurrency(totalRevenue).replace(' VND', ' đ')}
        </p>
      )}
      {isTrendLoading ? (
        <div className="mt-6 h-5 w-40 animate-pulse rounded bg-slate-100" />
      ) : revenueTrend.hasBaseline ? (
        <p className={`mt-6 text-sm font-semibold ${revenueTrend.isUp ? 'text-teal-700' : 'text-red-600'}`}>
          {revenueTrend.isUp ? '↗' : '↘'} {revenueTrend.isUp ? '+' : ''}{revenueTrend.percent.toFixed(1)}% so với {previousPeriodLabel}
        </p>
      ) : (
        <p className="mt-6 text-sm font-medium text-slate-400">Chưa có dữ liệu {previousPeriodLabel}</p>
      )}
    </section>

    <section className="mt-5 grid grid-cols-2 gap-4">
      <div className="border border-slate-200 bg-white p-5">
        <div className="flex items-center gap-2 text-slate-600">
          <Icon name="cash" className="h-5 w-5 text-teal-800" />
          <span className="text-sm font-semibold">Tiền mặt</span>
        </div>
        <p className="mt-4 text-2xl font-bold text-teal-800">{formatCompact(totalCash)}</p>
      </div>
      <div className="border border-slate-200 bg-white p-5">
        <div className="flex items-center gap-2 text-slate-600">
          <Icon name="bank" className="h-5 w-5 text-teal-800" />
          <span className="text-sm font-semibold">Tài khoản</span>
        </div>
        <p className="mt-4 text-2xl font-bold text-teal-800">{formatCompact(totalBank)}</p>
      </div>
    </section>

    <section className="mt-6">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-bold text-slate-950">Giao dịch gần đây</h2>
        <button type="button" onClick={onViewAll} className="text-sm font-bold text-teal-800">
          Xem tất cả
        </button>
      </div>

      {isLoading ? (
        <div className="space-y-3">
          <div className="h-16 animate-pulse bg-white" />
          <div className="h-16 animate-pulse bg-white" />
        </div>
      ) : recentRows.length ? (
        <div className="divide-y divide-slate-100 border border-slate-200 bg-white">
          {recentRows.slice(0, 5).map((row) => (
            <button
              key={row.id}
              type="button"
              onClick={() => onRowClick?.(row)}
              className="flex w-full items-center justify-between gap-4 p-4 text-left transition active:bg-slate-50"
            >
              <div className="flex min-w-0 items-center gap-3">
                <span className="grid h-10 w-10 shrink-0 place-items-center bg-slate-100 text-teal-800">
                  <Icon name={Number(row.cashAmount || 0) > 0 ? 'cash' : 'card'} className="h-5 w-5" />
                </span>
                <div className="min-w-0">
                  <p className="truncate text-sm font-bold text-slate-950">{row.content || 'Không có mô tả'}</p>
                  <p className="mt-1 text-xs font-medium text-slate-500">
                    {formatDate(row.date)} · Tổng cộng
                  </p>
                </div>
              </div>
              <span className="shrink-0 text-lg font-bold text-teal-800">
                +{formatCompact(row.totalAmount)}
              </span>
            </button>
          ))}
        </div>
      ) : (
        <div className="border border-slate-200 bg-white px-5 py-10 text-center text-sm font-medium text-slate-500">
          Chưa có dữ liệu
        </div>
      )}
    </section>

    </main>

    <button
      type="button"
      onClick={onAddTransaction}
      className="fixed bottom-24 right-5 z-30 grid h-14 w-14 place-items-center rounded-full bg-teal-700 text-white shadow-xl shadow-teal-900/25 transition hover:bg-teal-800 active:scale-95"
      aria-label="Thêm giao dịch"
    >
      <Icon name="plus" className="h-7 w-7" />
    </button>
  </div>
  );
};
