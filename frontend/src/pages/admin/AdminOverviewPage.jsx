import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { AdminLayout } from '../../components/admin/AdminLayout.jsx';
import { ChartTooltip } from '../../components/charts/ChartTooltip.jsx';
import { chartAxisProps, chartCartesianGridProps } from '../../components/charts/chartTheme.js';
import { Card } from '../../components/ui/Card.jsx';
import { Skeleton } from '../../components/ui/Skeleton.jsx';
import { useAdminStats } from '../../hooks/useAdmin.js';
import { formatRelativeTime } from '../../utils/formatDate.js';

const PRIMARY_STRONG = '#256267';

const StatCard = ({ label, value, isLoading, tone = 'text-bone-800' }) => (
  <Card>
    <p className="text-xs font-bold uppercase tracking-wide text-bone-500">{label}</p>
    {isLoading ? (
      <Skeleton className="mt-3 h-8 w-16" />
    ) : (
      <p className={`mt-2 font-serif text-3xl font-semibold tracking-tight ${tone}`}>{value}</p>
    )}
  </Card>
);

const PersonRow = ({ name, subtitle, time }) => (
  <div className="flex items-center justify-between gap-3 py-2.5">
    <div className="min-w-0">
      <p className="truncate text-sm font-bold text-bone-800">{name}</p>
      <p className="truncate text-xs font-medium text-bone-500">{subtitle}</p>
    </div>
    <span className="shrink-0 text-xs font-medium text-bone-400">{time}</span>
  </div>
);

export const AdminOverviewPage = () => {
  const statsQuery = useAdminStats();
  const stats = statsQuery.data;
  const isLoading = statsQuery.isLoading;

  const trendData = (stats?.signupTrend || []).map((point) => ({
    ...point,
    label: point.date.slice(5), // MM-DD
  }));

  return (
    <AdminLayout activeNav="overview">
      <div className="space-y-6">
        <div>
          <h1 className="font-serif text-3xl font-semibold tracking-tight text-bone-950">Tổng quan</h1>
          <p className="mt-1 text-sm text-bone-500">Giám sát người dùng và hệ thống.</p>
        </div>

        <div className="grid grid-cols-2 gap-4 xl:grid-cols-4">
          <StatCard label="Tổng người dùng" value={stats?.totalUsers ?? 0} isLoading={isLoading} />
          <StatCard label="Đang hoạt động" value={stats?.activeUsers ?? 0} isLoading={isLoading} tone="text-emerald-600" />
          <StatCard label="Bị chặn" value={stats?.bannedUsers ?? 0} isLoading={isLoading} tone="text-accent-red" />
          <StatCard label="Đăng ký mới (30 ngày)" value={stats?.newRegistrations30d ?? 0} isLoading={isLoading} tone="text-primary-700" />
        </div>

        <Card>
          <h2 className="text-base font-bold text-bone-800">Đăng ký mới theo ngày (30 ngày gần nhất)</h2>
          <div className="mt-4 h-56 w-full">
            {isLoading ? (
              <Skeleton className="h-full w-full" />
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={trendData} margin={{ top: 8, right: 8, left: -12, bottom: 0 }}>
                  <defs>
                    <linearGradient id="signupFill" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor={PRIMARY_STRONG} stopOpacity={0.35} />
                      <stop offset="100%" stopColor={PRIMARY_STRONG} stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid {...chartCartesianGridProps} />
                  <XAxis dataKey="label" {...chartAxisProps} interval={4} />
                  <YAxis allowDecimals={false} {...chartAxisProps} width={32} />
                  <Tooltip content={<ChartTooltip />} />
                  <Area type="monotone" dataKey="count" name="Đăng ký mới" stroke={PRIMARY_STRONG} strokeWidth={2.5} fill="url(#signupFill)" />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </div>
        </Card>

        <div className="grid gap-4 xl:grid-cols-2">
          <Card>
            <h2 className="text-base font-bold text-bone-800">Đăng ký gần đây</h2>
            {isLoading ? (
              <div className="mt-3 space-y-3">
                <Skeleton className="h-10" />
                <Skeleton className="h-10" />
              </div>
            ) : stats?.recentSignups?.length ? (
              <div className="mt-1 divide-y divide-bone-100">
                {stats.recentSignups.map((item) => (
                  <PersonRow
                    key={item._id}
                    name={item.name || item.username || item.email || 'Người dùng'}
                    subtitle={item.email || item.username}
                    time={formatRelativeTime(item.createdAt)}
                  />
                ))}
              </div>
            ) : (
              <p className="mt-3 text-sm text-bone-500">Chưa có đăng ký nào.</p>
            )}
          </Card>

          <Card>
            <h2 className="text-base font-bold text-bone-800">Đăng nhập gần đây</h2>
            {isLoading ? (
              <div className="mt-3 space-y-3">
                <Skeleton className="h-10" />
                <Skeleton className="h-10" />
              </div>
            ) : stats?.recentLogins?.length ? (
              <div className="mt-1 divide-y divide-bone-100">
                {stats.recentLogins.map((item) => (
                  <PersonRow
                    key={item._id}
                    name={item.name || item.username || item.email || 'Người dùng'}
                    subtitle={item.email || item.username}
                    time={formatRelativeTime(item.lastLogin)}
                  />
                ))}
              </div>
            ) : (
              <p className="mt-3 text-sm text-bone-500">Chưa có lượt đăng nhập nào.</p>
            )}
          </Card>
        </div>

        <Card>
          <h2 className="text-base font-bold text-bone-800">Tổng quan hệ thống</h2>
          <div className="mt-4 grid grid-cols-2 gap-4">
            <div className="rounded-sm bg-bone-100 px-4 py-3">
              <p className="text-[10.5px] font-bold uppercase tracking-wide text-bone-500">Hộ kinh doanh</p>
              {isLoading ? (
                <Skeleton className="mt-2 h-6 w-12" />
              ) : (
                <p className="mt-1 text-xl font-bold text-bone-800">{stats?.system?.totalBusinesses ?? 0}</p>
              )}
            </div>
            <div className="rounded-sm bg-bone-100 px-4 py-3">
              <p className="text-[10.5px] font-bold uppercase tracking-wide text-bone-500">Bản ghi doanh thu</p>
              {isLoading ? (
                <Skeleton className="mt-2 h-6 w-12" />
              ) : (
                <p className="mt-1 text-xl font-bold text-bone-800">{stats?.system?.totalRevenueEntries ?? 0}</p>
              )}
            </div>
          </div>
        </Card>
      </div>
    </AdminLayout>
  );
};
