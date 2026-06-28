import { useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { DashboardLayout } from '../../components/dashboard/DashboardLayout.jsx';
import { Icon } from '../../components/dashboard/DashboardIcons.jsx';
import { RevenueDeleteDialog } from '../../components/revenues/RevenueDeleteDialog.jsx';
import { RevenueRecordCreateForm } from '../../components/revenues/RevenueRecordCreateForm.jsx';
import { FormError } from '../../components/ui/FormError.jsx';
import { useToast } from '../../components/ui/useToast.js';
import { useBusinesses } from '../../hooks/useBusinesses.js';
import {
  useDeleteRevenue,
  useRevenue,
  useUpdateRevenue,
} from '../../hooks/useRevenues.js';
import { mapRevenueFormToPayload } from '../../utils/revenueMappers.js';

export const RevenueEditPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const toast = useToast();
  const businessesQuery = useBusinesses({ status: 'active' });
  const revenueQuery = useRevenue(id);
  const updateRevenueMutation = useUpdateRevenue();
  const deleteRevenueMutation = useDeleteRevenue();
  const [submitError, setSubmitError] = useState('');
  const [deleteErrorMessage, setDeleteErrorMessage] = useState('');
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const businessOptions = useMemo(
    () => (businessesQuery.data?.rows || []).map((business) => ({
      id: business._id,
      name: business.businessName,
    })),
    [businessesQuery.data],
  );

  const handleBack = () => {
    if (window.history.length > 1) {
      navigate(-1);
      return;
    }
    navigate('/revenues');
  };

  const handleSubmit = async (values) => {
    try {
      setSubmitError('');
      await updateRevenueMutation.mutateAsync({
        id,
        data: mapRevenueFormToPayload(values),
      });
      toast.success('Cập nhật doanh thu thành công.');
      navigate('/revenues', {
        replace: true,
        state: { successMessage: 'Cập nhật doanh thu thành công.' },
      });
    } catch (error) {
      const message = error.message || 'Không thể cập nhật doanh thu.';
      setSubmitError(message);
      toast.error(message);
    }
  };

  const handleDelete = async () => {
    try {
      setDeleteErrorMessage('');
      await deleteRevenueMutation.mutateAsync(id);
      navigate('/revenues', {
        replace: true,
        state: { successMessage: 'Xóa doanh thu thành công.' },
      });
    } catch (error) {
      setDeleteErrorMessage(error.message || 'Không thể xóa doanh thu.');
    }
  };

  const isLoading = revenueQuery.isLoading;
  const loadError = revenueQuery.error?.message || businessesQuery.error?.message;

  const renderForm = (variant) => {
    if (isLoading) {
      return (
        <div className="rounded-lg border border-slate-200 bg-white px-6 py-12 text-center text-sm text-slate-500">
          Đang tải dữ liệu doanh thu...
        </div>
      );
    }

    if (loadError) {
      return <FormError message={loadError} className="rounded-md" />;
    }

    return (
      <RevenueRecordCreateForm
        mode="edit"
        title="Chỉnh sửa bảng ghi"
        subtitle="Cập nhật thông tin doanh thu đã ghi nhận."
        businessOptions={businessOptions}
        initialValues={revenueQuery.data}
        isBusinessLoading={businessesQuery.isLoading}
        isSubmitting={updateRevenueMutation.isPending}
        submitError={submitError}
        onSubmit={handleSubmit}
        onCancel={handleBack}
        variant={variant}
      />
    );
  };

  return (
    <>
      {/* Mobile layout */}
      <div className="min-h-screen bg-[#F8F9FA] pb-20 lg:hidden">
        <header className="sticky top-0 z-20 flex h-14 items-center justify-between border-b border-slate-200 bg-white px-2">
          <button
            type="button"
            onClick={handleBack}
            className="inline-flex h-10 items-center gap-1.5 rounded-md px-2 text-sm font-bold text-[#2D7A7F]"
            aria-label="Quay lại"
          >
            <Icon name="arrowLeft" className="h-5 w-5" />
            Quay lại
          </button>
          <p className="text-sm font-bold text-[#2D7A7F]">Chỉnh sửa</p>
          <button
            type="button"
            onClick={() => setIsDeleteDialogOpen(true)}
            disabled={isLoading || Boolean(loadError)}
            className="grid h-10 w-10 place-items-center text-red-500 disabled:opacity-40"
            aria-label="Xóa bản ghi"
          >
            <Icon name="trash" className="h-5 w-5" />
          </button>
        </header>

        <main className="px-4 pt-5">
          <h1 className="text-2xl font-bold text-slate-950">Chỉnh sửa bảng ghi</h1>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            Cập nhật thông tin doanh thu đã ghi nhận trong hệ thống.
          </p>

          <div className="mt-6">{renderForm('mobile')}</div>
        </main>
      </div>

      {/* Desktop layout */}
      <DashboardLayout
        activeNav="cash-flow"
        onProfileClick={() => navigate('/account')}
        desktopOnly
      >
        <div className="mx-auto max-w-[920px]">
          <div className="mb-6 flex items-center justify-between gap-4">
            <nav className="flex items-center gap-3 text-xs font-bold text-slate-500">
              <button type="button" onClick={() => navigate('/dashboard')} className="hover:text-[#2D7A7F]">
                Dashboard
              </button>
              <span>&gt;</span>
              <button type="button" onClick={() => navigate('/revenues')} className="hover:text-[#2D7A7F]">
                Dòng tiền
              </button>
              <span>&gt;</span>
              <span className="text-[#2D7A7F]">Chỉnh sửa</span>
            </nav>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setIsDeleteDialogOpen(true)}
                disabled={isLoading || Boolean(loadError)}
                className="inline-flex h-10 items-center gap-2 rounded-md border border-red-200 bg-white px-4 text-sm font-bold text-red-600 transition hover:bg-red-50 disabled:opacity-40"
              >
                <Icon name="trash" className="h-4 w-4" />
                Xóa bản ghi
              </button>
              <button
                type="button"
                onClick={handleBack}
                className="inline-flex h-10 items-center gap-2 rounded-md border border-slate-200 bg-white px-4 text-sm font-bold text-slate-600 transition hover:bg-slate-50"
              >
                <Icon name="arrowLeft" className="h-4 w-4" />
                Quay lại
              </button>
            </div>
          </div>

          {renderForm('desktop')}
        </div>
      </DashboardLayout>

      <RevenueDeleteDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => {
          setDeleteErrorMessage('');
          setIsDeleteDialogOpen(false);
        }}
        onConfirm={handleDelete}
        isDeleting={deleteRevenueMutation.isPending}
        errorMessage={deleteErrorMessage}
      />
    </>
  );
};
