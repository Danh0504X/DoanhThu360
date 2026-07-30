import { useNavigate } from 'react-router-dom';
import { DashboardLayout } from '../dashboard/DashboardLayout.jsx';
import { Icon } from '../dashboard/DashboardIcons.jsx';

/**
 * Shared chrome for the focused account sub-pages (change password, verify email):
 * a mobile sticky header with a back button and a desktop breadcrumb + back button.
 */
export const AccountActionLayout = ({ title, breadcrumbLabel, children }) => {
  const navigate = useNavigate();
  const handleBack = () => navigate('/account');

  return (
    <>
      {/* Mobile layout */}
      <div className="min-h-screen bg-[#F8F9FA] pb-24 lg:hidden">
        <header className="sticky top-0 z-20 flex h-14 items-center justify-between border-b border-bone-200 bg-white px-2">
          <button
            type="button"
            onClick={handleBack}
            className="inline-flex h-10 items-center gap-1.5 rounded-md px-2 text-sm font-bold text-primary-600"
            aria-label="Quay lại"
          >
            <Icon name="arrowLeft" className="h-5 w-5" />
            Quay lại
          </button>
          <p className="text-sm font-bold text-primary-600">{title}</p>
          <span className="h-10 w-10" />
        </header>

        <main className="px-4 pt-5">{children}</main>
      </div>

      {/* Desktop layout */}
      <DashboardLayout activeNav="more" onProfileClick={() => navigate('/account')} desktopOnly>
        <div className="mx-auto max-w-[640px]">
          <div className="mb-6 flex items-center justify-between gap-4">
            <nav className="flex items-center gap-3 text-xs font-bold text-bone-500">
              <button type="button" onClick={() => navigate('/dashboard')} className="hover:text-primary-600">
                Dashboard
              </button>
              <span>&gt;</span>
              <button type="button" onClick={() => navigate('/account')} className="hover:text-primary-600">
                Tài khoản
              </button>
              <span>&gt;</span>
              <span className="text-primary-600">{breadcrumbLabel}</span>
            </nav>

            <button
              type="button"
              onClick={handleBack}
              className="inline-flex h-10 items-center gap-2 rounded-md border border-bone-200 bg-white px-4 text-sm font-bold text-bone-600 transition-brand hover:bg-bone-50"
            >
              <Icon name="arrowLeft" className="h-4 w-4" />
              Quay lại
            </button>
          </div>

          {children}
        </div>
      </DashboardLayout>
    </>
  );
};
