import { formatCurrency } from '../../utils/formatCurrency.js';
import { formatDate } from '../../utils/formatDate.js';

const getPaymentType = (row) => {
  const hasCash = Number(row.cashAmount || 0) > 0;
  const hasBank = Number(row.bankAmount || 0) > 0;

  if (hasCash && hasBank) return 'HỖN HỢP';
  if (hasCash) return 'TIỀN MẶT';
  if (hasBank) return 'TÀI KHOẢN';
  return '--';
};

export const RecentActivitiesTable = ({ rows = [], isLoading, onViewAll, onRowClick }) => (
  <section className="border border-slate-200 bg-white">
    <div className="flex items-center justify-between gap-4 border-b border-slate-200 px-7 py-5">
      <h2 className="text-lg font-bold text-slate-950">Hoạt động gần đây</h2>
      <button type="button" onClick={onViewAll} className="text-sm font-bold text-teal-800 hover:text-teal-700">
        Xem tất cả
      </button>
    </div>

    {isLoading ? (
      <div className="space-y-3 p-7">
        <div className="h-5 animate-pulse bg-slate-100" />
        <div className="h-5 animate-pulse bg-slate-100" />
        <div className="h-5 w-3/4 animate-pulse bg-slate-100" />
      </div>
    ) : rows.length ? (
      <div className="overflow-x-auto">
        <table className="min-w-full border-collapse text-left">
          <thead>
            <tr className="bg-slate-50 text-xs font-bold uppercase text-slate-500">
              <th className="px-7 py-4">Ngày</th>
              <th className="px-7 py-4">Mô tả</th>
              <th className="px-7 py-4">Loại</th>
              <th className="px-7 py-4 text-right">Số tiền</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {rows.slice(0, 5).map((row) => {
              const amount = Number(row.totalAmount || 0);
              const amountPrefix = amount > 0 ? '+' : amount < 0 ? '-' : '';

              return (
                <tr
                  key={row.id}
                  onClick={() => onRowClick?.(row)}
                  className="cursor-pointer text-sm transition hover:bg-slate-50"
                >
                  <td className="whitespace-nowrap px-7 py-5 text-slate-600">
                    {formatDate(row.date)}
                  </td>
                  <td className="px-7 py-5 font-bold text-slate-950">{row.content || 'Không có mô tả'}</td>
                  <td className="px-7 py-5">
                    <span className="bg-slate-200 px-2 py-1 text-[11px] font-bold text-slate-600">
                      {getPaymentType(row)}
                    </span>
                  </td>
                  <td className={`whitespace-nowrap px-7 py-5 text-right font-bold ${amount < 0 ? 'text-red-600' : 'text-teal-800'}`}>
                    {amountPrefix}{formatCurrency(Math.abs(amount)).replace(' VND', ' đ')}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    ) : (
      <div className="px-7 py-12 text-center text-sm font-medium text-slate-500">Chưa có dữ liệu</div>
    )}
  </section>
);
