import { Card } from '../ui/Card.jsx';
import { Skeleton } from '../ui/Skeleton.jsx';
import { formatCurrency } from '../../utils/formatCurrency.js';

// Revenue-list hero: the totals for whatever filters are currently active,
// shown once at the top of the page instead of only on the Dashboard.
export const RevenueSummaryCards = ({ summary, isLoading, periodLabel = '' }) => (
  <Card padding="lg" className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
    <div>
      <p className="text-xs font-bold uppercase tracking-[0.08em] text-bone-500">
        Tổng doanh thu{periodLabel ? ` ${periodLabel}` : ''}
      </p>
      {isLoading ? (
        <Skeleton className="mt-4 h-10 w-56" />
      ) : (
        <p className="mt-3 font-serif text-4xl font-semibold leading-none tracking-tight text-primary-800">
          {formatCurrency(summary?.totalRevenue || 0).replace(' VND', ' đ')}
        </p>
      )}
    </div>

    <div className="flex gap-3">
      <div className="min-w-[120px] rounded-sm bg-bone-100 px-4 py-3">
        <p className="text-[10.5px] font-bold uppercase tracking-wide text-bone-500">Tiền mặt</p>
        {isLoading ? (
          <Skeleton className="mt-2 h-5 w-16" />
        ) : (
          <p className="mt-1 text-base font-bold text-bone-800">{formatCurrency(summary?.totalCash || 0).replace(' VND', 'đ')}</p>
        )}
      </div>
      <div className="min-w-[120px] rounded-sm bg-bone-100 px-4 py-3">
        <p className="text-[10.5px] font-bold uppercase tracking-wide text-bone-500">Tài khoản</p>
        {isLoading ? (
          <Skeleton className="mt-2 h-5 w-16" />
        ) : (
          <p className="mt-1 text-base font-bold text-bone-800">{formatCurrency(summary?.totalBank || 0).replace(' VND', 'đ')}</p>
        )}
      </div>
    </div>
  </Card>
);
