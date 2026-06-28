import { useEffect, useRef, useState } from 'react';
import { Icon } from './DashboardIcons.jsx';

/**
 * Notification bell with a lightweight popover. The backend has no notifications
 * feed yet, so this shows a friendly empty state instead of a dead "unsupported"
 * toast — and is ready to render real items once an endpoint exists.
 */
export const NotificationBell = ({ triggerClassName = '', items = [] }) => {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    if (!isOpen) return undefined;

    const handleClickOutside = (event) => {
      if (ref.current && !ref.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setIsOpen((open) => !open)}
        className={triggerClassName}
        aria-label="Thông báo"
        aria-expanded={isOpen}
      >
        <Icon name="bell" className="h-5 w-5" />
        {items.length > 0 ? (
          <span className="absolute right-1.5 top-1.5 grid h-4 min-w-4 place-items-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white">
            {items.length > 9 ? '9+' : items.length}
          </span>
        ) : null}
      </button>

      {isOpen ? (
        <div className="absolute right-0 z-50 mt-2 w-72 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl shadow-slate-900/10">
          <div className="border-b border-slate-100 px-4 py-3">
            <p className="text-sm font-bold text-slate-800">Thông báo</p>
          </div>

          {items.length ? (
            <ul className="max-h-72 divide-y divide-slate-100 overflow-y-auto">
              {items.map((item) => (
                <li key={item.id} className="px-4 py-3">
                  <p className="text-sm font-semibold text-slate-800">{item.title}</p>
                  {item.description ? (
                    <p className="mt-0.5 text-xs text-slate-500">{item.description}</p>
                  ) : null}
                </li>
              ))}
            </ul>
          ) : (
            <div className="flex flex-col items-center gap-2 px-4 py-8 text-center">
              <span className="grid h-12 w-12 place-items-center rounded-full bg-slate-100 text-slate-400">
                <Icon name="bell" className="h-6 w-6" />
              </span>
              <p className="text-sm font-medium text-slate-600">Chưa có thông báo mới</p>
              <p className="text-xs text-slate-400">
                Các cập nhật về doanh thu và tài khoản sẽ xuất hiện ở đây.
              </p>
            </div>
          )}
        </div>
      ) : null}
    </div>
  );
};
