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
      <div className="w-full max-w-md rounded-lg border border-slate-200 bg-white p-6 shadow-xl">
        <h2 className="text-xl font-bold text-slate-900">
          {isActive ? 'Ngừng hoạt động hộ kinh doanh?' : 'Kích hoạt lại hộ kinh doanh?'}
        </h2>
        <p className="mt-3 text-sm font-medium leading-6 text-slate-500">
          {isActive
            ? `Hộ kinh doanh "${business.businessName}" sẽ được chuyển sang trạng thái ngừng hoạt động.`
            : `Hộ kinh doanh "${business.businessName}" sẽ được kích hoạt lại trong hệ thống.`}
        </p>

        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={onClose}
            className="h-11 rounded-md border border-slate-200 bg-white px-6 text-sm font-bold text-slate-600 transition hover:bg-slate-50"
          >
            Hủy
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isSubmitting}
            className={`inline-flex h-11 items-center justify-center gap-2 rounded-md px-6 text-sm font-bold transition disabled:cursor-not-allowed disabled:opacity-70 ${
              isActive
                ? 'border border-red-200 bg-red-50 text-red-600 hover:bg-red-100'
                : 'bg-[#2D7A7F] text-white hover:bg-[#25696d]'
            }`}
          >
            {isSubmitting ? <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-r-transparent" /> : null}
            {isActive ? 'Ngừng hoạt động' : 'Kích hoạt lại'}
          </button>
        </div>
      </div>
    </div>
  );
};
