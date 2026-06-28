import { Button } from '../ui/Button.jsx';
import { Icon } from '../dashboard/DashboardIcons.jsx';
import { formatCurrency } from '../../utils/formatCurrency.js';
import { formatDate } from '../../utils/formatDate.js';

export const RevenueDetailModal = ({ revenue, isOpen, onClose, onEdit, onDelete }) => {
  if (!isOpen || !revenue) return null;

  const cashAmount = Number(revenue.cashAmount || 0);
  const bankAmount = Number(revenue.bankAmount || 0);
  const totalAmount = Number(revenue.totalAmount ?? cashAmount + bankAmount);

  return (
    <div
      className="fixed inset-0 z-40 flex items-end justify-center bg-slate-900/35 px-0 backdrop-blur-sm sm:items-center sm:px-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md overflow-hidden rounded-t-2xl border border-slate-200 bg-white shadow-xl sm:rounded-2xl"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
          <h3 className="text-base font-bold text-slate-900">Chi tiết doanh thu</h3>
          <button
            type="button"
            onClick={onClose}
            className="grid h-9 w-9 place-items-center rounded-md text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
            aria-label="Đóng"
          >
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8">
              <path d="M6 6l12 12M18 6 6 18" />
            </svg>
          </button>
        </div>

        <div className="px-5 py-5">
          <div className="rounded-xl bg-teal-700 px-5 py-4 text-white">
            <p className="text-xs font-bold uppercase tracking-wide text-teal-50/80">Tổng doanh thu</p>
            <p className="mt-1 text-3xl font-bold">{formatCurrency(totalAmount)}</p>
          </div>

          <dl className="mt-4 space-y-3">
            <div className="flex items-start justify-between gap-4">
              <dt className="text-sm font-medium text-slate-500">Nội dung</dt>
              <dd className="text-right text-sm font-semibold text-slate-800">{revenue.content || 'Không có mô tả'}</dd>
            </div>
            <div className="flex items-center justify-between gap-4">
              <dt className="text-sm font-medium text-slate-500">Ngày ghi nhận</dt>
              <dd className="text-sm font-semibold text-slate-800">{formatDate(revenue.date || revenue.revenueDate)}</dd>
            </div>
            <div className="grid grid-cols-2 gap-3 pt-1">
              <div className="rounded-lg bg-slate-50 px-3 py-2.5">
                <p className="flex items-center gap-1.5 text-xs font-medium text-slate-500">
                  <Icon name="cash" className="h-4 w-4" /> Tiền mặt
                </p>
                <p className="mt-1 text-sm font-bold text-slate-800">{formatCurrency(cashAmount)}</p>
              </div>
              <div className="rounded-lg bg-slate-50 px-3 py-2.5">
                <p className="flex items-center gap-1.5 text-xs font-medium text-slate-500">
                  <Icon name="bank" className="h-4 w-4" /> Tài khoản
                </p>
                <p className="mt-1 text-sm font-bold text-slate-800">{formatCurrency(bankAmount)}</p>
              </div>
            </div>
            {revenue.note ? (
              <div className="pt-1">
                <dt className="text-sm font-medium text-slate-500">Ghi chú</dt>
                <dd className="mt-1 rounded-lg bg-slate-50 px-3 py-2.5 text-sm text-slate-700">{revenue.note}</dd>
              </div>
            ) : null}
          </dl>
        </div>

        <div className="grid grid-cols-2 gap-3 border-t border-slate-100 bg-slate-50 px-5 py-4">
          <Button type="button" variant="secondary" onClick={() => onEdit(revenue)}>
            Chỉnh sửa
          </Button>
          <Button type="button" variant="danger" onClick={() => onDelete(revenue)}>
            Xóa
          </Button>
        </div>
      </div>
    </div>
  );
};
