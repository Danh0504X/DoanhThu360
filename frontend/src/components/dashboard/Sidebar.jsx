import { useState } from 'react';
import { Icon } from './DashboardIcons.jsx';
import { DesktopMoreMenu } from './MoreMenu.jsx';

const navItems = [
  { id: 'dashboard', label: 'Dashboard', icon: 'dashboard', supported: true },
  { id: 'cash-flow', label: 'Cash Flow', icon: 'cash', supported: true, to: '/revenues' },
  { id: 'analytics', label: 'Analytics', icon: 'analytics', supported: true, to: '/analytics' },
  { id: 'more', label: 'More', icon: 'menu' },
];

export const Sidebar = ({ activeItem = 'dashboard', onNavigate, onExport }) => {
  const [isMoreOpen, setIsMoreOpen] = useState(false);

  return (
    <aside className="fixed inset-y-0 left-0 z-20 hidden w-[292px] border-r border-slate-200 bg-white lg:flex lg:flex-col">
      <div className="border-b border-slate-200 px-7 py-6">
        <h1 className="text-2xl font-bold tracking-normal text-teal-800">Doanh Thu 360</h1>
        <p className="mt-1 text-xs font-medium text-slate-500">Revenue Management</p>
      </div>

      <nav className="flex-1 px-4 py-8">
        <div className="space-y-2">
          {navItems.map((item) => {
            const isActive = activeItem === item.id;

            if (item.id === 'more') {
              return (
                <div key={item.id} className="relative">
                  <button
                    type="button"
                    onClick={() => setIsMoreOpen(!isMoreOpen)}
                    className={`flex w-full items-center gap-4 rounded-none px-5 py-4 text-left text-sm font-semibold transition ${
                      isActive || isMoreOpen
                        ? 'bg-[#d7e2ff] text-slate-800'
                        : 'text-slate-600 hover:bg-slate-50 hover:text-teal-800'
                    }`}
                  >
                    <Icon name={item.icon} className={`h-5 w-5 ${isActive || isMoreOpen ? 'text-teal-800' : 'text-slate-500'}`} />
                    <span>{item.label}</span>
                  </button>
                  <DesktopMoreMenu isOpen={isMoreOpen} onClose={() => setIsMoreOpen(false)} />
                </div>
              );
            }

            return (
              <button
                key={item.id}
                type="button"
                onClick={() => onNavigate(item)}
                className={`flex w-full items-center gap-4 rounded-none px-5 py-4 text-left text-sm font-semibold transition ${
                  isActive
                    ? 'bg-[#d7e2ff] text-slate-800'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-teal-800'
                }`}
              >
                <Icon name={item.icon} className={`h-5 w-5 ${isActive ? 'text-teal-800' : 'text-slate-500'}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
      </div>
    </nav>

    <div className="px-5 py-7">
      <button
        type="button"
        onClick={onExport}
        className="flex w-full items-center justify-center gap-3 bg-teal-700 px-5 py-4 text-sm font-bold text-white shadow-sm transition hover:bg-teal-800"
      >
        <Icon name="download" className="h-5 w-5" />
        Export Report
      </button>
    </div>
    </aside>
  );
};
