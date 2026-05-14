import { useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { DashboardLayout } from '../../components/dashboard/DashboardLayout.jsx';
import { RevenueCodePreview } from '../../components/revenues/RevenueCodePreview.jsx';
import { RevenueDeleteDialog } from '../../components/revenues/RevenueDeleteDialog.jsx';
import { RevenueForm } from '../../components/revenues/RevenueForm.jsx';
import { Button } from '../../components/ui/Button.jsx';
import { FormError } from '../../components/ui/FormError.jsx';
import { useAuth } from '../../hooks/useAuth.js';
import { useBusinesses } from '../../hooks/useBusinesses.js';
import {
  useDeleteRevenue,
  useRevenue,
  useUpdateRevenue,
} from '../../hooks/useRevenues.js';

const mapRevenueFormToPayload = (values) => ({
  businessId: values.businessId,
  revenueDate: values.date,
  content: values.content,
  cashAmount: Number(values.cashAmount || 0),
  bankAmount: Number(values.bankAmount || 0),
  note: values.note || '',
});

export const RevenueEditPage = () => {
  const { id } = useParams();
  const { user, logout } = useAuth();
  const navigate = useNavigate();
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

  const handleLogout = async () => {
    await logout();
    navigate('/login', { replace: true });
  };

  const handleSubmit = async (values) => {
    try {
      setSubmitError('');
      await updateRevenueMutation.mutateAsync({
        id,
        data: mapRevenueFormToPayload(values),
      });
      navigate('/revenues', {
        replace: true,
        state: { successMessage: 'Cập nhật doanh thu thành công.' },
      });
    } catch (error) {
      setSubmitError(error.message || 'Không thể cập nhật doanh thu.');
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

  const headerError = revenueQuery.error?.message || businessesQuery.error?.message;

  return (
    <DashboardLayout
      userName={user?.name || user?.username || 'Người dùng'}
      businessOptions={[
        { id: revenueQuery.data?.businessId || 'all', name: 'Chọn hộ kinh doanh' },
        ...businessOptions,
      ]}
      selectedBusiness={revenueQuery.data?.businessId || 'all'}
      onBusinessChange={() => {}}
      onLogout={handleLogout}
      activeNav="revenue"
    >
      <section className="rounded-[28px] border border-slate-200 bg-white px-5 py-5 shadow-sm">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <p className="text-sm text-slate-500">Quản lý doanh thu &gt; Chỉnh sửa</p>
            <h1 className="mt-3 text-2xl font-semibold text-slate-800">Chỉnh sửa doanh thu</h1>
            <p className="mt-2 text-sm text-slate-500">
              Cập nhật dữ liệu doanh thu và điều chỉnh thông tin khi cần.
            </p>
          </div>

          <Button type="button" variant="danger" onClick={() => setIsDeleteDialogOpen(true)}>
            Xóa bản ghi
          </Button>
        </div>
      </section>

      {revenueQuery.isLoading ? (
        <section className="rounded-[28px] border border-slate-200 bg-white px-6 py-12 text-center text-sm text-slate-500 shadow-sm">
          Đang tải dữ liệu doanh thu...
        </section>
      ) : headerError ? (
        <FormError message={headerError} />
      ) : (
        <RevenueForm
          mode="edit"
          defaultValues={revenueQuery.data}
          businessOptions={businessOptions}
          onSubmit={handleSubmit}
          isSubmitting={updateRevenueMutation.isPending}
          onCancel={() => navigate('/revenues')}
          errorMessage={submitError}
          actions={({ cashAmount, bankAmount, totalAmount, code }) => (
            <RevenueCodePreview
              code={code}
              cashAmount={cashAmount}
              bankAmount={bankAmount}
              totalAmount={totalAmount}
            />
          )}
        />
      )}

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
    </DashboardLayout>
  );
};
