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
    <section className="border border-slate-200 bg-white p-7">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.08em] text-slate-500">
            Tổng doanh thu{periodLabel ? ` ${periodLabel}` : ''}
          </p>
          {isLoading ? (
            <div className="mt-6 h-12 w-72 animate-pulse bg-slate-100" />
          ) : error ? (
            <p className="mt-6 text-sm font-semibold text-red-600">{error}</p>
          ) : (
            <div className="mt-5 flex flex-wrap items-end gap-3">
              <strong className="text-5xl font-bold leading-none tracking-normal text-teal-800">
                {formatCurrency(totalRevenue).replace(' VND', '')}
              </strong>
              <span className="pb-1 text-2xl font-normal text-slate-400">VNĐ</span>
            </div>
          )}

          {!isLoading && !error && !isTrendLoading ? (
            revenueTrend.hasBaseline ? (
              <p className={`mt-3 text-sm font-semibold ${revenueTrend.isUp ? 'text-teal-700' : 'text-red-600'}`}>
                {revenueTrend.isUp ? '↗' : '↘'} {revenueTrend.isUp ? '+' : ''}{revenueTrend.percent.toFixed(1)}% so với {previousPeriodLabel}
              </p>
            ) : (
              <p className="mt-3 text-sm font-medium text-slate-400">Chưa có dữ liệu {previousPeriodLabel}</p>
            )
          ) : null}
        </div>

        {isTrendLoading ? (
          <span className="h-8 w-20 animate-pulse rounded bg-slate-100" />
        ) : revenueTrend.hasBaseline ? (
          <span
            className={`px-3 py-2 text-xs font-bold ${
              revenueTrend.isUp ? 'bg-teal-50 text-teal-800' : 'bg-red-50 text-red-600'
            }`}
            title={`So với ${previousPeriodLabel}`}
          >
            {revenueTrend.isUp ? '▲' : '▼'} {revenueTrend.isUp ? '+' : ''}{revenueTrend.percent.toFixed(1)}%
          </span>
        ) : (
          <span className="bg-slate-100 px-3 py-2 text-xs font-bold text-slate-400">--</span>
        )}
      </div>

      <div className="mt-12 h-44 border-b border-slate-200">
        {isLoading ? (
          <div className="flex h-full items-end gap-6">
            {[36, 58, 42, 74, 52, 86, 100].map((height) => (
              <div key={height} className="flex-1 animate-pulse bg-slate-100" style={{ height: `${height}%` }} />
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
                  className={`flex-1 ${isStrong ? 'bg-teal-800' : 'bg-teal-100'}`}
                  style={{ height: `${height}%` }}
                  title={`${item.label}: ${formatCurrency(item.revenue)}`}
                />
              );
            })}
          </div>
        ) : (
          <div className="flex h-full items-center justify-center bg-slate-50 text-sm font-medium text-slate-500">
            Chưa có dữ liệu biểu đồ
          </div>
        )}
      </div>
    </section>
  );
};
