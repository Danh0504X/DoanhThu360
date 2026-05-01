import { Button } from '../ui/Button.jsx';
import { formatCurrency } from '../../utils/formatCurrency.js';
import { formatDate } from '../../utils/formatDate.js';

export const RevenueTable = ({
  rows,
  pagination,
  page,
  onPageChange,
  onEdit,
  onDelete,
}) => {
  const start = pagination.total === 0 ? 0 : (pagination.page - 1) * pagination.limit + 1;
  const end = Math.min(pagination.page * pagination.limit, pagination.total);
  const pages = Array.from({ length: pagination.totalPages || 1 }, (_, index) => index + 1);

  return (
    <section className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm">
      <div className="overflow-x-auto">
        <table className="min-w-full text-left text-sm">
          <thead className="border-b border-slate-100 text-slate-500">
            <tr>
              <th className="px-3 py-4 font-medium">Ngày</th>
              <th className="px-3 py-4 font-medium">Nội dung</th>
              <th className="px-3 py-4 font-medium">Tiền mặt</th>
              <th className="px-3 py-4 font-medium">Tiền tài khoản</th>
              <th className="px-3 py-4 font-medium">Tổng tiền</th>
              <th className="px-3 py-4 font-medium">Ghi chú</th>
              <th className="px-3 py-4 font-medium">Thao tác</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {rows.map((row) => (
              <tr key={row.id || row._id}>
                <td className="px-3 py-4 font-medium text-slate-700">{formatDate(row.date || row.revenueDate)}</td>
                <td className="px-3 py-4 text-slate-700">{row.content}</td>
                <td className="px-3 py-4 text-slate-600">{formatCurrency(row.cashAmount)}</td>
                <td className="px-3 py-4 text-slate-600">{formatCurrency(row.bankAmount)}</td>
                <td className="px-3 py-4 font-semibold text-teal-700">{formatCurrency(row.totalAmount)}</td>
                <td className="px-3 py-4 text-slate-500">{row.note || '-'}</td>
                <td className="px-3 py-4">
                  <div className="flex gap-2">
                    <Button type="button" size="sm" variant="secondary" onClick={() => onEdit(row)}>
                      Sửa
                    </Button>
                    <Button type="button" size="sm" variant="danger" onClick={() => onDelete(row)}>
                      Xóa
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
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
