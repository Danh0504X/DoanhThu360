import { useNavigate, useParams } from 'react-router-dom';
import { BusinessForm } from '../../components/businesses/BusinessForm.jsx';
import { Card } from '../../components/ui/Card.jsx';
import { DashboardLayout } from '../../components/dashboard/DashboardLayout.jsx';
import { Icon } from '../../components/dashboard/DashboardIcons.jsx';
import { FormError } from '../../components/ui/FormError.jsx';
import { useToast } from '../../components/ui/useToast.js';
import { useBusiness, useUpdateBusiness } from '../../hooks/useBusinesses.js';

export const BusinessEditPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const toast = useToast();
  const businessQuery = useBusiness(id);
  const updateBusinessMutation = useUpdateBusiness();

  const handleCancel = () => {
    if (window.history.length > 1) {
      navigate(-1);
      return;
    }
    navigate('/businesses');
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

  const renderForm = () => {
    if (businessQuery.isLoading) {
      return (
        <Card className="px-6 py-12 text-center text-sm text-bone-500">
          Đang tải thông tin hộ kinh doanh...
        </Card>
      );
    }

    if (businessQuery.error) {
      return <FormError message={businessQuery.error.message} />;
    }

    return (
      <BusinessForm
        mode="edit"
        defaultValues={businessQuery.data}
        isSubmitting={updateBusinessMutation.isPending}
        onSubmit={handleSubmit}
        onCancel={handleCancel}
      />
    );
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
            Chỉnh sửa hộ kinh doanh
          </p>
        </header>

        <main className="px-4 pt-5">{renderForm()}</main>
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
            <span className="text-primary-600">Chỉnh sửa</span>
          </nav>

          {renderForm()}
        </div>
      </DashboardLayout>
    </>
  );
};
