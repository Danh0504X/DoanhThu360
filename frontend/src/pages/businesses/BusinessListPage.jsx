import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BusinessDeleteDialog } from '../../components/businesses/BusinessDeleteDialog.jsx';
import { BusinessFilters } from '../../components/businesses/BusinessFilters.jsx';
import { BusinessTable } from '../../components/businesses/BusinessTable.jsx';
import { DashboardLayout } from '../../components/dashboard/DashboardLayout.jsx';
import { MobileTopHeader } from '../../components/dashboard/MobileTopHeader.jsx';
import { FormError } from '../../components/ui/FormError.jsx';
import { useToast } from '../../components/ui/useToast.js';
import { useBusinesses, useChangeBusinessStatus } from '../../hooks/useBusinesses.js';
import { useDebouncedValue } from '../../hooks/useDebouncedValue.js';

export const BusinessListPage = () => {
  const navigate = useNavigate();
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

  const handleFilterChange = (field, value) => {
    setFilters((currentFilters) => ({
      ...currentFilters,
      [field]: value,
      page: field === 'page' ? value : 1,
    }));
  };

  const handleUnsupportedAction = () => {
    toast.info('Chức năng này chưa được backend hỗ trợ.');
  };

  const handleNavigate = (item) => {
    if (item.id === 'dashboard') {
      navigate('/dashboard');
      return;
    }

    if (item.id === 'cash-flow') {
      navigate('/revenues');
      return;
    }

    if (item.to) {
      navigate(item.to);
      return;
    }

    handleUnsupportedAction();
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
      <BusinessFilters filters={filters} onChange={handleFilterChange} />

      {businessesQuery.error ? <FormError message={businessesQuery.error.message} className="mt-4 rounded-md" /> : null}

      {businessesQuery.isLoading ? (
        <section className="mt-4 rounded-lg border border-slate-200 bg-white px-6 py-12 text-center text-sm font-medium text-slate-500">
          Đang tải danh sách hộ kinh doanh...
        </section>
      ) : businessesQuery.data?.rows?.length ? (
        <div className="mt-4">
          <BusinessTable
            rows={businessesQuery.data.rows}
            pagination={businessesQuery.data.pagination}
            page={filters.page}
            onPageChange={(page) => handleFilterChange('page', page)}
            onEdit={(business) => navigate(`/businesses/${business._id}/edit`)}
            onToggleStatus={setSelectedBusiness}
          />
        </div>
      ) : (
        <section className="mt-4 rounded-lg border border-slate-200 bg-white px-6 py-12 text-center text-sm font-medium text-slate-500">
          Chưa có hộ kinh doanh nào
        </section>
      )}
    </>
  );

  return (
    <>
      <div className="min-h-screen bg-[#F8F9FA] pb-20 lg:hidden">
        <MobileTopHeader title="Hộ kinh doanh" />

        <main className="px-4 pt-5">
          <div className="mb-6 rounded-lg border border-slate-200 bg-white p-5">
            <p className="text-xs font-bold uppercase text-[#2D7A7F]">Business Units</p>
            <h1 className="mt-2 text-2xl font-bold text-slate-950">Danh sách hộ kinh doanh</h1>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              Quản lý và theo dõi các đơn vị kinh doanh trực thuộc hệ thống.
            </p>
            <button
              type="button"
              onClick={() => navigate('/businesses/create')}
              className="mt-5 inline-flex h-11 w-full items-center justify-center rounded-md bg-[#2D7A7F] text-sm font-bold text-white transition hover:bg-[#25696d]"
            >
              + Thêm hộ kinh doanh
            </button>
          </div>

          {renderBusinessContent()}
        </main>
      </div>

      <DashboardLayout
        activeNav="more"
        onNavigate={handleNavigate}
        onExport={handleUnsupportedAction}
        onProfileClick={() => navigate('/account')}
        onUnsupportedAction={handleUnsupportedAction}
        desktopOnly
      >
        <div className="mx-auto max-w-[1180px]">
          <nav className="mb-6 flex items-center gap-3 text-xs font-bold text-slate-500">
            <button type="button" onClick={() => navigate('/dashboard')} className="hover:text-[#2D7A7F]">
              Dashboard
            </button>
            <span>&gt;</span>
            <span className="text-[#2D7A7F]">Hộ kinh doanh</span>
          </nav>

          <div className="mb-7 flex items-center justify-between gap-6 rounded-lg border border-slate-200 bg-white p-6">
            <div>
              <p className="text-xs font-bold uppercase text-[#2D7A7F]">Business Units</p>
              <h1 className="mt-2 text-4xl font-bold tracking-normal text-slate-950">Danh sách hộ kinh doanh</h1>
              <p className="mt-2 text-sm font-medium text-slate-500">
                Quản lý và theo dõi các đơn vị kinh doanh trực thuộc hệ thống.
              </p>
            </div>
            <button
              type="button"
              onClick={() => navigate('/businesses/create')}
              className="inline-flex h-11 items-center justify-center rounded-md bg-[#2D7A7F] px-6 text-sm font-bold text-white transition hover:bg-[#25696d]"
            >
              + Thêm hộ kinh doanh
            </button>
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
