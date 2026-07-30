import { useMemo, useState } from 'react';
import { CashFlowCard } from '../../components/dashboard/CashFlowCard.jsx';
import { DashboardLayout } from '../../components/dashboard/DashboardLayout.jsx';
import { MobileDashboard } from '../../components/dashboard/MobileDashboard.jsx';
import { QuickStatsCard } from '../../components/dashboard/QuickStatsCard.jsx';
import { RecentActivitiesTable } from '../../components/dashboard/RecentActivitiesTable.jsx';
import { SummaryRevenueCard } from '../../components/dashboard/SummaryRevenueCard.jsx';
import { RevenueWordExportDialog } from '../../components/reports/RevenueWordExportDialog.jsx';
import { RevenueDeleteDialog } from '../../components/revenues/RevenueDeleteDialog.jsx';
import { RevenueDetailModal } from '../../components/revenues/RevenueDetailModal.jsx';
import { useToast } from '../../components/ui/useToast.js';
import { periodNouns, periodOptions, previousPeriodNouns } from '../../constants/period.js';
import { Reveal } from '../../components/ui/Reveal.jsx';
import { useAuth } from '../../hooks/useAuth.js';
import { useBusinesses } from '../../hooks/useBusinesses.js';
import { useDashboardShell } from '../../hooks/useDashboardShell.js';
import { useDeleteRevenue } from '../../hooks/useRevenues.js';
import {
  useDashboardStats,
  useRecentRevenues,
  useRevenueChart,
} from '../../hooks/useDashboard.js';
import { useExportRevenueWord } from '../../hooks/useExportRevenueWord.js';
import { downloadBlob } from '../../utils/downloadBlob.js';
import { getVietnamPreviousPeriodRange } from '../../utils/timezone.js';

// Compute the revenue trend vs the previous period.
// `hasBaseline` is false when there's no previous data to compare against.
const getRevenueTrend = (current, previous) => {
  const cur = Number(current || 0);
  const prev = Number(previous || 0);

  if (prev <= 0) {
    return { hasBaseline: false, isUp: cur > 0, percent: 0 };
  }

  const percent = ((cur - prev) / prev) * 100;
  return { hasBaseline: true, isUp: percent >= 0, percent };
};

const buildCashTransactions = (rows = []) =>
  rows
    .filter((row) => Number(row.cashAmount || 0) !== 0)
    .map((row) => ({
      id: `${row.id}-cash`,
      content: row.content,
      amount: Number(row.cashAmount || 0),
    }));

const buildBankTransactions = (rows = []) =>
  rows
    .filter((row) => Number(row.bankAmount || 0) !== 0)
    .map((row) => ({
      id: `${row.id}-bank`,
      content: row.content,
      amount: Number(row.bankAmount || 0),
    }));

export const DashboardPage = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('month');
  const [keyword, setKeyword] = useState('');
  const [isExportDialogOpen, setIsExportDialogOpen] = useState(false);
  const [detailRevenue, setDetailRevenue] = useState(null);
  const [selectedRevenue, setSelectedRevenue] = useState(null);
  const [deleteErrorMessage, setDeleteErrorMessage] = useState('');
  const { user } = useAuth();
  const { navigate, handleNavigate, handleUnsupportedAction, unsupportedMessage } = useDashboardShell();
  const toast = useToast();
  const deleteRevenueMutation = useDeleteRevenue();

  const dashboardParams = useMemo(
    () => ({
      period: selectedPeriod,
      ...(keyword.trim() ? { keyword: keyword.trim() } : {}),
    }),
    [keyword, selectedPeriod],
  );

  // Same filters but pointed at the previous period, to compute the trend.
  const previousPeriodParams = useMemo(
    () => ({
      ...getVietnamPreviousPeriodRange(selectedPeriod),
      ...(keyword.trim() ? { keyword: keyword.trim() } : {}),
    }),
    [keyword, selectedPeriod],
  );

  const userName = user?.name || user?.fullName || user?.username || 'Người dùng';
  const businessesQuery = useBusinesses({ status: 'active' });
  const statsQuery = useDashboardStats(dashboardParams);
  const previousStatsQuery = useDashboardStats(previousPeriodParams);
  const chartQuery = useRevenueChart(dashboardParams);
  const recentRevenuesQuery = useRecentRevenues(dashboardParams);
  const exportRevenueWordMutation = useExportRevenueWord();

  const businesses = useMemo(() => businessesQuery.data?.rows || [], [businessesQuery.data]);
  const exportBusiness = businesses[0] || null;
  const stats = statsQuery.data || {
    totalCash: 0,
    totalBank: 0,
    totalRevenue: 0,
    count: 0,
  };
  const recentRows = useMemo(
    () => recentRevenuesQuery.data?.rows || [],
    [recentRevenuesQuery.data],
  );
  const isLoading = statsQuery.isLoading || chartQuery.isLoading || recentRevenuesQuery.isLoading;
  const errorMessage =
    statsQuery.error?.message || chartQuery.error?.message || recentRevenuesQuery.error?.message || '';

  const cashTransactions = useMemo(() => buildCashTransactions(recentRows), [recentRows]);
  const bankTransactions = useMemo(() => buildBankTransactions(recentRows), [recentRows]);

  const revenueTrend = useMemo(
    () => getRevenueTrend(stats.totalRevenue, previousStatsQuery.data?.totalRevenue),
    [stats.totalRevenue, previousStatsQuery.data],
  );
  const isTrendLoading = statsQuery.isLoading || previousStatsQuery.isLoading;

  const handleDeleteConfirm = async () => {
    if (!selectedRevenue) return;

    try {
      setDeleteErrorMessage('');
      await deleteRevenueMutation.mutateAsync(selectedRevenue.id || selectedRevenue._id);
      toast.success('Xóa doanh thu thành công.');
      setSelectedRevenue(null);
    } catch (error) {
      setDeleteErrorMessage(error.message || 'Không thể xóa bản ghi doanh thu.');
    }
  };

  const handleDeleteFromDetail = (row) => {
    setDetailRevenue(null);
    setDeleteErrorMessage('');
    setSelectedRevenue(row);
  };

  const handleOpenExportDialog = () => {
    if (!exportBusiness?._id) {
      toast.info(unsupportedMessage);
      return;
    }

    setIsExportDialogOpen(true);
  };

  const handleExportRevenueWord = async ({ periodType, value }) => {
    if (!exportBusiness?._id) {
      toast.info(unsupportedMessage);
      return;
    }

    try {
      const result = await exportRevenueWordMutation.mutateAsync({
        businessId: exportBusiness._id,
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

  return (
    <>
      <MobileDashboard
        userName={userName}
        selectedPeriod={selectedPeriod}
        periodLabel={periodNouns[selectedPeriod]}
        previousPeriodLabel={previousPeriodNouns[selectedPeriod]}
        revenueTrend={revenueTrend}
        isTrendLoading={isTrendLoading}
        periodOptions={periodOptions}
        onPeriodChange={setSelectedPeriod}
        totalRevenue={stats.totalRevenue}
        totalCash={stats.totalCash}
        totalBank={stats.totalBank}
        recentRows={recentRows}
        isLoading={isLoading}
        onExportWord={handleOpenExportDialog}
        onViewAll={() => navigate('/revenues')}
        onAddTransaction={() => navigate('/revenues/create')}
        onRowClick={(row) => setDetailRevenue(row)}
        onUnsupportedAction={handleUnsupportedAction}
      />

      <DashboardLayout
        activeNav="dashboard"
        keyword={keyword}
        onKeywordChange={setKeyword}
        onNavigate={handleNavigate}
        onExport={handleOpenExportDialog}
        onProfileClick={() => navigate('/account')}
        onUnsupportedAction={handleUnsupportedAction}
        desktopOnly
      >
        <div className="mx-auto max-w-[1180px]">
          <div className="mb-7 flex items-center justify-between gap-6">
            <h1 className="font-serif text-4xl font-semibold tracking-tight text-bone-950">Tổng quan doanh thu</h1>

            <div className="grid grid-cols-3 border border-bone-200 bg-white p-1">
              {periodOptions.map((period) => (
                <button
                  key={period.id}
                  type="button"
                  onClick={() => setSelectedPeriod(period.id)}
                  className={`min-w-20 px-4 py-3 text-sm font-bold transition-brand ${
                    selectedPeriod === period.id
                      ? 'border border-bone-200 bg-white text-primary-800 shadow-sm'
                      : 'text-bone-600 hover:text-primary-800'
                  }`}
                >
                  {period.label}
                </button>
              ))}
            </div>
          </div>

          <Reveal className="grid gap-6 xl:grid-cols-[1.75fr_0.85fr]">
            <SummaryRevenueCard
              totalRevenue={stats.totalRevenue}
              periodLabel={periodNouns[selectedPeriod]}
              previousPeriodLabel={previousPeriodNouns[selectedPeriod]}
              revenueTrend={revenueTrend}
              isTrendLoading={isTrendLoading}
              chartData={chartQuery.data || []}
              isLoading={statsQuery.isLoading || chartQuery.isLoading}
              error={errorMessage}
            />
            <QuickStatsCard orderCount={stats.count} isLoading={statsQuery.isLoading} />
          </Reveal>

          <Reveal delay={80} className="mt-7">
            <section>
              <h2 className="font-serif mb-5 text-3xl font-semibold tracking-tight text-bone-950">Chi tiết dòng tiền</h2>
              <div className="grid gap-6 xl:grid-cols-2">
                <CashFlowCard
                  title="Tiền mặt"
                  icon="cash"
                  balance={stats.totalCash}
                  transactions={cashTransactions}
                  isLoading={isLoading}
                />
                <CashFlowCard
                  title="Tiền gửi tài khoản"
                  icon="bank"
                  balance={stats.totalBank}
                  transactions={bankTransactions}
                  isLoading={isLoading}
                />
              </div>
            </section>
          </Reveal>

          <Reveal delay={160} className="mt-7">
            <RecentActivitiesTable
              rows={recentRows}
              isLoading={recentRevenuesQuery.isLoading}
              onViewAll={() => navigate('/revenues')}
              onRowClick={(row) => setDetailRevenue(row)}
            />
          </Reveal>
        </div>
      </DashboardLayout>

      <RevenueDetailModal
        revenue={detailRevenue}
        isOpen={Boolean(detailRevenue)}
        onClose={() => setDetailRevenue(null)}
        onEdit={(row) => navigate(`/revenues/${row.id || row._id}/edit`)}
        onDelete={handleDeleteFromDetail}
      />

      <RevenueDeleteDialog
        isOpen={Boolean(selectedRevenue)}
        onClose={() => {
          setSelectedRevenue(null);
          setDeleteErrorMessage('');
        }}
        onConfirm={handleDeleteConfirm}
        isDeleting={deleteRevenueMutation.isPending}
        errorMessage={deleteErrorMessage}
      />

      <RevenueWordExportDialog
        isOpen={isExportDialogOpen}
        businessName={exportBusiness?.businessName}
        isSubmitting={exportRevenueWordMutation.isPending}
        onClose={() => setIsExportDialogOpen(false)}
        onSubmit={handleExportRevenueWord}
      />
    </>
  );
};
