import { useNavigate, useParams } from 'react-router-dom';
import { DashboardLayout } from '../../components/dashboard/DashboardLayout.jsx';
import { BusinessForm } from '../../components/businesses/BusinessForm.jsx';
import { FormError } from '../../components/ui/FormError.jsx';
import { useToast } from '../../components/ui/useToast.js';
import { useAuth } from '../../hooks/useAuth.js';
import { useBusiness, useUpdateBusiness } from '../../hooks/useBusinesses.js';

export const BusinessEditPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const toast = useToast();
  const { user, logout } = useAuth();
  const businessQuery = useBusiness(id);
  const updateBusinessMutation = useUpdateBusiness();

  const handleLogout = async () => {
    await logout();
    navigate('/login', { replace: true });
  };

  const handleSubmit = async (values) => {
    try {
      await updateBusinessMutation.mutateAsync({ id, data: values });
      toast.success('Cập nhật hộ kinh doanh thành công');
      navigate('/businesses');
    } catch (error) {
      toast.error(error.message || 'Không thể cập nhật hộ kinh doanh');
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
      pageDescription="Chỉnh sửa hộ kinh doanh"
      headingTitle="Hộ kinh doanh"
      headingDescription="Cập nhật thông tin hộ kinh doanh"
    >
      <section className="rounded-[28px] border border-slate-200 bg-white px-5 py-5 shadow-sm">
        <h1 className="text-2xl font-semibold text-slate-800">Chỉnh sửa hộ kinh doanh</h1>
        <p className="mt-2 text-sm text-slate-500">
          Điều chỉnh thông tin kinh doanh để đồng bộ với dữ liệu hiện tại.
        </p>
      </section>

      {businessQuery.isLoading ? (
        <section className="rounded-[28px] border border-slate-200 bg-white px-6 py-12 text-center text-sm text-slate-500 shadow-sm">
          Đang tải thông tin hộ kinh doanh...
        </section>
      ) : businessQuery.error ? (
        <FormError message={businessQuery.error.message} />
      ) : (
        <BusinessForm
          mode="edit"
          defaultValues={businessQuery.data}
          isSubmitting={updateBusinessMutation.isPending}
          onSubmit={handleSubmit}
          onCancel={() => navigate('/businesses')}
        />
      )}
    </DashboardLayout>
  );
};
