import { Button } from '../ui/Button.jsx';
import { Icon } from '../dashboard/DashboardIcons.jsx';
import { formatCurrency } from '../../utils/formatCurrency.js';
import { formatDate } from '../../utils/formatDate.js';

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

  return (
    <section className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
      {title ? (
        <div className="border-b border-slate-100 px-5 py-4">
          <h2 className="text-base font-bold text-slate-900">{title}</h2>
          <p className="mt-0.5 text-xs font-medium text-slate-500">{pagination.total} bản ghi</p>
        </div>
      ) : null}

      <ul className="divide-y divide-slate-100">
        {rows.map((row) => (
          <li key={row.id || row._id}>
            <button
              type="button"
              onClick={() => onRowClick(row)}
              className="flex w-full items-center gap-3 px-4 py-3.5 text-left transition hover:bg-slate-50 sm:px-5"
            >
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-teal-50 text-teal-700">
                <Icon name="wallet" className="h-5 w-5" />
              </span>

              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-bold text-slate-900">{row.content || 'Không có mô tả'}</p>
                <p className="mt-0.5 text-xs font-medium text-slate-500">
                  {formatDate(row.date || row.revenueDate)}
                </p>
              </div>

              <div className="flex shrink-0 items-center gap-2">
                <span className="text-sm font-bold text-teal-700">{formatCurrency(row.totalAmount)}</span>
                <Icon name="chevronRight" className="h-4 w-4 text-slate-300" />
              </div>
            </button>
          </li>
        ))}
      </ul>

      <div className="flex flex-col gap-4 border-t border-slate-100 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-slate-500">
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
