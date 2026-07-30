import { ConfirmDialog } from '../ui/ConfirmDialog.jsx';

export const BusinessDeleteDialog = ({
  business,
  isOpen,
  isSubmitting,
  onClose,
  onConfirm,
}) => {
  if (!business) return null;

  const isActive = business.status === 'active';

  return (
    <ConfirmDialog
      isOpen={isOpen}
      onClose={onClose}
      onConfirm={onConfirm}
      isSubmitting={isSubmitting}
      tone={isActive ? 'danger' : 'primary'}
      title={isActive ? 'Ngừng hoạt động hộ kinh doanh?' : 'Kích hoạt lại hộ kinh doanh?'}
      description={
        isActive
          ? `Hộ kinh doanh "${business.businessName}" sẽ được chuyển sang trạng thái ngừng hoạt động.`
          : `Hộ kinh doanh "${business.businessName}" sẽ được kích hoạt lại trong hệ thống.`
      }
      confirmLabel={isActive ? 'Ngừng hoạt động' : 'Kích hoạt lại'}
    />
  );
};
