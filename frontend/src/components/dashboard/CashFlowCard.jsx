import { Icon } from './DashboardIcons.jsx';
import { formatCurrency } from '../../utils/formatCurrency.js';

const formatSignedCurrency = (value) => {
  const amount = Number(value || 0);
  const sign = amount > 0 ? '+' : amount < 0 ? '-' : '';

  return `${sign}${formatCurrency(Math.abs(amount)).replace(' VND', ' đ')}`;
};

export const CashFlowCard = ({ title, icon, balance = 0, transactions = [], isLoading }) => (
  <section className="border border-slate-200 bg-white p-7">
    <div className="flex items-center gap-3">
      <Icon name={icon} className="h-5 w-5 text-teal-800" />
      <h3 className="text-lg font-bold text-slate-950">{title}</h3>
    </div>

    <div className="mt-5">
      <p className="text-sm font-medium text-slate-500">Số dư hiện tại</p>
      {isLoading ? (
        <div className="mt-2 h-9 w-56 animate-pulse bg-slate-100" />
      ) : (
        <p className="mt-1 text-4xl font-bold tracking-normal text-slate-950">
          {formatCurrency(balance).replace(' VND', '')}
          <span className="ml-2 text-sm font-medium text-teal-800">đ</span>
        </p>
      )}
    </div>

    <div className="mt-8 border border-slate-200 bg-slate-50 px-5 py-4">
      <p className="text-xs font-semibold text-slate-500">Giao dịch gần nhất</p>

      {isLoading ? (
        <div className="mt-4 space-y-3">
          <div className="h-4 animate-pulse bg-slate-200" />
          <div className="h-4 w-5/6 animate-pulse bg-slate-200" />
        </div>
      ) : transactions.length ? (
        <div className="mt-4 space-y-3">
          {transactions.slice(0, 3).map((item) => {
            const amount = Number(item.amount || 0);

            return (
              <div key={item.id} className="flex items-center justify-between gap-4 text-sm">
                <span className="min-w-0 truncate font-medium text-slate-700">{item.content || 'Không có mô tả'}</span>
                <span className={`shrink-0 font-bold ${amount < 0 ? 'text-red-600' : 'text-teal-800'}`}>
                  {formatSignedCurrency(amount)}
                </span>
              </div>
            );
          })}
        </div>
      ) : (
        <p className="mt-4 text-sm font-medium text-slate-500">Chưa có dữ liệu</p>
      )}
    </div>
  </section>
);
