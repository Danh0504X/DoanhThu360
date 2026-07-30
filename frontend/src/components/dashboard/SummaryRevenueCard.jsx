import { Card } from '../ui/Card.jsx';
import { Skeleton } from '../ui/Skeleton.jsx';
import { formatCurrency } from '../../utils/formatCurrency.js';

export const SummaryRevenueCard = ({
  totalRevenue = 0,
  periodLabel = '',
  previousPeriodLabel = 'kỳ trước',
  revenueTrend = { hasBaseline: false, isUp: false, percent: 0 },
  isTrendLoading = false,
  chartData = [],
  isLoading,
  error,
}) => {
  const hasChartData = chartData.some((item) => Number(item.revenue || 0) > 0);
  const maxRevenue = Math.max(...chartData.map((item) => Number(item.revenue || 0)), 0);
  const visibleBars = chartData.slice(-7);

  return (
    <Card padding="lg">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.08em] text-bone-500">
            Tổng doanh thu{periodLabel ? ` ${periodLabel}` : ''}
          </p>
          {isLoading ? (
            <Skeleton className="mt-6 h-12 w-72" />
          ) : error ? (
            <p className="mt-6 text-sm font-semibold text-accent-red">{error}</p>
          ) : (
            <div className="mt-5 flex flex-wrap items-end gap-3">
              <strong className="font-serif text-5xl font-semibold leading-none tracking-tight text-primary-800">
                {formatCurrency(totalRevenue).replace(' VND', '')}
              </strong>
              <span className="pb-1 text-2xl font-normal text-bone-500">VNĐ</span>
            </div>
          )}

          {!isLoading && !error && !isTrendLoading ? (
            revenueTrend.hasBaseline ? (
              <p className={`mt-3 text-sm font-semibold ${revenueTrend.isUp ? 'text-primary-700' : 'text-accent-red'}`}>
                {revenueTrend.isUp ? '↗' : '↘'} {revenueTrend.isUp ? '+' : ''}{revenueTrend.percent.toFixed(1)}% so với {previousPeriodLabel}
              </p>
            ) : (
              <p className="mt-3 text-sm font-medium text-bone-500">Chưa có dữ liệu {previousPeriodLabel}</p>
            )
          ) : null}
        </div>

        {isTrendLoading ? (
          <Skeleton className="h-8 w-20" />
        ) : revenueTrend.hasBaseline ? (
          <span
            className={`rounded-sm px-3 py-2 text-xs font-bold ${
              revenueTrend.isUp ? 'bg-primary-50 text-primary-800' : 'bg-accent-red-bg text-accent-red'
            }`}
            title={`So với ${previousPeriodLabel}`}
          >
            {revenueTrend.isUp ? '▲' : '▼'} {revenueTrend.isUp ? '+' : ''}{revenueTrend.percent.toFixed(1)}%
          </span>
        ) : (
          <span className="rounded-sm bg-bone-100 px-3 py-2 text-xs font-bold text-bone-500">--</span>
        )}
      </div>

      <div className="mt-12 h-44 border-b border-bone-200">
        {isLoading ? (
          <div className="flex h-full items-end gap-6">
            {[36, 58, 42, 74, 52, 86, 100].map((height) => (
              <Skeleton key={height} className="flex-1" style={{ height: `${height}%` }} />
            ))}
          </div>
        ) : hasChartData ? (
          <div className="flex h-full items-end gap-6">
            {visibleBars.map((item, index) => {
              const height = maxRevenue > 0 ? Math.max((Number(item.revenue || 0) / maxRevenue) * 100, 12) : 0;
              const isStrong = index === visibleBars.length - 1 || Number(item.revenue || 0) === maxRevenue;

              return (
                <div
                  key={`${item.label}-${index}`}
                  className={`flex-1 rounded-t-sm ${isStrong ? 'bg-primary-800' : 'bg-primary-100'}`}
                  style={{ height: `${height}%` }}
                  title={`${item.label}: ${formatCurrency(item.revenue)}`}
                />
              );
            })}
          </div>
        ) : (
          <div className="flex h-full items-center justify-center rounded-sm bg-bone-50 text-sm font-medium text-bone-500">
            Chưa có dữ liệu biểu đồ
          </div>
        )}
      </div>
    </Card>
  );
};
