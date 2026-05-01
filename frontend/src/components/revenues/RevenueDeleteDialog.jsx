import { Button } from '../ui/Button.jsx';
import { FormError } from '../ui/FormError.jsx';

export const RevenueDeleteDialog = ({
  isOpen,
  onClose,
  onConfirm,
  isDeleting,
  errorMessage,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-slate-900/35 px-4 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-[28px] border border-slate-200 bg-white p-6 shadow-xl">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-red-50 text-red-600">
          <svg className="h-7 w-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
            <path d="M12 9v4" />
            <path d="M12 17h.01" />
            <path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.72 3h16.92a2 2 0 0 0 1.72-3L13.71 3.86a2 2 0 0 0-3.42 0Z" />
          </svg>
        </div>

        <div className="mt-5 text-center">
          <h3 className="text-xl font-semibold text-slate-800">Xác nhận xóa</h3>
          <p className="mt-3 text-sm leading-6 text-slate-500">
            Bạn có chắc chắn muốn xóa bản ghi doanh thu này?
          </p>
          <p className="mt-3 rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-600">
            Hành động này không thể hoàn tác.
          </p>
        </div>

        <FormError message={errorMessage} className="mt-4" />

        <div className="mt-6 grid grid-cols-2 gap-3">
          <Button type="button" variant="secondary" onClick={onClose} disabled={isDeleting}>
            Hủy
          </Button>
          <Button type="button" variant="danger" onClick={onConfirm} isLoading={isDeleting} disabled={isDeleting}>
            {isDeleting ? 'Đang xóa...' : 'Xóa'}
          </Button>
        </div>
      </div>
    </div>
  );
};
