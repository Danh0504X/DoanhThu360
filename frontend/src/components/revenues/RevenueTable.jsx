import { Button } from '../ui/Button.jsx';
import { Icon } from '../dashboard/DashboardIcons.jsx';
import { formatCurrency } from '../../utils/formatCurrency.js';
import { formatDate } from '../../utils/formatDate.js';
import { getPaymentType } from '../../utils/paymentType.js';

const badgeTone = {
  'TIỀN MẶT': 'bg-accent-emerald-bg text-accent-emerald',
  'TÀI KHOẢN': 'bg-accent-amber-bg text-accent-amber',
  'HỖN HỢP': 'bg-primary-50 text-primary-700',
  '--': 'bg-bone-100 text-bone-500',
};

// Groups rows by their calendar day (as displayed) so each page of the ledger
// reads like a real cash book — a subtotal per day instead of one flat list.
const groupByDay = (rows) => {
  const groups = [];
  const byKey = new Map();

  rows.forEach((row) => {
    const key = formatDate(row.date || row.revenueDate);
    if (!byKey.has(key)) {
      const group = { key, rows: [], total: 0 };
      byKey.set(key, group);
      groups.push(group);
    }
    const group = byKey.get(key);
    group.rows.push(row);
    group.total += Number(row.totalAmount || 0);
  });

  return groups;
};

export const RevenueTable = ({
  rows,
  pagination,
  page,
  onPageChange,
  onRowClick,
  title,
}) => {
  const start = pagination.total === 0 ? 0 : (pagination.page - 1) * pagination.limit + 1;
  const end = Math.min(pagination.page * pagination.limit, pagination.total);
  const pages = Array.from({ length: pagination.totalPages || 1 }, (_, index) => index + 1);
  const dayGroups = groupByDay(rows);

  return (
    <section className="overflow-hidden rounded-md border border-bone-200 bg-white">
      {title ? (
        <div className="border-b border-bone-100 px-5 py-4">
          <h2 className="text-base font-bold text-bone-800">{title}</h2>
          <p className="mt-0.5 text-xs font-medium text-bone-500">{pagination.total} bản ghi</p>
        </div>
      ) : null}

      <div className="divide-y divide-bone-100">
        {dayGroups.map((group) => (
          <div key={group.key} className="px-4 py-3 sm:px-5">
            <div className="mb-2 flex items-center justify-between">
              <p className="text-[11px] font-bold uppercase tracking-wide text-bone-400">{group.key}</p>
              <p className="text-xs font-bold text-primary-700">+{formatCurrency(group.total).replace(' VND', ' đ')}</p>
            </div>

            <ul className="space-y-2">
              {group.rows.map((row) => {
                const paymentType = getPaymentType(row);

                return (
                  <li key={row.id || row._id}>
                    <button
                      type="button"
                      onClick={() => onRowClick(row)}
                      className="flex w-full items-center gap-3 rounded-sm border border-bone-100 bg-white px-3 py-2.5 text-left transition-brand hover:border-primary-100 hover:bg-primary-50/40"
                    >
                      <span className="grid h-9 w-9 shrink-0 place-items-center rounded-sm bg-primary-50 text-primary-700">
                        <Icon name="wallet" className="h-4.5 w-4.5" />
                      </span>

                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-bold text-bone-800">{row.content || 'Không có mô tả'}</p>
                        <span className={`mt-1 inline-flex rounded-sm px-1.5 py-0.5 text-[10px] font-bold ${badgeTone[paymentType]}`}>
                          {paymentType}
                        </span>
                      </div>

                      <div className="flex shrink-0 items-center gap-2">
                        <span className="text-sm font-bold text-primary-700">{formatCurrency(row.totalAmount)}</span>
                        <Icon name="chevronRight" className="h-4 w-4 text-bone-300" />
                      </div>
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </div>

      <div className="flex flex-col gap-4 border-t border-bone-100 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-bone-500">
          Hiển thị {start}-{end} của {pagination.total} dòng doanh thu
        </p>

        <div className="flex items-center gap-2">
          <Button type="button" size="sm" variant="secondary" onClick={() => onPageChange(page - 1)} disabled={page <= 1}>
            Trước
          </Button>
          {pages.map((pageNumber) => (
            <Button
              key={pageNumber}
              type="button"
              size="sm"
              variant={pageNumber === page ? 'primary' : 'secondary'}
              onClick={() => onPageChange(pageNumber)}
            >
              {pageNumber}
            </Button>
          ))}
          <Button
            type="button"
            size="sm"
            variant="secondary"
            onClick={() => onPageChange(page + 1)}
            disabled={page >= pagination.totalPages}
          >
            Sau
          </Button>
        </div>
      </div>
    </section>
  );
};
