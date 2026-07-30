import { useMemo, useState } from 'react';
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { ChartTooltip } from '../../components/charts/ChartTooltip.jsx';
import { chartAxisProps, chartCartesianGridProps } from '../../components/charts/chartTheme.js';
import { Card } from '../../components/ui/Card.jsx';
import { Skeleton } from '../../components/ui/Skeleton.jsx';
import { DashboardLayout } from '../../components/dashboard/DashboardLayout.jsx';
import { Icon } from '../../components/dashboard/DashboardIcons.jsx';
import { MobileTopHeader } from '../../components/dashboard/MobileTopHeader.jsx';
import { periodOptions } from '../../constants/period.js';
import { useDashboardShell } from '../../hooks/useDashboardShell.js';
import { useDashboardStats, useRevenueChart } from '../../hooks/useDashboard.js';
import { formatCompact } from '../../utils/formatCompact.js';
import { formatCurrency } from '../../utils/formatCurrency.js';

const PRIMARY_STRONG = '#256267';
const PRIMARY_SOFT = '#b3dbd9';

const StatCard = ({ label, value, icon, isLoading, accent = 'text-primary-700' }) => (
  <Card>
    <div className="flex items-center gap-2 text-bone-500">
      <Icon name={icon} className="h-4 w-4" />
      <span className="text-xs font-bold uppercase tracking-wide">{label}</span>
    </div>
    {isLoading ? (
      <Skeleton className="mt-3 h-7 w-24" />
    ) : (
      <p className={`mt-3 text-xl font-bold ${accent}`}>{value}</p>
    )}
  </Card>
);

export const AnalyticsPage = () => {
  const { navigate, handleNavigate, handleUnsupportedAction } = useDashboardShell();
  const [selectedPeriod, setSelectedPeriod] = useState('month');

  const params = useMemo(() => ({ period: selectedPeriod }), [selectedPeriod]);
  const statsQuery = useDashboardStats(params);
  const chartQuery = useRevenueChart(params);

  const stats = statsQuery.data || { totalCash: 0, totalBank: 0, totalRevenue: 0, count: 0 };
  const chartData = chartQuery.data || [];
  const isLoading = statsQuery.isLoading || chartQuery.isLoading;
  const hasChartData = chartData.some((item) => Number(item.revenue || 0) > 0);

  const compositionData = useMemo(
    () => [
      { name: 'Tiền mặt', value: Math.max(Number(stats.totalCash || 0), 0) },
      { name: 'Tài khoản', value: Math.max(Number(stats.totalBank || 0), 0) },
    ],
    [stats.totalCash, stats.totalBank],
  );
  const compositionColors = [PRIMARY_STRONG, PRIMARY_SOFT];
  const hasComposition = compositionData.some((item) => item.value > 0);

  const renderPeriodToggle = (className = '') => (
    <div className={`grid grid-cols-3 rounded-sm border border-bone-200 bg-white p-1 ${className}`}>
      {periodOptions.map((period) => (
        <button
          key={period.id}
          type="button"
          onClick={() => setSelectedPeriod(period.id)}
          className={`rounded-sm px-4 py-2.5 text-sm font-bold transition-brand ${
            selectedPeriod === period.id ? 'bg-white text-primary-800 shadow-1' : 'text-bone-500 hover:text-primary-800'
          }`}
        >
          {period.label}
        </button>
      ))}
    </div>
  );

  const renderContent = () => (
    <>
      {chartQuery.error ? (
        <div className="rounded-md border border-red-200 bg-accent-red-bg px-4 py-3 text-sm text-red-700">
          {chartQuery.error.message}
        </div>
      ) : null}

      <div className="grid grid-cols-2 gap-3 xl:grid-cols-4">
        <StatCard label="Tổng doanh thu" value={formatCurrency(stats.totalRevenue)} icon="wallet" isLoading={isLoading} />
        <StatCard label="Tiền mặt" value={formatCurrency(stats.totalCash)} icon="cash" isLoading={isLoading} />
        <StatCard label="Tài khoản" value={formatCurrency(stats.totalBank)} icon="bank" isLoading={isLoading} />
        <StatCard label="Số giao dịch" value={stats.count ?? 0} icon="history" isLoading={isLoading} accent="text-bone-800" />
      </div>

      <Card className="mt-4">
        <h2 className="text-base font-bold text-bone-800">Doanh thu theo thời gian</h2>
        <div className="mt-4 h-64 w-full">
          {isLoading ? (
            <Skeleton className="h-full w-full" />
          ) : hasChartData ? (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 8, right: 8, left: -12, bottom: 0 }}>
                <defs>
                  <linearGradient id="revFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={PRIMARY_STRONG} stopOpacity={0.35} />
                    <stop offset="100%" stopColor={PRIMARY_STRONG} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid {...chartCartesianGridProps} />
                <XAxis dataKey="label" {...chartAxisProps} />
                <YAxis tickFormatter={formatCompact} {...chartAxisProps} width={48} />
                <Tooltip content={<ChartTooltip />} />
                <Area type="monotone" dataKey="revenue" name="Doanh thu" stroke={PRIMARY_STRONG} strokeWidth={2.5} fill="url(#revFill)" />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex h-full items-center justify-center rounded-sm bg-bone-50 text-sm font-medium text-bone-500">
              Chưa có dữ liệu biểu đồ
            </div>
          )}
        </div>
      </Card>

      <div className="mt-4 grid gap-4 xl:grid-cols-2">
        <Card>
          <h2 className="text-base font-bold text-bone-800">Tiền mặt và tài khoản</h2>
          <div className="mt-4 h-64 w-full">
            {isLoading ? (
              <Skeleton className="h-full w-full" />
            ) : hasChartData ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 8, right: 8, left: -12, bottom: 0 }}>
                  <CartesianGrid {...chartCartesianGridProps} />
                  <XAxis dataKey="label" {...chartAxisProps} />
                  <YAxis tickFormatter={formatCompact} {...chartAxisProps} width={48} />
                  <Tooltip content={<ChartTooltip />} cursor={{ fill: '#f3f1ed' }} />
                  <Legend wrapperStyle={{ fontSize: 12 }} />
                  <Bar dataKey="cash" name="Tiền mặt" fill={PRIMARY_STRONG} radius={[4, 4, 0, 0]} />
                  <Bar dataKey="bank" name="Tài khoản" fill={PRIMARY_SOFT} radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex h-full items-center justify-center rounded-sm bg-bone-50 text-sm font-medium text-bone-500">
                Chưa có dữ liệu biểu đồ
              </div>
            )}
          </div>
        </Card>

        <Card>
          <h2 className="text-base font-bold text-bone-800">Tỷ trọng dòng tiền</h2>
          <div className="mt-4 h-64 w-full">
            {isLoading ? (
              <Skeleton className="h-full w-full" />
            ) : hasComposition ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={compositionData} dataKey="value" nameKey="name" innerRadius={56} outerRadius={92} paddingAngle={2}>
                    {compositionData.map((entry, index) => (
                      <Cell key={entry.name} fill={compositionColors[index % compositionColors.length]} />
                    ))}
                  </Pie>
                  <Tooltip content={<ChartTooltip />} />
                  <Legend wrapperStyle={{ fontSize: 12 }} />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex h-full items-center justify-center rounded-sm bg-bone-50 text-sm font-medium text-bone-500">
                Chưa có dữ liệu biểu đồ
              </div>
            )}
          </div>
        </Card>
      </div>
    </>
  );

  return (
    <>
      {/* Mobile layout */}
      <div className="min-h-screen bg-bone-50 pb-24 lg:hidden">
        <MobileTopHeader title="Thống kê" />

        <main className="px-4 pt-4">
          <h1 className="font-serif text-xl font-semibold tracking-tight text-bone-800">Phân tích doanh thu</h1>
          <p className="mt-1 text-sm text-bone-500">Trực quan hóa dòng tiền theo thời gian.</p>
          {renderPeriodToggle('mt-4')}
          <div className="mt-4">{renderContent()}</div>
        </main>
      </div>

      {/* Desktop layout */}
      <DashboardLayout
        activeNav="analytics"
        onNavigate={handleNavigate}
        onExport={handleUnsupportedAction}
        onProfileClick={() => navigate('/account')}
        onUnsupportedAction={handleUnsupportedAction}
        desktopOnly
      >
        <div className="mx-auto max-w-[1180px]">
          <div className="mb-7 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="font-serif text-4xl font-semibold tracking-tight text-bone-800">Phân tích doanh thu</h1>
              <p className="mt-2 text-sm font-medium text-bone-500">
                Trực quan hóa dòng tiền và cơ cấu doanh thu theo thời gian.
              </p>
            </div>
            {renderPeriodToggle()}
          </div>

          {renderContent()}
        </div>
      </DashboardLayout>
    </>
  );
};
