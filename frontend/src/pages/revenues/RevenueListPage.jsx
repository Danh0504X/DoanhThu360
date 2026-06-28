import { useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { DashboardLayout } from '../../components/dashboard/DashboardLayout.jsx';
import { MobileTopHeader } from '../../components/dashboard/MobileTopHeader.jsx';
import { RevenueWordExportDialog } from '../../components/reports/RevenueWordExportDialog.jsx';
import { RevenueDeleteDialog } from '../../components/revenues/RevenueDeleteDialog.jsx';
import { RevenueDetailModal } from '../../components/revenues/RevenueDetailModal.jsx';
import { RevenueFilters } from '../../components/revenues/RevenueFilters.jsx';
import { RevenueTable } from '../../components/revenues/RevenueTable.jsx';
import { Button } from '../../components/ui/Button.jsx';
import { FormError } from '../../components/ui/FormError.jsx';
import { FormSuccess } from '../../components/ui/FormSuccess.jsx';
import { useToast } from '../../components/ui/useToast.js';
import { useAuth } from '../../hooks/useAuth.js';
import { useBusinesses } from '../../hooks/useBusinesses.js';
import { useExportRevenueWord } from '../../hooks/useExportRevenueWord.js';
import { useDeleteRevenue, useRevenues } from '../../hooks/useRevenues.js';
import { downloadBlob } from '../../utils/downloadBlob.js';
import { toDateInputValue } from '../../utils/formatDate.js';
import { getVietnamWeekStart } from '../../utils/timezone.js';
import { useDebouncedValue } from '../../hooks/useDebouncedValue.js';

// Quick date ranges: this week (Mon → today) and this month (1st → today), Vietnam time.
const getPeriodRanges = () => {
  const today = toDateInputValue(new Date());
  return {
    week: { fromDate: getVietnamWeekStart(), toDate: today },
    month: { fromDate: `${today.slice(0, 7)}-01`, toDate: today },
  };
};

const PERIOD_LABELS = { week: 'tuần này', month: 'tháng này' };

export const RevenueListPage = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const toast = useToast();
  const [successMessage, setSuccessMessage] = useState(location.state?.successMessage || '');
  const [deleteErrorMessage, setDeleteErrorMessage] = useState('');
  const [selectedRevenue, setSelectedRevenue] = useState(null);
  const [detailRevenue, setDetailRevenue] = useState(null);
  const [isExportDialogOpen, setIsExportDialogOpen] = useState(false);
  const periodRanges = useMemo(() => getPeriodRanges(), []);
  // businessId starts as null = "auto": default to the busiest business once loaded.
  const [filters, setFilters] = useState({
    keyword: '',
    ...periodRanges.month,
    businessId: null,
    page: 1,
    limit: 10,
  });

  // Active quick period (or null if a custom date range is in use).
  const activePeriod = useMemo(() => {
    const matches = (range) => filters.fromDate === range.fromDate && filters.toDate === range.toDate;
    if (matches(periodRanges.week)) return 'week';
    if (matches(periodRanges.month)) return 'month';
    return null;
  }, [filters.fromDate, filters.toDate, periodRanges]);

  const handleSelectPeriod = (period) => {
    setFilters((current) => ({ ...current, ...periodRanges[period], page: 1 }));
  };

  const businessesQuery = useBusinesses({ status: 'active' });

  // The business with the most records, used as the default filter selection.
  const defaultBusinessId = useMemo(() => {
    const businesses = businessesQuery.data?.rows || [];
    if (!businesses.length) return 'all';

    return businesses.reduce(
      (best, business) =>
        Number(business.revenueCount || 0) > Number(best.revenueCount || 0) ? business : best,
      businesses[0],
    )._id;
  }, [businessesQuery.data]);

  // Falls back to the busiest business until the user explicitly picks one.
  const effectiveBusinessId = filters.businessId ?? defaultBusinessId;

  const debouncedKeyword = useDebouncedValue(filters.keyword);
  const queryParams = useMemo(
    () => ({
      ...filters,
      businessId: effectiveBusinessId,
      keyword: debouncedKeyword,
    }),
    [filters, effectiveBusinessId, debouncedKeyword],
  );

  const revenuesQuery = useRevenues(queryParams);
  const deleteRevenueMutation = useDeleteRevenue();
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

  const filteredRows = useMemo(() => {
    const rows = revenuesQuery.data?.rows || [];

    if (!debouncedKeyword) {
      return rows;
    }

    const normalizedKeyword = debouncedKeyword.toLowerCase();

    return rows.filter((row) =>
      [row.content, row.note]
        .filter(Boolean)
        .some((value) => value.toLowerCase().includes(normalizedKeyword)),
    );
  }, [debouncedKeyword, revenuesQuery.data?.rows]);

  const handleLogout = async () => {
    await logout();
    navigate('/login', { replace: true });
  };

  const handleFilterChange = (field, value) => {
    setFilters((currentFilters) => ({
      ...currentFilters,
      [field]: value,
      page: field === 'page' ? value : 1,
    }));
  };

  const handleDeleteConfirm = async () => {
    if (!selectedRevenue) return;

    try {
      setDeleteErrorMessage('');
      await deleteRevenueMutation.mutateAsync(selectedRevenue.id || selectedRevenue._id);
      setSuccessMessage('Xóa doanh thu thành công.');
      setSelectedRevenue(null);
    } catch (error) {
      setDeleteErrorMessage(error.message || 'Không thể xóa bản ghi doanh thu.');
    }
  };

  const selectedBusinessItem = businessOptions.find((item) => item.id === effectiveBusinessId);

  const handleOpenExportDialog = () => {
    if (effectiveBusinessId === 'all') {
      toast.error('Vui lòng chọn một hộ kinh doanh để xuất Word');
      return;
    }

    setIsExportDialogOpen(true);
  };

  const handleExportRevenueWord = async ({ periodType, value }) => {
    try {
      const result = await exportRevenueWordMutation.mutateAsync({
        businessId: effectiveBusinessId,
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

  const errorMessage =
    businessesQuery.error?.message ||
    revenuesQuery.error?.message;

  const periodLabel = PERIOD_LABELS[activePeriod] || 'theo bộ lọc';
  const listTitle =
    effectiveBusinessId === 'all'
      ? `Tất cả lịch sử doanh thu ${periodLabel} của tất cả hộ kinh doanh`
      : `Lịch sử doanh thu ${periodLabel} của ${selectedBusinessItem?.name || 'hộ kinh doanh'}`;

  const renderContent = () => (
    <>
      <FormSuccess message={successMessage} />
      {errorMessage ? <FormError message={errorMessage} /> : null}

      <RevenueFilters
        filters={{ ...filters, businessId: effectiveBusinessId }}
        onChange={handleFilterChange}
        businessOptions={businessOptions}
        activePeriod={activePeriod}
        onPeriodSelect={handleSelectPeriod}
      />

      {revenuesQuery.isLoading ? (
        <section className="rounded-lg border border-slate-200 bg-white px-6 py-12 text-center text-sm text-slate-500 shadow-sm">
          Đang tải dữ liệu...
        </section>
      ) : filteredRows.length ? (
        <RevenueTable
          title={listTitle}
          rows={filteredRows}
          pagination={revenuesQuery.data?.pagination}
          page={filters.page}
          onPageChange={(page) => handleFilterChange('page', page)}
          onRowClick={(row) => setDetailRevenue(row)}
        />
      ) : (
        <section className="rounded-lg border border-slate-200 bg-white px-6 py-12 text-center text-sm text-slate-500 shadow-sm">
          {listTitle}
          <p className="mt-2">Chưa có dữ liệu doanh thu.</p>
        </section>
      )}
    </>
  );

  return (
    <>
      {/* Mobile layout */}
      <div className="min-h-screen bg-slate-50 pb-24 lg:hidden">
        <MobileTopHeader title="Doanh thu" />

        <main className="space-y-4 px-4 pt-4">
          <div className="rounded-2xl border border-slate-200 bg-white p-5">
            <h1 className="text-xl font-bold text-slate-900">Danh sách doanh thu</h1>
            <p className="mt-1 text-sm leading-6 text-slate-500">
              Quản lý và theo dõi các khoản thu nhập của hộ kinh doanh.
            </p>
            <div className="mt-4 flex gap-2">
              <button
                type="button"
                onClick={() => navigate('/revenues/create')}
                className="inline-flex h-11 flex-1 items-center justify-center rounded-md bg-teal-700 text-sm font-bold text-white transition active:bg-teal-800"
              >
                + Thêm doanh thu
              </button>
              <button
                type="button"
                onClick={handleOpenExportDialog}
                className="inline-flex h-11 flex-1 items-center justify-center rounded-md border border-slate-200 bg-white text-sm font-bold text-slate-700 transition active:bg-slate-50"
              >
                Xuất Word
              </button>
            </div>
          </div>

          {renderContent()}
        </main>
      </div>

      {/* Desktop layout */}
      <DashboardLayout
        userName={user?.name || user?.username || 'Người dùng'}
        businessOptions={businessOptions}
        selectedBusiness={effectiveBusinessId}
        onBusinessChange={(value) => handleFilterChange('businessId', value)}
        onLogout={handleLogout}
        activeNav="cash-flow"
        desktopOnly
      >
        <section className="rounded-lg border border-slate-200 bg-white px-5 py-5 shadow-sm">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
            <div>
              <h1 className="text-2xl font-semibold text-slate-800">Danh sách doanh thu</h1>
              <p className="mt-2 text-sm text-slate-500">
                Quản lý và theo dõi các khoản thu nhập của hộ kinh doanh.
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <Button type="button" variant="secondary" size="lg" onClick={handleOpenExportDialog}>
                Xuất Word
              </Button>
              <Button type="button" size="lg" onClick={() => navigate('/revenues/create')}>
                Thêm doanh thu
              </Button>
            </div>
          </div>
        </section>

        {renderContent()}
      </DashboardLayout>

      <RevenueDetailModal
        revenue={detailRevenue}
        isOpen={Boolean(detailRevenue)}
        onClose={() => setDetailRevenue(null)}
        onEdit={(row) => navigate(`/revenues/${row.id || row._id}/edit`)}
        onDelete={(row) => {
          setDetailRevenue(null);
          setDeleteErrorMessage('');
          setSelectedRevenue(row);
        }}
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
        businessName={selectedBusinessItem?.name}
        isSubmitting={exportRevenueWordMutation.isPending}
        onClose={() => setIsExportDialogOpen(false)}
        onSubmit={handleExportRevenueWord}
      />
    </>
  );
};
