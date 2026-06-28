import { Icon } from './DashboardIcons.jsx';
import { formatCurrency } from '../../utils/formatCurrency.js';

export const QuickStatsCard = ({ orderCount = 0, isLoading }) => {
  const rows = [
    { label: 'Số đơn hàng', value: new Intl.NumberFormat('vi-VN').format(Number(orderCount || 0)), icon: 'briefcase' },
    { label: 'Khách hàng mới', value: '--', icon: 'users' },
    { label: 'Lợi nhuận gộp', value: '--', icon: 'wallet' },
  ];

  return (
    <section className="border border-slate-200 bg-white p-7">
      <h2 className="text-2xl font-bold text-slate-950">Thống kê nhanh</h2>

      <div className="mt-6 divide-y divide-slate-200">
        {rows.map((row) => (
          <div key={row.label} className="flex items-center justify-between gap-5 py-6 first:pt-0 last:pb-0">
            <div>
              <p className="text-sm font-medium text-slate-500">{row.label}</p>
              {isLoading ? (
                <div className="mt-2 h-7 w-24 animate-pulse bg-slate-100" />
              ) : (
                <p className="mt-1 text-2xl font-bold text-slate-950">
                  {row.label === 'Lợi nhuận gộp' && row.value !== '--' ? formatCurrency(row.value) : row.value}
                </p>
              )}
            </div>
            <span className="grid h-10 w-10 place-items-center bg-teal-50 text-teal-800">
              <Icon name={row.icon} className="h-5 w-5" />
            </span>
          </div>
        ))}
      </div>
    </section>
  );
};
