import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Icon } from './DashboardIcons.jsx';
import { useAuth } from '../../hooks/useAuth.js';

/**
 * Shared mobile top header for the main pages (dashboard, revenues, businesses,
 * analytics, account). No back button — those pages use the bottom navigation.
 * Left: app logo (placeholder). Center: page title. Right: settings dropdown.
 */
export const MobileTopHeader = ({ title }) => {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    if (!isOpen) return undefined;

    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  const handleLogout = async () => {
    setIsOpen(false);
    try {
      await logout();
    } catch {
      // Even if the request fails, drop the local session and go to login.
    }
    navigate('/login', { replace: true });
  };

  return (
    <header className="sticky top-0 z-30 flex h-14 items-center justify-between border-b border-slate-200 bg-white px-4 lg:hidden">
      {/* Left: logo placeholder */}
      <div className="flex items-center gap-2">
        <span className="grid h-9 w-9 place-items-center rounded-lg bg-teal-700 text-sm font-bold text-white">
          DT
        </span>
      </div>

      {/* Center: title */}
      <p className="pointer-events-none absolute left-1/2 -translate-x-1/2 text-base font-bold text-slate-900">
        {title}
      </p>

      {/* Right: settings dropdown */}
      <div ref={menuRef} className="relative">
        <button
          type="button"
          onClick={() => setIsOpen((open) => !open)}
          className="grid h-10 w-10 place-items-center text-slate-600 transition hover:text-teal-800"
          aria-label="Cài đặt"
          aria-expanded={isOpen}
        >
          <Icon name="settings" className="h-5 w-5" />
        </button>

        {isOpen ? (
          <div className="absolute right-0 top-full mt-1 w-44 overflow-hidden rounded-lg border border-slate-200 bg-white py-1 shadow-xl shadow-slate-900/10">
            <button
              type="button"
              onClick={() => {
                setIsOpen(false);
                navigate('/account');
              }}
              className="flex w-full items-center gap-3 px-4 py-2.5 text-left text-sm font-medium text-slate-700 transition hover:bg-slate-50"
            >
              <Icon name="user" className="h-4 w-4" />
              Cá nhân
            </button>
            <button
              type="button"
              onClick={handleLogout}
              className="flex w-full items-center gap-3 px-4 py-2.5 text-left text-sm font-medium text-red-600 transition hover:bg-red-50"
            >
              <Icon name="logout" className="h-4 w-4" />
              Đăng xuất
            </button>
          </div>
        ) : null}
      </div>
    </header>
  );
};
