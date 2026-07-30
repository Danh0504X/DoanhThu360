import { DashboardHeader } from './DashboardHeader.jsx';
import { Icon } from './DashboardIcons.jsx';
import { Sidebar } from './Sidebar.jsx';
import { useDashboardShell } from '../../hooks/useDashboardShell.js';

export const DashboardLayout = ({
  activeNav = 'dashboard',
  keyword = '',
  onKeywordChange = () => {},
  onNavigate,
  onExport,
  onProfileClick,
  onUnsupportedAction,
  desktopOnly = false,
  children,
}) => {
  const shell = useDashboardShell();

  const unsupportedFallback = onUnsupportedAction || shell.handleUnsupportedAction;
  const handleNavigate = onNavigate || shell.handleNavigate;
  const handleExport = onExport || unsupportedFallback;
  const handleProfileClick = onProfileClick || shell.handleProfileClick;

  return (
    <>
      <div className={`${desktopOnly ? 'hidden' : 'min-h-screen bg-bone-50 px-4 py-4 pb-24'} lg:hidden`}>
        {!desktopOnly ? children : null}
      </div>

      <div className="hidden min-h-screen bg-bone-50 lg:block">
        <Sidebar activeItem={activeNav} onNavigate={handleNavigate} onExport={handleExport} />

        <div className="min-h-screen pl-[292px]">
          <DashboardHeader
            keyword={keyword}
            onKeywordChange={onKeywordChange}
            onUnsupportedAction={unsupportedFallback}
            onProfileClick={handleProfileClick}
          />

          <main className="px-8 py-8">
            {children}
          </main>
        </div>

        <button
          type="button"
          onClick={() => handleNavigate({ id: 'add-transaction', supported: true, to: '/revenues/create' })}
          className="fixed bottom-8 right-8 z-30 grid h-16 w-16 place-items-center rounded-lg bg-primary-600 text-white shadow-2 transition-brand hover:scale-[1.04] hover:bg-primary-700 active:scale-[0.97]"
          aria-label="Thêm giao dịch"
          title="Thêm giao dịch"
        >
          <Icon name="plus" className="h-8 w-8" />
        </button>
      </div>
    </>
  );
};
