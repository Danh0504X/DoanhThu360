import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { DashboardLayout } from '../../components/dashboard/DashboardLayout.jsx';
import { Icon } from '../../components/dashboard/DashboardIcons.jsx';
import { RevenueRecordCreateForm } from '../../components/revenues/RevenueRecordCreateForm.jsx';
import { useToast } from '../../components/ui/useToast.js';
import { useBusinesses } from '../../hooks/useBusinesses.js';
import { useCreateRevenue } from '../../hooks/useRevenues.js';
import { mapRevenueFormToPayload } from '../../utils/revenueMappers.js';

export const RevenueCreatePage = () => {
  const navigate = useNavigate();
  const toast = useToast();
  const businessesQuery = useBusinesses({ status: 'active' });
  const createRevenueMutation = useCreateRevenue();
  const [submitError, setSubmitError] = useState('');

  const businessOptions = useMemo(
    () => (businessesQuery.data?.rows || []).map((business) => ({
      id: business._id,
      name: business.businessName,
      revenueCount: Number(business.revenueCount || 0),
    })),
    [businessesQuery.data],
  );

  // Default to the business with the most records; fall back to the first one.
  const defaultBusinessId = useMemo(() => {
    if (!businessOptions.length) return '';
    return businessOptions.reduce(
      (best, option) => (option.revenueCount > best.revenueCount ? option : best),
      businessOptions[0],
    ).id;
  }, [businessOptions]);

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

  const handleCancel = () => {
    if (window.history.length > 1) {
      navigate(-1);
      return;
    }

    navigate('/dashboard');
  };

  const handleSubmit = async (values) => {
    try {
      setSubmitError('');
      await createRevenueMutation.mutateAsync(mapRevenueFormToPayload(values));
      toast.success('Lưu bảng ghi thành công.');
      navigate('/revenues', { replace: true });
    } catch (error) {
      const message = error.message || 'Không thể lưu bảng ghi.';
      setSubmitError(message);
      toast.error(message);
    }
  };

  const businessError = businessesQuery.error?.message || '';

  return (
    <>
      <div className="min-h-screen bg-bone-50 pb-20 lg:hidden">
        <header className="sticky top-0 z-20 flex h-14 items-center justify-between border-b border-bone-200 bg-white px-4">
          <button
            type="button"
            onClick={handleCancel}
            className="grid h-10 w-10 place-items-center rounded-sm text-primary-600 transition-brand hover:bg-bone-100"
            aria-label="Quay lại"
          >
            <Icon name="arrowLeft" className="h-5 w-5" />
          </button>
          <p className="text-sm font-bold text-primary-600">Thêm mới bảng ghi</p>
          <button
            type="button"
            onClick={handleUnsupportedAction}
            className="grid h-10 w-10 place-items-center rounded-sm text-bone-500 transition-brand hover:bg-bone-100"
            aria-label="Menu"
          >
            <Icon name="menu" className="h-5 w-5" />
          </button>
        </header>

        <main className="px-4 pt-5">
          <h1 className="font-serif text-2xl font-semibold tracking-tight text-bone-950">Chi tiết giao dịch</h1>
          <p className="mt-2 text-sm leading-6 text-bone-600">
            Nhập thông tin doanh thu thực tế để cập nhật hệ thống báo cáo.
          </p>

          <div className="mt-6">
            <RevenueRecordCreateForm
              businessOptions={businessOptions}
              defaultBusinessId={defaultBusinessId}
              isBusinessLoading={businessesQuery.isLoading}
              businessError={businessError}
              isSubmitting={createRevenueMutation.isPending}
              submitError={submitError}
              onSubmit={handleSubmit}
              onCancel={handleCancel}
              variant="mobile"
            />
          </div>
        </main>
      </div>

      <DashboardLayout
        activeNav="cash-flow"
        onNavigate={handleNavigate}
        onExport={handleUnsupportedAction}
        onProfileClick={() => navigate('/account')}
        onUnsupportedAction={handleUnsupportedAction}
        desktopOnly
      >
        <div className="mx-auto max-w-[920px]">
          <nav className="mb-6 flex items-center gap-3 text-xs font-bold text-bone-500">
            <button type="button" onClick={() => navigate('/dashboard')} className="hover:text-primary-600">
              Dashboard
            </button>
            <span>&gt;</span>
            <button type="button" onClick={() => navigate('/revenues')} className="hover:text-primary-600">
              Dòng tiền
            </button>
            <span>&gt;</span>
            <span className="text-primary-600">Thêm mới bảng ghi</span>
          </nav>

          <RevenueRecordCreateForm
            businessOptions={businessOptions}
            defaultBusinessId={defaultBusinessId}
            isBusinessLoading={businessesQuery.isLoading}
            businessError={businessError}
            isSubmitting={createRevenueMutation.isPending}
            submitError={submitError}
            onSubmit={handleSubmit}
            onCancel={handleCancel}
          />
        </div>
      </DashboardLayout>
    </>
  );
};
