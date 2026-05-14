import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { DashboardLayout } from '../../components/dashboard/DashboardLayout.jsx';
import { BusinessDeleteDialog } from '../../components/businesses/BusinessDeleteDialog.jsx';
import { BusinessFilters } from '../../components/businesses/BusinessFilters.jsx';
import { BusinessTable } from '../../components/businesses/BusinessTable.jsx';
import { Button } from '../../components/ui/Button.jsx';
import { FormError } from '../../components/ui/FormError.jsx';
import { useToast } from '../../components/ui/useToast.js';
import { useAuth } from '../../hooks/useAuth.js';
import { useBusinesses, useChangeBusinessStatus } from '../../hooks/useBusinesses.js';

const useDebouncedValue = (value, delay = 400) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => setDebouncedValue(value), delay);
    return () => window.clearTimeout(timeoutId);
  }, [value, delay]);

  return debouncedValue;
};

export const BusinessListPage = () => {
  const navigate = useNavigate();
  const toast = useToast();
  const { user, logout } = useAuth();
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

  const handleFilterChange = (field, value) => {
    setFilters((currentFilters) => ({
      ...currentFilters,
      [field]: value,
      page: field === 'page' ? value : 1,
    }));
  };

  const handleLogout = async () => {
    await logout();
    navigate('/login', { replace: true });
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

  return (
    <DashboardLayout
      userName={user?.name || user?.username || 'Người dùng'}
      businessOptions={[{ id: 'all', name: 'Chọn Hộ Kinh Doanh' }]}
      selectedBusiness="all"
      onBusinessChange={() => {}}
      onLogout={handleLogout}
      activeNav="business"
      pageTitle="Hộ kinh doanh"
      pageDescription="Danh sách hộ kinh doanh"
      headingTitle="Hộ kinh doanh"
      headingDescription="Quản lý và theo dõi các đơn vị kinh doanh trực thuộc hệ thống."
    >
      <section className="rounded-[28px] border border-slate-200 bg-white px-5 py-5 shadow-sm">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-slate-800">Danh sách hộ kinh doanh</h1>
            <p className="mt-2 text-sm text-slate-500">
              Quản lý và theo dõi các đơn vị kinh doanh trực thuộc hệ thống.
            </p>
          </div>
          <Button type="button" size="lg" onClick={() => navigate('/businesses/create')}>
            + Thêm hộ kinh doanh
          </Button>
        </div>
      </section>

      <BusinessFilters filters={filters} onChange={handleFilterChange} />

      {businessesQuery.error ? <FormError message={businessesQuery.error.message} /> : null}

      {businessesQuery.isLoading ? (
        <section className="rounded-[28px] border border-slate-200 bg-white px-6 py-12 text-center text-sm text-slate-500 shadow-sm">
          Đang tải danh sách hộ kinh doanh...
        </section>
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
        <section className="rounded-[28px] border border-slate-200 bg-white px-6 py-12 text-center text-sm text-slate-500 shadow-sm">
          Chưa có hộ kinh doanh nào
        </section>
      )}

      <BusinessDeleteDialog
        business={selectedBusiness}
        isOpen={Boolean(selectedBusiness)}
        isSubmitting={changeStatusMutation.isPending}
        onClose={() => setSelectedBusiness(null)}
        onConfirm={handleStatusConfirm}
      />
    </DashboardLayout>
  );
};
