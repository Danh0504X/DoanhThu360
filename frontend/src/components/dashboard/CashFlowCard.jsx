import { Icon } from './DashboardIcons.jsx';
import { Card } from '../ui/Card.jsx';
import { Skeleton } from '../ui/Skeleton.jsx';
import { formatCurrency } from '../../utils/formatCurrency.js';

const formatSignedCurrency = (value) => {
  const amount = Number(value || 0);
  const sign = amount > 0 ? '+' : amount < 0 ? '-' : '';

  return `${sign}${formatCurrency(Math.abs(amount)).replace(' VND', ' đ')}`;
};

export const CashFlowCard = ({ title, icon, balance = 0, transactions = [], isLoading }) => (
  <Card padding="lg">
    <div className="flex items-center gap-3">
      <Icon name={icon} className="h-5 w-5 text-primary-800" />
      <h3 className="text-lg font-bold text-bone-800">{title}</h3>
    </div>

    <div className="mt-5">
      <p className="text-sm font-medium text-bone-500">Số dư hiện tại</p>
      {isLoading ? (
        <Skeleton className="mt-2 h-9 w-56" />
      ) : (
        <p className="mt-1 font-serif text-4xl font-semibold tracking-tight text-bone-800">
          {formatCurrency(balance).replace(' VND', '')}
          <span className="ml-2 text-sm font-medium text-primary-800">đ</span>
        </p>
      )}
    </div>

    <Card inset padding="sm" className="mt-8">
      <p className="text-xs font-semibold text-bone-500">Giao dịch gần nhất</p>

      {isLoading ? (
        <div className="mt-4 space-y-3">
          <Skeleton className="h-4" />
          <Skeleton className="h-4 w-5/6" />
        </div>
      ) : transactions.length ? (
        <div className="mt-4 space-y-3">
          {transactions.slice(0, 3).map((item) => {
            const amount = Number(item.amount || 0);

            return (
              <div key={item.id} className="flex items-center justify-between gap-4 text-sm">
                <span className="min-w-0 truncate font-medium text-bone-700">{item.content || 'Không có mô tả'}</span>
                <span className={`shrink-0 font-bold ${amount < 0 ? 'text-accent-red' : 'text-primary-800'}`}>
                  {formatSignedCurrency(amount)}
                </span>
              </div>
            );
          })}
        </div>
      ) : (
        <p className="mt-4 text-sm font-medium text-bone-500">Chưa có dữ liệu</p>
      )}
    </Card>
  </Card>
);
