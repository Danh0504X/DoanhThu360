import { useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { DashboardLayout } from '../../components/dashboard/DashboardLayout.jsx';
import { RevenueWordExportDialog } from '../../components/reports/RevenueWordExportDialog.jsx';
import { RevenueDeleteDialog } from '../../components/revenues/RevenueDeleteDialog.jsx';
import { RevenueFilters } from '../../components/revenues/RevenueFilters.jsx';
import { RevenueSummaryCards } from '../../components/revenues/RevenueSummaryCards.jsx';
import { RevenueTable } from '../../components/revenues/RevenueTable.jsx';
import { Button } from '../../components/ui/Button.jsx';
import { FormError } from '../../components/ui/FormError.jsx';
import { FormSuccess } from '../../components/ui/FormSuccess.jsx';
import { useToast } from '../../components/ui/useToast.js';
import { useAuth } from '../../hooks/useAuth.js';
import { useBusinesses } from '../../hooks/useBusinesses.js';
import { useExportRevenueWord } from '../../hooks/useExportRevenueWord.js';
import {
  useDeleteRevenue,
  useRevenues,
  useRevenueSummary,
} from '../../hooks/useRevenues.js';
import { downloadBlob } from '../../utils/downloadBlob.js';

const useDebouncedValue = (value, delay = 400) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => window.clearTimeout(timeoutId);
  }, [value, delay]);

  return debouncedValue;
};

export const RevenueListPage = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const toast = useToast();
  const [successMessage, setSuccessMessage] = useState(location.state?.successMessage || '');
  const [deleteErrorMessage, setDeleteErrorMessage] = useState('');
  const [selectedRevenue, setSelectedRevenue] = useState(null);
  const [isExportDialogOpen, setIsExportDialogOpen] = useState(false);
  const [filters, setFilters] = useState({
    keyword: '',
    fromDate: '',
    toDate: '',
    businessId: 'all',
    page: 1,
    limit: 10,
  });

  const debouncedKeyword = useDebouncedValue(filters.keyword);
  const queryParams = useMemo(
    () => ({
      ...filters,
      keyword: debouncedKeyword,
    }),
    [filters, debouncedKeyword],
  );

  const businessesQuery = useBusinesses({ status: 'active' });
  const revenuesQuery = useRevenues(queryParams);
  const summaryQuery = useRevenueSummary(queryParams);
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

  const selectedBusinessItem = businessOptions.find((item) => item.id === filters.businessId);

  const handleOpenExportDialog = () => {
    if (filters.businessId === 'all') {
      toast.error('Vui lòng chọn một hộ kinh doanh để xuất Word');
      return;
    }

    setIsExportDialogOpen(true);
  };

  const handleExportRevenueWord = async ({ periodType, value }) => {
    try {
      const result = await exportRevenueWordMutation.mutateAsync({
        businessId: filters.businessId,
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
    revenuesQuery.error?.message ||
    summaryQuery.error?.message;

  return (
    <DashboardLayout
      userName={user?.name || user?.username || 'Người dùng'}
      businessOptions={businessOptions}
      selectedBusiness={filters.businessId}
      onBusinessChange={(value) => handleFilterChange('businessId', value)}
      onLogout={handleLogout}
      activeNav="revenue"
    >
      <section className="rounded-[28px] border border-slate-200 bg-white px-5 py-5 shadow-sm">
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

      <FormSuccess message={successMessage} />
      {errorMessage ? <FormError message={errorMessage} /> : null}

      <RevenueFilters
        filters={filters}
        onChange={handleFilterChange}
        businessOptions={businessOptions}
      />

      {revenuesQuery.isLoading ? (
        <section className="rounded-[28px] border border-slate-200 bg-white px-6 py-12 text-center text-sm text-slate-500 shadow-sm">
          Đang tải dữ liệu...
        </section>
      ) : filteredRows.length ? (
        <RevenueTable
          rows={filteredRows}
          pagination={revenuesQuery.data?.pagination}
          page={filters.page}
          onPageChange={(page) => handleFilterChange('page', page)}
          onEdit={(row) => navigate(`/revenues/${row.id || row._id}/edit`)}
          onDelete={(row) => {
            setDeleteErrorMessage('');
            setSelectedRevenue(row);
          }}
        />
      ) : (
        <section className="rounded-[28px] border border-slate-200 bg-white px-6 py-12 text-center text-sm text-slate-500 shadow-sm">
          Chưa có dữ liệu doanh thu
        </section>
      )}

      <RevenueSummaryCards summary={summaryQuery.data} />

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
    </DashboardLayout>
  );
};
