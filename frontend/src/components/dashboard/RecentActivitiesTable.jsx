import { Card } from '../ui/Card.jsx';
import { Skeleton } from '../ui/Skeleton.jsx';
import { formatCurrency } from '../../utils/formatCurrency.js';
import { formatDate } from '../../utils/formatDate.js';
import { getPaymentType } from '../../utils/paymentType.js';

export const RecentActivitiesTable = ({ rows = [], isLoading, onViewAll, onRowClick }) => (
  <Card padding="none">
    <div className="flex items-center justify-between gap-4 border-b border-bone-200 px-7 py-5">
      <h2 className="text-lg font-bold text-bone-800">Hoạt động gần đây</h2>
      <button type="button" onClick={onViewAll} className="text-sm font-bold text-primary-800 hover:text-primary-700">
        Xem tất cả
      </button>
    </div>

    {isLoading ? (
      <div className="space-y-3 p-7">
        <Skeleton className="h-5" />
        <Skeleton className="h-5" />
        <Skeleton className="h-5 w-3/4" />
      </div>
    ) : rows.length ? (
      <div className="overflow-x-auto">
        <table className="min-w-full border-collapse text-left">
          <thead>
            <tr className="bg-bone-50 text-xs font-bold uppercase text-bone-500">
              <th className="px-7 py-4">Ngày</th>
              <th className="px-7 py-4">Mô tả</th>
              <th className="px-7 py-4">Loại</th>
              <th className="px-7 py-4 text-right">Số tiền</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-bone-100">
            {rows.slice(0, 5).map((row) => {
              const amount = Number(row.totalAmount || 0);
              const amountPrefix = amount > 0 ? '+' : amount < 0 ? '-' : '';

              return (
                <tr
                  key={row.id}
                  onClick={() => onRowClick?.(row)}
                  className="cursor-pointer text-sm transition-brand hover:bg-bone-50"
                >
                  <td className="whitespace-nowrap px-7 py-5 text-bone-600">
                    {formatDate(row.date)}
                  </td>
                  <td className="px-7 py-5 font-bold text-bone-800">{row.content || 'Không có mô tả'}</td>
                  <td className="px-7 py-5">
                    <span className="rounded-sm bg-bone-200 px-2 py-1 text-[11px] font-bold text-bone-600">
                      {getPaymentType(row)}
                    </span>
                  </td>
                  <td className={`whitespace-nowrap px-7 py-5 text-right font-bold ${amount < 0 ? 'text-accent-red' : 'text-primary-800'}`}>
                    {amountPrefix}{formatCurrency(Math.abs(amount)).replace(' VND', ' đ')}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    ) : (
      <div className="px-7 py-12 text-center text-sm font-medium text-bone-500">Chưa có dữ liệu</div>
    )}
  </Card>
);
