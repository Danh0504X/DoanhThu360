import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { DashboardLayout } from '../../components/dashboard/DashboardLayout.jsx';
import { PaymentSplitCard } from '../../components/dashboard/PaymentSplitCard.jsx';
import { RecentRevenueTable } from '../../components/dashboard/RecentRevenueTable.jsx';
import { RevenueChart } from '../../components/dashboard/RevenueChart.jsx';
import { RevenueWordExportDialog } from '../../components/reports/RevenueWordExportDialog.jsx';
import { StatCard } from '../../components/dashboard/StatCard.jsx';
import { Button } from '../../components/ui/Button.jsx';
import { FormError } from '../../components/ui/FormError.jsx';
import { useToast } from '../../components/ui/useToast.js';
import { useAuth } from '../../hooks/useAuth.js';
import { useBusinesses } from '../../hooks/useBusinesses.js';
import {
  useDashboardStats,
  useRecentRevenues,
  useRevenueChart,
} from '../../hooks/useDashboard.js';
import { useExportRevenueWord } from '../../hooks/useExportRevenueWord.js';
import { downloadBlob } from '../../utils/downloadBlob.js';

const periodOptions = [
  { id: 'day', label: 'Ngày' },
  { id: 'month', label: 'Tháng' },
  { id: 'year', label: 'Năm' },
];

const titlesByPeriod = {
  day: 'Tổng doanh thu hôm nay',
  month: 'Tổng doanh thu tháng này',
  year: 'Tổng doanh thu năm nay',
};

export const DashboardPage = () => {
  const [selectedBusiness, setSelectedBusiness] = useState('all');
  const [selectedPeriod, setSelectedPeriod] = useState(periodOptions[0].id);
  const [isExportDialogOpen, setIsExportDialogOpen] = useState(false);
  const { user, logout } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();

  const dashboardParams = useMemo(
    () => ({
      period: selectedPeriod,
      ...(selectedBusiness !== 'all' ? { businessId: selectedBusiness } : {}),
    }),
    [selectedBusiness, selectedPeriod],
  );

  const userName = useMemo(() => user?.name || user?.username || 'Minh', [user]);

  const businessesQuery = useBusinesses({ status: 'active' });
  const statsQuery = useDashboardStats(dashboardParams);
  const chartQuery = useRevenueChart(dashboardParams);
  const recentRevenuesQuery = useRecentRevenues(dashboardParams);
  const exportRevenueWordMutation = useExportRevenueWord();

  const businessOptions = useMemo(() => {
    const businesses = businessesQuery.data?.rows || [];

    return [
      { id: 'all', name: 'Tất cả hộ kinh doanh' },
      ...businesses.map((business) => ({
        id: business._id,
        name: business.businessName,
      })),
    ];
  }, [businessesQuery.data]);

  const featuredStat = useMemo(() => {
    const summary = statsQuery.data || {
      totalRevenue: 0,
      totalCash: 0,
      totalBank: 0,
      count: 0,
    };

    return {
      title: titlesByPeriod[selectedPeriod],
      value: summary.totalRevenue,
      change: `${summary.count} bản ghi doanh thu`,
      badgeLabel: periodOptions.find((item) => item.id === selectedPeriod)?.label || 'Ngày',
    };
  }, [selectedPeriod, statsQuery.data]);

  const paymentSplitData = useMemo(() => {
    const summary = statsQuery.data || {
      totalCash: 0,
      totalBank: 0,
    };

    return [
      { name: 'Tiền mặt', value: summary.totalCash, color: '#0f766e' },
      { name: 'Chuyển khoản', value: summary.totalBank, color: '#99f6e4' },
    ];
  }, [statsQuery.data]);

  const hasAnyDashboardData = Boolean(
    statsQuery.data?.count || chartQuery.data?.length || recentRevenuesQuery.data?.rows?.length,
  );

  const handleLogout = async () => {
    await logout();
    navigate('/login', { replace: true });
  };

  const selectedBusinessItem = businessOptions.find((item) => item.id === selectedBusiness);

  const handleOpenExportDialog = () => {
    if (selectedBusiness === 'all') {
      toast.error('Vui lòng chọn một hộ kinh doanh để xuất Word');
      return;
    }

    setIsExportDialogOpen(true);
  };

  const handleExportRevenueWord = async ({ periodType, value }) => {
    try {
      const result = await exportRevenueWordMutation.mutateAsync({
        businessId: selectedBusiness,
        periodType,
        value,
      });

      downloadBlob(result.blob, result.fileName);
      toast.success('Xuất Word thành công');
      setIsExportDialogOpen(false);
    } catch (error) {
      toast.error(error.message || 'Không thể xuất file Word');
      if (error.status === 401) {
        navigate('/login', { replace: true });
      }
    }
  };

  const isLoading = statsQuery.isLoading || chartQuery.isLoading || recentRevenuesQuery.isLoading;
  const errorMessage =
    statsQuery.error?.message || chartQuery.error?.message || recentRevenuesQuery.error?.message;

  return (
    <DashboardLayout
      userName={userName}
      businessOptions={businessOptions}
      selectedBusiness={selectedBusiness}
      onBusinessChange={setSelectedBusiness}
      onLogout={handleLogout}
      activeNav="overview"
    >
      <section className="space-y-4">
        <div className="rounded-[28px] border border-slate-200 bg-white p-4 shadow-sm">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="grid grid-cols-3 gap-2 rounded-2xl bg-slate-100 p-1 sm:inline-grid sm:min-w-80">
              {periodOptions.map((period) => (
                <button
                  key={period.id}
                  type="button"
                  onClick={() => setSelectedPeriod(period.id)}
                  className={`rounded-xl px-3 py-3 text-sm font-medium transition-colors ${
                    selectedPeriod === period.id
                      ? 'bg-teal-700 text-white'
                      : 'text-slate-600 hover:bg-white hover:text-slate-800'
                  }`}
                >
                  {period.label}
                </button>
              ))}
            </div>

            <Button type="button" variant="secondary" size="sm" onClick={handleOpenExportDialog}>
              Xuất Word
            </Button>
          </div>
        </div>

        {isLoading ? (
          <div className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm">
            <div className="animate-pulse space-y-4">
              <div className="h-4 w-40 rounded bg-slate-200" />
              <div className="h-10 w-56 rounded bg-slate-200" />
              <div className="h-10 w-44 rounded-full bg-slate-200" />
            </div>
          </div>
        ) : errorMessage ? (
          <FormError message={errorMessage} />
        ) : (
          <StatCard {...featuredStat} featured />
        )}
      </section>

      {!isLoading && !errorMessage && !hasAnyDashboardData ? (
        <section className="rounded-[28px] border border-slate-200 bg-white px-6 py-12 text-center shadow-sm">
          <h2 className="text-lg font-semibold text-slate-800">Chưa có dữ liệu doanh thu</h2>
          <p className="mt-2 text-sm text-slate-500">
            Khi có bản ghi doanh thu trong hệ thống, dashboard sẽ hiển thị tổng quan tại đây.
          </p>
        </section>
      ) : (
        <>
          <section className="grid gap-4 xl:grid-cols-[1.6fr_1fr]">
            <RevenueChart
              data={chartQuery.data || []}
              periodLabel={periodOptions.find((item) => item.id === selectedPeriod)?.label || 'Ngày'}
            />
            <PaymentSplitCard data={paymentSplitData} />
          </section>

          <RecentRevenueTable rows={recentRevenuesQuery.data?.rows || []} />
        </>
      )}

      <RevenueWordExportDialog
        isOpen={isExportDialogOpen}
        businessName={selectedBusinessItem?.name}
        isSubmitting={exportRevenueWordMutation.isPending}
        onClose={() => setIsExportDialogOpen(false)}
        onSubmit={handleExportRevenueWord}
      />
    </DashboardLayout>
  );
};
