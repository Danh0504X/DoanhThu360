import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { DashboardLayout } from '../../components/dashboard/DashboardLayout.jsx';
import { RevenueCodePreview } from '../../components/revenues/RevenueCodePreview.jsx';
import { RevenueForm } from '../../components/revenues/RevenueForm.jsx';
import { useAuth } from '../../hooks/useAuth.js';
import { useBusinesses } from '../../hooks/useBusinesses.js';
import { useCreateRevenue } from '../../hooks/useRevenues.js';

const mapRevenueFormToPayload = (values) => ({
  businessId: values.businessId,
  revenueDate: values.date,
  content: values.content,
  cashAmount: Number(values.cashAmount || 0),
  bankAmount: Number(values.bankAmount || 0),
  note: values.note || '',
});

export const RevenueCreatePage = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const businessesQuery = useBusinesses({ status: 'active' });
  const createRevenueMutation = useCreateRevenue();
  const [submitError, setSubmitError] = useState('');
  const [selectedBusiness, setSelectedBusiness] = useState('all');

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
      await createRevenueMutation.mutateAsync(mapRevenueFormToPayload(values));
      navigate('/revenues', {
        replace: true,
        state: { successMessage: 'Thêm doanh thu thành công.' },
      });
    } catch (error) {
      setSubmitError(error.message || 'Không thể thêm doanh thu.');
    }
  };

  return (
    <DashboardLayout
      userName={user?.name || user?.username || 'Người dùng'}
      businessOptions={[
        { id: 'all', name: 'Chọn hộ kinh doanh' },
        ...businessOptions,
      ]}
      selectedBusiness={selectedBusiness}
      onBusinessChange={setSelectedBusiness}
      onLogout={handleLogout}
      activeNav="revenue"
    >
      <section className="rounded-[28px] border border-slate-200 bg-white px-5 py-5 shadow-sm">
        <p className="text-sm text-slate-500">Quản lý doanh thu &gt; Thêm mới</p>
        <h1 className="mt-3 text-2xl font-semibold text-slate-800">Nhập doanh thu chi tiết</h1>
        <p className="mt-2 text-sm text-slate-500">
          Cập nhật dữ liệu tài chính hằng ngày cho các cơ sở kinh doanh.
        </p>
      </section>

      <RevenueForm
        mode="create"
        defaultValues={{
          businessId: businessOptions[0]?.id || '',
        }}
        businessOptions={businessOptions}
        onSubmit={handleSubmit}
        isSubmitting={createRevenueMutation.isPending}
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
    </DashboardLayout>
  );
};
