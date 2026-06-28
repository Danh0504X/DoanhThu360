import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
import { DashboardLayout } from '../../components/dashboard/DashboardLayout.jsx';
import { Icon } from '../../components/dashboard/DashboardIcons.jsx';
import { MobileTopHeader } from '../../components/dashboard/MobileTopHeader.jsx';
import { useToast } from '../../components/ui/useToast.js';
import { useDashboardStats, useRevenueChart } from '../../hooks/useDashboard.js';
import { formatCurrency } from '../../utils/formatCurrency.js';

const periodOptions = [
  { id: 'day', label: 'Ngày' },
  { id: 'month', label: 'Tháng' },
  { id: 'year', label: 'Năm' },
];

const formatCompact = (value) => {
  const amount = Number(value || 0);
  if (Math.abs(amount) >= 1_000_000_000) return `${(amount / 1_000_000_000).toFixed(1)}tỷ`;
  if (Math.abs(amount) >= 1_000_000) return `${(amount / 1_000_000).toFixed(1)}tr`;
  if (Math.abs(amount) >= 1_000) return `${Math.round(amount / 1_000)}k`;
  return new Intl.NumberFormat('vi-VN').format(amount);
};

const ChartTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;

  return (
    <div className="rounded-xl border border-slate-200 bg-white px-3 py-2 shadow-lg">
      <p className="mb-1 text-xs font-bold text-slate-700">{label}</p>
      {payload.map((entry) => (
        <p key={entry.dataKey} className="text-xs font-medium" style={{ color: entry.color }}>
          {entry.name}: {formatCurrency(entry.value)}
        </p>
      ))}
    </div>
  );
};

const StatCard = ({ label, value, icon, isLoading, accent = 'text-teal-700' }) => (
  <div className="rounded-2xl border border-slate-200 bg-white p-4">
    <div className="flex items-center gap-2 text-slate-500">
      <Icon name={icon} className="h-4 w-4" />
      <span className="text-xs font-bold uppercase tracking-wide">{label}</span>
    </div>
    {isLoading ? (
      <div className="mt-3 h-7 w-24 animate-pulse rounded bg-slate-100" />
    ) : (
      <p className={`mt-3 text-xl font-bold ${accent}`}>{value}</p>
    )}
  </div>
);

export const AnalyticsPage = () => {
  const navigate = useNavigate();
  const toast = useToast();
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
  const compositionColors = ['#0f766e', '#5eead4'];
  const hasComposition = compositionData.some((item) => item.value > 0);

  const handleUnsupportedAction = () => toast.info('Chức năng này chưa được backend hỗ trợ.');

  const handleNavigate = (item) => {
    if (item.id === 'dashboard') return navigate('/dashboard');
    if (item.id === 'cash-flow') return navigate('/revenues');
    if (item.to) return navigate(item.to);
    return handleUnsupportedAction();
  };

  const renderPeriodToggle = (className = '') => (
    <div className={`grid grid-cols-3 border border-slate-200 bg-white p-1 ${className}`}>
      {periodOptions.map((period) => (
        <button
          key={period.id}
          type="button"
          onClick={() => setSelectedPeriod(period.id)}
          className={`px-4 py-2.5 text-sm font-bold transition ${
            selectedPeriod === period.id ? 'bg-white text-teal-800 shadow-sm' : 'text-slate-500 hover:text-teal-800'
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
        <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {chartQuery.error.message}
        </div>
      ) : null}

      <div className="grid grid-cols-2 gap-3 xl:grid-cols-4">
        <StatCard label="Tổng doanh thu" value={formatCurrency(stats.totalRevenue)} icon="wallet" isLoading={isLoading} />
        <StatCard label="Tiền mặt" value={formatCurrency(stats.totalCash)} icon="cash" isLoading={isLoading} />
        <StatCard label="Tài khoản" value={formatCurrency(stats.totalBank)} icon="bank" isLoading={isLoading} />
        <StatCard label="Số giao dịch" value={stats.count ?? 0} icon="history" isLoading={isLoading} accent="text-slate-800" />
      </div>

      <section className="mt-4 rounded-2xl border border-slate-200 bg-white p-5">
        <h2 className="text-base font-bold text-slate-900">Doanh thu theo thời gian</h2>
        <div className="mt-4 h-64 w-full">
          {isLoading ? (
            <div className="h-full w-full animate-pulse rounded-xl bg-slate-100" />
          ) : hasChartData ? (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 8, right: 8, left: -12, bottom: 0 }}>
                <defs>
                  <linearGradient id="revFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#0f766e" stopOpacity={0.35} />
                    <stop offset="100%" stopColor="#0f766e" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                <XAxis dataKey="label" tick={{ fontSize: 11, fill: '#94a3b8' }} tickLine={false} axisLine={false} />
                <YAxis tickFormatter={formatCompact} tick={{ fontSize: 11, fill: '#94a3b8' }} tickLine={false} axisLine={false} width={48} />
                <Tooltip content={<ChartTooltip />} />
                <Area type="monotone" dataKey="revenue" name="Doanh thu" stroke="#0f766e" strokeWidth={2.5} fill="url(#revFill)" />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex h-full items-center justify-center rounded-xl bg-slate-50 text-sm font-medium text-slate-500">
              Chưa có dữ liệu biểu đồ
            </div>
          )}
        </div>
      </section>

      <div className="mt-4 grid gap-4 xl:grid-cols-2">
        <section className="rounded-2xl border border-slate-200 bg-white p-5">
          <h2 className="text-base font-bold text-slate-900">Tiền mặt và tài khoản</h2>
          <div className="mt-4 h-64 w-full">
            {isLoading ? (
              <div className="h-full w-full animate-pulse rounded-xl bg-slate-100" />
            ) : hasChartData ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 8, right: 8, left: -12, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                  <XAxis dataKey="label" tick={{ fontSize: 11, fill: '#94a3b8' }} tickLine={false} axisLine={false} />
                  <YAxis tickFormatter={formatCompact} tick={{ fontSize: 11, fill: '#94a3b8' }} tickLine={false} axisLine={false} width={48} />
                  <Tooltip content={<ChartTooltip />} cursor={{ fill: '#f1f5f9' }} />
                  <Legend wrapperStyle={{ fontSize: 12 }} />
                  <Bar dataKey="cash" name="Tiền mặt" fill="#0f766e" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="bank" name="Tài khoản" fill="#5eead4" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex h-full items-center justify-center rounded-xl bg-slate-50 text-sm font-medium text-slate-500">
                Chưa có dữ liệu biểu đồ
              </div>
            )}
          </div>
        </section>

        <section className="rounded-2xl border border-slate-200 bg-white p-5">
          <h2 className="text-base font-bold text-slate-900">Tỷ trọng dòng tiền</h2>
          <div className="mt-4 h-64 w-full">
            {isLoading ? (
              <div className="h-full w-full animate-pulse rounded-xl bg-slate-100" />
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
              <div className="flex h-full items-center justify-center rounded-xl bg-slate-50 text-sm font-medium text-slate-500">
                Chưa có dữ liệu biểu đồ
              </div>
            )}
          </div>
        </section>
      </div>
    </>
  );

  return (
    <>
      {/* Mobile layout */}
      <div className="min-h-screen bg-slate-50 pb-24 lg:hidden">
        <MobileTopHeader title="Thống kê" />

        <main className="px-4 pt-4">
          <h1 className="text-xl font-bold text-slate-900">Phân tích doanh thu</h1>
          <p className="mt-1 text-sm text-slate-500">Trực quan hóa dòng tiền theo thời gian.</p>
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
              <h1 className="text-4xl font-bold tracking-normal text-slate-950">Phân tích doanh thu</h1>
              <p className="mt-2 text-sm font-medium text-slate-500">
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
