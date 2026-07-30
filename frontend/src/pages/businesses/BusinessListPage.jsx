import { useMemo, useState } from 'react';
import { BusinessDeleteDialog } from '../../components/businesses/BusinessDeleteDialog.jsx';
import { BusinessFilters } from '../../components/businesses/BusinessFilters.jsx';
import { BusinessTable } from '../../components/businesses/BusinessTable.jsx';
import { DashboardLayout } from '../../components/dashboard/DashboardLayout.jsx';
import { Icon } from '../../components/dashboard/DashboardIcons.jsx';
import { MobileTopHeader } from '../../components/dashboard/MobileTopHeader.jsx';
import { Button } from '../../components/ui/Button.jsx';
import { Card } from '../../components/ui/Card.jsx';
import { FormError } from '../../components/ui/FormError.jsx';
import { Skeleton } from '../../components/ui/Skeleton.jsx';
import { useToast } from '../../components/ui/useToast.js';
import { useBusinesses, useChangeBusinessStatus } from '../../hooks/useBusinesses.js';
import { useDashboardShell } from '../../hooks/useDashboardShell.js';
import { useDebouncedValue } from '../../hooks/useDebouncedValue.js';

const StatChip = ({ label, value, isLoading, tone = 'text-bone-800' }) => (
  <div className="min-w-[104px] flex-1 rounded-sm bg-bone-100 px-4 py-3">
    <p className="text-[10.5px] font-bold uppercase tracking-wide text-bone-500">{label}</p>
    {isLoading ? (
      <Skeleton className="mt-2 h-6 w-10" />
    ) : (
      <p className={`mt-1 font-serif text-xl font-semibold ${tone}`}>{value}</p>
    )}
  </div>
);

export const BusinessListPage = () => {
  const { navigate, handleNavigate, handleUnsupportedAction } = useDashboardShell();
  const toast = useToast();
  const [selectedBusiness, setSelectedBusiness] = useState(null);
  const [filters, setFilters] = useState({
    keyword: '',
    status: 'all',
    type: 'all',
    page: 1,
    limit: 4,
  });

  const debouncedKeyword = useDebouncedValue(filters.keyword);
  const queryParams = useMemo(
    () => ({
      ...filters,
      keyword: debouncedKeyword,
    }),
    [filters, debouncedKeyword],
  );

  const businessesQuery = useBusinesses(queryParams);
  const changeStatusMutation = useChangeBusinessStatus();

  // Lightweight count-only queries (limit=1, we only read pagination.total) to
  // power the stats strip regardless of whatever status filter is active.
  const totalCountQuery = useBusinesses({ status: 'all', limit: 1 });
  const activeCountQuery = useBusinesses({ status: 'active', limit: 1 });
  const inactiveCountQuery = useBusinesses({ status: 'inactive', limit: 1 });
  const isCountsLoading = totalCountQuery.isLoading || activeCountQuery.isLoading || inactiveCountQuery.isLoading;

  const handleFilterChange = (field, value) => {
    setFilters((currentFilters) => ({
      ...currentFilters,
      [field]: value,
      page: field === 'page' ? value : 1,
    }));
  };

  const handleStatusConfirm = async () => {
    if (!selectedBusiness) return;

    const nextStatus = selectedBusiness.status === 'active' ? 'inactive' : 'active';

    try {
      await changeStatusMutation.mutateAsync({
        id: selectedBusiness._id,
        status: nextStatus,
      });
      toast.success(nextStatus === 'active' ? 'Kích hoạt lại hộ kinh doanh thành công' : 'Đã chuyển hộ kinh doanh sang ngừng hoạt động');
      setSelectedBusiness(null);
    } catch (error) {
      toast.error(error.message || 'Không thể cập nhật trạng thái hộ kinh doanh');
    }
  };

  const renderBusinessContent = () => (
    <>
      <Card padding="lg" className="flex gap-3">
        <StatChip label="Tổng số" value={totalCountQuery.data?.pagination?.total ?? 0} isLoading={isCountsLoading} />
        <StatChip
          label="Đang hoạt động"
          value={activeCountQuery.data?.pagination?.total ?? 0}
          isLoading={isCountsLoading}
          tone="text-emerald-600"
        />
        <StatChip
          label="Ngừng hoạt động"
          value={inactiveCountQuery.data?.pagination?.total ?? 0}
          isLoading={isCountsLoading}
          tone="text-accent-red"
        />
      </Card>

      <BusinessFilters filters={filters} onChange={handleFilterChange} />

      {businessesQuery.error ? <FormError message={businessesQuery.error.message} /> : null}

      {businessesQuery.isLoading ? (
        <Card className="px-6 py-12 text-center text-sm font-medium text-bone-500">
          Đang tải danh sách hộ kinh doanh...
        </Card>
      ) : businessesQuery.data?.rows?.length ? (
        <BusinessTable
          rows={businessesQuery.data.rows}
          pagination={businessesQuery.data.pagination}
          page={filters.page}
          onPageChange={(page) => handleFilterChange('page', page)}
          onEdit={(business) => navigate(`/businesses/${business._id}/edit`)}
          onToggleStatus={setSelectedBusiness}
        />
      ) : (
        <Card className="px-6 py-12 text-center text-sm font-medium text-bone-500">
          Chưa có hộ kinh doanh nào
        </Card>
      )}
    </>
  );

  return (
    <>
      <div className="min-h-screen bg-bone-50 pb-24 lg:hidden">
        <MobileTopHeader title="Hộ kinh doanh" />

        <main className="space-y-4 px-4 pt-4">
          {renderBusinessContent()}
        </main>

        <button
          type="button"
          onClick={() => navigate('/businesses/create')}
          className="fixed bottom-24 right-5 z-30 grid h-14 w-14 place-items-center rounded-full bg-primary-700 text-white shadow-2 transition-brand hover:scale-[1.04] hover:bg-primary-800 active:scale-[0.95]"
          aria-label="Thêm hộ kinh doanh"
        >
          <Icon name="plus" className="h-7 w-7" />
        </button>
      </div>

      <DashboardLayout
        activeNav="more"
        onNavigate={handleNavigate}
        onExport={handleUnsupportedAction}
        onProfileClick={() => navigate('/account')}
        onUnsupportedAction={handleUnsupportedAction}
        desktopOnly
      >
        <div className="mx-auto max-w-[1180px] space-y-6">
          <div className="flex items-center justify-between gap-6">
            <nav className="flex items-center gap-3 text-xs font-bold text-bone-500">
              <button type="button" onClick={() => navigate('/dashboard')} className="transition-brand hover:text-primary-600">
                Dashboard
              </button>
              <span>&gt;</span>
              <span className="text-primary-600">Hộ kinh doanh</span>
            </nav>

            <Button onClick={() => navigate('/businesses/create')}>+ Thêm hộ kinh doanh</Button>
          </div>

          {renderBusinessContent()}
        </div>
      </DashboardLayout>

      <BusinessDeleteDialog
        business={selectedBusiness}
        isOpen={Boolean(selectedBusiness)}
        isSubmitting={changeStatusMutation.isPending}
        onClose={() => setSelectedBusiness(null)}
        onConfirm={handleStatusConfirm}
      />
    </>
  );
};
