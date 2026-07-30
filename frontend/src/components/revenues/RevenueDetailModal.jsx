import { Button } from '../ui/Button.jsx';
import { Card } from '../ui/Card.jsx';
import { Modal } from '../ui/Modal.jsx';
import { Icon } from '../dashboard/DashboardIcons.jsx';
import { formatCurrency } from '../../utils/formatCurrency.js';
import { formatDate } from '../../utils/formatDate.js';

export const RevenueDetailModal = ({ revenue, isOpen, onClose, onEdit, onDelete }) => {
  if (!revenue) return null;

  const cashAmount = Number(revenue.cashAmount || 0);
  const bankAmount = Number(revenue.bankAmount || 0);
  const totalAmount = Number(revenue.totalAmount ?? cashAmount + bankAmount);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Chi tiết doanh thu"
      footer={(
        <>
          <Button type="button" variant="secondary" onClick={() => onEdit(revenue)}>
            Chỉnh sửa
          </Button>
          <Button type="button" variant="danger" onClick={() => onDelete(revenue)}>
            Xóa
          </Button>
        </>
      )}
    >
      <div className="rounded-md bg-primary-700 px-5 py-4 text-white">
        <p className="text-xs font-bold uppercase tracking-wide text-primary-50/80">Tổng doanh thu</p>
        <p className="mt-1 font-serif text-3xl font-semibold tracking-tight">{formatCurrency(totalAmount)}</p>
      </div>

      <dl className="mt-4 space-y-3">
        <div className="flex items-start justify-between gap-4">
          <dt className="text-sm font-medium text-bone-500">Nội dung</dt>
          <dd className="text-right text-sm font-semibold text-bone-800">{revenue.content || 'Không có mô tả'}</dd>
        </div>
        <div className="flex items-center justify-between gap-4">
          <dt className="text-sm font-medium text-bone-500">Ngày ghi nhận</dt>
          <dd className="text-sm font-semibold text-bone-800">{formatDate(revenue.date || revenue.revenueDate)}</dd>
        </div>
        <div className="grid grid-cols-2 gap-3 pt-1">
          <Card inset padding="sm">
            <p className="flex items-center gap-1.5 text-xs font-medium text-bone-500">
              <Icon name="cash" className="h-4 w-4" /> Tiền mặt
            </p>
            <p className="mt-1 text-sm font-bold text-bone-800">{formatCurrency(cashAmount)}</p>
          </Card>
          <Card inset padding="sm">
            <p className="flex items-center gap-1.5 text-xs font-medium text-bone-500">
              <Icon name="bank" className="h-4 w-4" /> Tài khoản
            </p>
            <p className="mt-1 text-sm font-bold text-bone-800">{formatCurrency(bankAmount)}</p>
          </Card>
        </div>
        {revenue.note ? (
          <div className="pt-1">
            <dt className="text-sm font-medium text-bone-500">Ghi chú</dt>
            <dd className="mt-1 rounded-sm bg-bone-50 px-3 py-2.5 text-sm text-bone-700">{revenue.note}</dd>
          </div>
        ) : null}
      </dl>
    </Modal>
  );
};
