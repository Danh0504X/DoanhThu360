import { useNavigate } from 'react-router-dom';
import { DashboardHeader } from './DashboardHeader.jsx';
import { Icon } from './DashboardIcons.jsx';
import { Sidebar } from './Sidebar.jsx';

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
  const navigate = useNavigate();

  const unsupportedFallback = () => {
    if (onUnsupportedAction) {
      onUnsupportedAction();
      return;
    }

    window.alert('Chức năng này chưa được backend hỗ trợ.');
  };

  const defaultNavigate = (item) => {
    if (item?.id === 'dashboard') {
      navigate('/dashboard');
      return;
    }

    if (item?.id === 'cash-flow') {
      navigate('/revenues');
      return;
    }

    if (item?.to) {
      navigate(item.to);
      return;
    }

    unsupportedFallback();
  };

  const handleNavigate = onNavigate || defaultNavigate;
  const handleExport = onExport || unsupportedFallback;
  const handleProfileClick = onProfileClick || (() => navigate('/account'));

  return (
    <>
      <div className={`${desktopOnly ? 'hidden' : 'min-h-screen bg-slate-50 px-4 py-4 pb-24'} lg:hidden`}>
        {!desktopOnly ? children : null}
      </div>

      <div className="hidden min-h-screen bg-slate-50 lg:block">
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
          className="fixed bottom-8 right-8 z-30 grid h-16 w-16 place-items-center rounded-lg bg-teal-700 text-white shadow-xl shadow-teal-900/20 transition hover:bg-teal-800"
          aria-label="Thêm giao dịch"
          title="Thêm giao dịch"
        >
          <Icon name="plus" className="h-8 w-8" />
        </button>
      </div>
    </>
  );
};
