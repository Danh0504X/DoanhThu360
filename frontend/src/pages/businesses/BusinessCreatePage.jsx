import { useNavigate } from 'react-router-dom';
import { DashboardLayout } from '../../components/dashboard/DashboardLayout.jsx';
import { BusinessForm } from '../../components/businesses/BusinessForm.jsx';
import { useToast } from '../../components/ui/useToast.js';
import { useAuth } from '../../hooks/useAuth.js';
import { useCreateBusiness } from '../../hooks/useBusinesses.js';

export const BusinessCreatePage = () => {
  const navigate = useNavigate();
  const toast = useToast();
  const { user, logout } = useAuth();
  const createBusinessMutation = useCreateBusiness();

  const handleLogout = async () => {
    await logout();
    navigate('/login', { replace: true });
  };

  const handleSubmit = async (values) => {
    try {
      await createBusinessMutation.mutateAsync(values);
      toast.success('Tạo hộ kinh doanh thành công');
      navigate('/businesses');
    } catch (error) {
      toast.error(error.message || 'Không thể tạo hộ kinh doanh');
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
      pageDescription="Tạo mới hộ kinh doanh"
      headingTitle="Hộ kinh doanh"
      headingDescription="Tạo mới hộ kinh doanh"
    >
      <section className="rounded-[28px] border border-slate-200 bg-white px-5 py-5 shadow-sm">
        <h1 className="text-2xl font-semibold text-slate-800">Thêm hộ kinh doanh</h1>
        <p className="mt-2 text-sm text-slate-500">
          Khởi tạo hồ sơ kinh doanh mới để quản lý doanh thu và theo dõi hoạt động.
        </p>
      </section>

      <BusinessForm
        mode="create"
        isSubmitting={createBusinessMutation.isPending}
        onSubmit={handleSubmit}
        onCancel={() => navigate('/businesses')}
      />
    </DashboardLayout>
  );
};
