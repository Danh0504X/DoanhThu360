import { formatCurrency } from '../../utils/formatCurrency.js';

export const RevenueCodePreview = ({ code, cashAmount, bankAmount }) => {
  const totalAmount = Number(cashAmount || 0) + Number(bankAmount || 0);

  return (
    <aside className="space-y-4">
      <section className="rounded-[24px] border border-teal-700 bg-teal-700 p-5 text-white shadow-sm">
        <p className="text-xs uppercase tracking-[0.2em] text-teal-50/80">Tổng doanh thu</p>
        <p className="mt-3 text-3xl font-semibold">{formatCurrency(totalAmount)}</p>
        <div className="mt-5 grid grid-cols-2 gap-3 text-sm">
          <div className="rounded-2xl bg-white/10 px-3 py-3">
            <p className="text-teal-50/80">Tiền mặt</p>
            <p className="mt-2 font-medium">{formatCurrency(cashAmount)}</p>
          </div>
          <div className="rounded-2xl bg-white/10 px-3 py-3">
            <p className="text-teal-50/80">Tài khoản</p>
            <p className="mt-2 font-medium">{formatCurrency(bankAmount)}</p>
          </div>
        </div>
      </section>

      <section className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-sm">
        <p className="text-sm font-medium text-slate-700">Mã chứng từ</p>
        <p className="mt-3 rounded-2xl bg-slate-50 px-4 py-3 font-mono text-sm text-slate-600">
          {code || 'REV-YYYYMMDD-001'}
        </p>
        <p className="mt-3 text-xs leading-5 text-slate-500">
          Mã chứng từ được hiển thị để tham chiếu nội bộ. Backend hiện chưa trả mã chứng từ riêng.
        </p>
      </section>
    </aside>
  );
};
