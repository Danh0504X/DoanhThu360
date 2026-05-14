import { useCallback, useMemo, useState } from 'react';
import { ToastContext } from './toastContext.js';

let toastId = 0;

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const removeToast = useCallback((id) => {
    setToasts((currentToasts) => currentToasts.filter((toast) => toast.id !== id));
  }, []);

  const pushToast = useCallback((message, type = 'success') => {
    const id = `toast-${toastId += 1}`;
    setToasts((currentToasts) => [...currentToasts, { id, message, type }]);
    window.setTimeout(() => removeToast(id), 3200);
  }, [removeToast]);

  const value = useMemo(() => ({
    success: (message) => pushToast(message, 'success'),
    error: (message) => pushToast(message, 'error'),
    info: (message) => pushToast(message, 'info'),
  }), [pushToast]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className="pointer-events-none fixed right-4 top-4 z-50 flex w-full max-w-sm flex-col gap-3">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`pointer-events-auto rounded-2xl border px-4 py-3 shadow-lg ${
              toast.type === 'error'
                ? 'border-red-200 bg-white text-red-700'
                : toast.type === 'info'
                  ? 'border-slate-200 bg-white text-slate-700'
                  : 'border-teal-200 bg-white text-teal-800'
            }`}
          >
            <div className="flex items-start justify-between gap-3">
              <p className="text-sm font-medium">{toast.message}</p>
              <button
                type="button"
                onClick={() => removeToast(toast.id)}
                className="text-xs text-slate-400 transition hover:text-slate-600"
              >
                Đóng
              </button>
            </div>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};
