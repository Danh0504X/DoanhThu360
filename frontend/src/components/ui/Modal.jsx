export const Modal = ({
  isOpen,
  onClose,
  title,
  footer,
  children,
  className = '',
}) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-40 flex items-end justify-center bg-bone-800/35 px-0 sm:items-center sm:px-4"
      onClick={onClose}
    >
      <div
        className={[
          'w-full max-w-md overflow-hidden rounded-t-lg border border-bone-200 bg-white shadow-2 sm:rounded-lg',
          className,
        ].join(' ')}
        onClick={(event) => event.stopPropagation()}
      >
        {title ? (
          <div className="flex items-center justify-between border-b border-bone-100 px-5 py-4">
            <h3 className="text-base font-bold text-bone-800">{title}</h3>
            <button
              type="button"
              onClick={onClose}
              className="grid h-9 w-9 place-items-center rounded-sm text-bone-500 transition-brand hover:bg-bone-100 hover:text-bone-700"
              aria-label="Đóng"
            >
              <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8">
                <path d="M6 6l12 12M18 6 6 18" />
              </svg>
            </button>
          </div>
        ) : null}

        <div className="px-5 py-5">{children}</div>

        {footer ? (
          <div className="grid grid-cols-2 gap-3 border-t border-bone-100 bg-bone-50 px-5 py-4">
            {footer}
          </div>
        ) : null}
      </div>
    </div>
  );
};
