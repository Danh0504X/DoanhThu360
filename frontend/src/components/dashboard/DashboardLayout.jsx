import { Header } from './Header.jsx';
import { MobileBottomNav } from './MobileBottomNav.jsx';
import { Sidebar } from './Sidebar.jsx';

export const DashboardLayout = ({
  userName,
  businessOptions,
  selectedBusiness,
  onBusinessChange,
  onLogout,
  activeNav = 'overview',
  pageTitle,
  pageDescription,
  headingTitle,
  headingDescription,
  children,
}) => (
  <div className="min-h-screen bg-slate-50 px-4 py-4 sm:px-5 lg:px-6">
    <div className="mx-auto flex max-w-7xl gap-6">
      <Sidebar onLogout={onLogout} activeItem={activeNav} />

      <main className="min-w-0 flex-1 pb-24 lg:pb-6">
        <div className="space-y-4 lg:space-y-6">
          <Header
            userName={userName}
            businessOptions={businessOptions}
            selectedBusiness={selectedBusiness}
            onBusinessChange={onBusinessChange}
            onLogout={onLogout}
            pageTitle={pageTitle}
            pageDescription={pageDescription}
            headingTitle={headingTitle}
            headingDescription={headingDescription}
          />
          {children}
        </div>
      </main>
    </div>

    <MobileBottomNav activeItem={activeNav} />
  </div>
);
