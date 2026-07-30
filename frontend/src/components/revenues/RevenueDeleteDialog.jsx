import { ConfirmDialog } from '../ui/ConfirmDialog.jsx';

export const RevenueDeleteDialog = ({
  isOpen,
  onClose,
  onConfirm,
  isDeleting,
  errorMessage,
}) => (
  <ConfirmDialog
    isOpen={isOpen}
    onClose={onClose}
    onConfirm={onConfirm}
    isSubmitting={isDeleting}
    errorMessage={errorMessage}
    tone="danger"
    title="Xác nhận xóa"
    description="Bạn có chắc chắn muốn xóa bản ghi doanh thu này?"
    note="Hành động này không thể hoàn tác."
    confirmLabel={isDeleting ? 'Đang xóa...' : 'Xóa'}
  />
);
