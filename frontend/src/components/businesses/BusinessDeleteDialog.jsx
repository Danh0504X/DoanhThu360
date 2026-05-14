import { Button } from '../ui/Button.jsx';

export const BusinessDeleteDialog = ({
  business,
  isOpen,
  isSubmitting,
  onClose,
  onConfirm,
}) => {
  if (!isOpen || !business) return null;

  const isActive = business.status === 'active';

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-slate-900/30 px-4">
      <div className="w-full max-w-md rounded-[28px] bg-white p-6 shadow-2xl">
        <h2 className="text-xl font-semibold text-slate-800">
          {isActive ? 'Ngừng hoạt động hộ kinh doanh?' : 'Kích hoạt lại hộ kinh doanh?'}
        </h2>
        <p className="mt-3 text-sm leading-6 text-slate-500">
          {isActive
            ? `Hộ kinh doanh "${business.businessName}" sẽ được chuyển sang trạng thái ngừng hoạt động.`
            : `Hộ kinh doanh "${business.businessName}" sẽ được kích hoạt lại trong hệ thống.`}
        </p>

        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-end">
          <Button type="button" variant="secondary" onClick={onClose}>
            Hủy
          </Button>
          <Button
            type="button"
            variant={isActive ? 'danger' : 'primary'}
            onClick={onConfirm}
            isLoading={isSubmitting}
          >
            {isActive ? 'Ngừng hoạt động' : 'Kích hoạt lại'}
          </Button>
        </div>
      </div>
    </div>
  );
};
