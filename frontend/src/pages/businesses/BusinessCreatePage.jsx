import { useNavigate } from 'react-router-dom';
import { BusinessForm } from '../../components/businesses/BusinessForm.jsx';
import { DashboardLayout } from '../../components/dashboard/DashboardLayout.jsx';
import { Icon } from '../../components/dashboard/DashboardIcons.jsx';
import { useToast } from '../../components/ui/useToast.js';
import { useCreateBusiness } from '../../hooks/useBusinesses.js';

export const BusinessCreatePage = () => {
  const navigate = useNavigate();
  const toast = useToast();
  const createBusinessMutation = useCreateBusiness();

  const handleCancel = () => {
    if (window.history.length > 1) {
      navigate(-1);
      return;
    }
    navigate('/businesses');
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
    <>
      {/* Mobile layout */}
      <div className="min-h-screen bg-bone-50 pb-10 lg:hidden">
        <header className="sticky top-0 z-20 flex h-14 items-center border-b border-bone-200 bg-white px-2">
          <button
            type="button"
            onClick={handleCancel}
            className="inline-flex h-10 items-center gap-1.5 rounded-md px-2 text-sm font-bold text-primary-600 transition-brand hover:bg-bone-100"
            aria-label="Quay lại"
          >
            <Icon name="arrowLeft" className="h-5 w-5" />
            Quay lại
          </button>
          <p className="pointer-events-none absolute left-1/2 -translate-x-1/2 text-sm font-bold text-primary-600">
            Thêm hộ kinh doanh
          </p>
        </header>

        <main className="px-4 pt-5">
          <BusinessForm
            mode="create"
            isSubmitting={createBusinessMutation.isPending}
            onSubmit={handleSubmit}
            onCancel={handleCancel}
          />
        </main>
      </div>

      {/* Desktop layout */}
      <DashboardLayout activeNav="more" desktopOnly>
        <div className="mx-auto max-w-[760px] space-y-6">
          <nav className="flex items-center gap-3 text-xs font-bold text-bone-500">
            <button type="button" onClick={() => navigate('/dashboard')} className="transition-brand hover:text-primary-600">
              Dashboard
            </button>
            <span>&gt;</span>
            <button type="button" onClick={() => navigate('/businesses')} className="transition-brand hover:text-primary-600">
              Hộ kinh doanh
            </button>
            <span>&gt;</span>
            <span className="text-primary-600">Thêm mới</span>
          </nav>

          <BusinessForm
            mode="create"
            isSubmitting={createBusinessMutation.isPending}
            onSubmit={handleSubmit}
            onCancel={handleCancel}
          />
        </div>
      </DashboardLayout>
    </>
  );
};
