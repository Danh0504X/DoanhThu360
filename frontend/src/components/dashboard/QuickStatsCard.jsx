import { Icon } from './DashboardIcons.jsx';
import { Card } from '../ui/Card.jsx';
import { Skeleton } from '../ui/Skeleton.jsx';
import { formatCurrency } from '../../utils/formatCurrency.js';

export const QuickStatsCard = ({ orderCount = 0, isLoading }) => {
  const rows = [
    { label: 'Số đơn hàng', value: new Intl.NumberFormat('vi-VN').format(Number(orderCount || 0)), icon: 'briefcase' },
    { label: 'Khách hàng mới', value: '--', icon: 'users' },
    { label: 'Lợi nhuận gộp', value: '--', icon: 'wallet' },
  ];

  return (
    <Card padding="lg">
      <h2 className="text-2xl font-bold text-bone-800">Thống kê nhanh</h2>

      <div className="mt-6 divide-y divide-bone-200">
        {rows.map((row) => (
          <div key={row.label} className="flex items-center justify-between gap-5 py-6 first:pt-0 last:pb-0">
            <div>
              <p className="text-sm font-medium text-bone-500">{row.label}</p>
              {isLoading ? (
                <Skeleton className="mt-2 h-7 w-24" />
              ) : (
                <p className="mt-1 text-2xl font-bold text-bone-800">
                  {row.label === 'Lợi nhuận gộp' && row.value !== '--' ? formatCurrency(row.value) : row.value}
                </p>
              )}
            </div>
            <span className="grid h-10 w-10 place-items-center rounded-sm bg-primary-50 text-primary-800">
              <Icon name={row.icon} className="h-5 w-5" />
            </span>
          </div>
        ))}
      </div>
    </Card>
  );
};
