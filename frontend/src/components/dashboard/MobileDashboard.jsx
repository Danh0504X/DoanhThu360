import { Icon } from './DashboardIcons.jsx';
import { Card } from '../ui/Card.jsx';
import { Skeleton } from '../ui/Skeleton.jsx';
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
    <div className="min-h-screen bg-bone-50 pb-28 lg:hidden">
      <MobileTopHeader title="Trang chủ" />

      <main className="space-y-5 px-4 pt-5">
        <div>
          <p className="text-sm font-medium text-bone-500">Xin chào,</p>
          <h1 className="text-2xl font-bold text-primary-800">{userName}</h1>
        </div>

        <div className="grid grid-cols-3 rounded-sm border border-bone-200 bg-white p-1">
          {periodOptions.map((period) => (
            <button
              key={period.id}
              type="button"
              onClick={() => onPeriodChange(period.id)}
              className={`rounded-sm py-3 text-sm font-bold transition-brand ${
                selectedPeriod === period.id ? 'bg-white text-primary-800 shadow-1' : 'text-bone-600 hover:text-primary-800'
              }`}
            >
              {period.label}
            </button>
          ))}
        </div>

        <Card padding="lg">
          <div className="flex items-start justify-between gap-4">
            <p className="text-xs font-bold uppercase tracking-[0.08em] text-bone-500">Tổng doanh thu {periodLabel}</p>
            <button
              type="button"
              onClick={onExportWord}
              className="flex shrink-0 items-center gap-2 rounded-sm border border-bone-200 px-3 py-2 text-xs font-bold text-bone-700 transition-brand active:scale-[0.97]"
            >
              <Icon name="download" className="h-4 w-4" />
              Xuất Word
            </button>
          </div>

          {isLoading ? (
            <Skeleton className="mt-5 h-11 w-52" />
          ) : (
            <p className="mt-4 font-serif text-5xl font-semibold leading-none tracking-tight text-primary-800">
              {formatCurrency(totalRevenue).replace(' VND', ' đ')}
            </p>
          )}
          {isTrendLoading ? (
            <Skeleton className="mt-6 h-5 w-40" />
          ) : revenueTrend.hasBaseline ? (
            <p className={`mt-6 text-sm font-semibold ${revenueTrend.isUp ? 'text-primary-700' : 'text-accent-red'}`}>
              {revenueTrend.isUp ? '↗' : '↘'} {revenueTrend.isUp ? '+' : ''}{revenueTrend.percent.toFixed(1)}% so với {previousPeriodLabel}
            </p>
          ) : (
            <p className="mt-6 text-sm font-medium text-bone-500">Chưa có dữ liệu {previousPeriodLabel}</p>
          )}
        </Card>

        <section className="grid grid-cols-2 gap-4">
          <Card>
            <div className="flex items-center gap-2 text-bone-600">
              <Icon name="cash" className="h-5 w-5 text-primary-800" />
              <span className="text-sm font-semibold">Tiền mặt</span>
            </div>
            <p className="mt-4 text-2xl font-bold text-primary-800">{formatCompact(totalCash)}</p>
          </Card>
          <Card>
            <div className="flex items-center gap-2 text-bone-600">
              <Icon name="bank" className="h-5 w-5 text-primary-800" />
              <span className="text-sm font-semibold">Tài khoản</span>
            </div>
            <p className="mt-4 text-2xl font-bold text-primary-800">{formatCompact(totalBank)}</p>
          </Card>
        </section>

        <section>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-bold text-bone-800">Giao dịch gần đây</h2>
            <button type="button" onClick={onViewAll} className="text-sm font-bold text-primary-800 transition-brand hover:text-primary-700">
              Xem tất cả
            </button>
          </div>

          {isLoading ? (
            <div className="space-y-3">
              <Skeleton className="h-16" />
              <Skeleton className="h-16" />
            </div>
          ) : recentRows.length ? (
            <Card padding="none" className="divide-y divide-bone-100">
              {recentRows.slice(0, 5).map((row) => (
                <button
                  key={row.id}
                  type="button"
                  onClick={() => onRowClick?.(row)}
                  className="flex w-full items-center justify-between gap-4 p-4 text-left transition-brand active:bg-bone-50"
                >
                  <div className="flex min-w-0 items-center gap-3">
                    <span className="grid h-10 w-10 shrink-0 place-items-center rounded-sm bg-primary-50 text-primary-800">
                      <Icon name={Number(row.cashAmount || 0) > 0 ? 'cash' : 'card'} className="h-5 w-5" />
                    </span>
                    <div className="min-w-0">
                      <p className="truncate text-sm font-bold text-bone-800">{row.content || 'Không có mô tả'}</p>
                      <p className="mt-1 text-xs font-medium text-bone-500">
                        {formatDate(row.date)} · Tổng cộng
                      </p>
                    </div>
                  </div>
                  <span className="shrink-0 text-lg font-bold text-primary-800">
                    +{formatCompact(row.totalAmount)}
                  </span>
                </button>
              ))}
            </Card>
          ) : (
            <Card className="px-5 py-10 text-center text-sm font-medium text-bone-500">
              Chưa có dữ liệu
            </Card>
          )}
        </section>
      </main>

      <button
        type="button"
        onClick={onAddTransaction}
        className="fixed bottom-24 right-5 z-30 grid h-14 w-14 place-items-center rounded-full bg-primary-700 text-white shadow-2 transition-brand hover:scale-[1.04] hover:bg-primary-800 active:scale-[0.95]"
        aria-label="Thêm giao dịch"
      >
        <Icon name="plus" className="h-7 w-7" />
      </button>
    </div>
  );
};
