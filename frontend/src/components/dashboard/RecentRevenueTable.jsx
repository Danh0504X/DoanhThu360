import { Button } from '../ui/Button.jsx';
import { formatCompactCurrency, formatDate } from '../../utils/formatters.js';

export const RecentRevenueTable = ({ rows = [] }) => (
  <section className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm">
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h2 className="text-base font-semibold text-slate-800">Doanh thu gần đây</h2>
        <p className="mt-1 text-sm text-slate-500">Danh sách bản ghi gần nhất từ hệ thống.</p>
      </div>
      <div className="flex gap-3">
        <Button variant="soft" size="sm">Thêm doanh thu</Button>
        <Button variant="secondary" size="sm">Xem tất cả</Button>
      </div>
    </div>

    {rows.length ? (
      <div className="mt-5 overflow-hidden rounded-3xl border border-slate-100">
        <div className="hidden grid-cols-[0.95fr_1.6fr_1fr_1fr_1fr_0.9fr] bg-slate-50 px-5 py-4 text-sm font-medium text-slate-500 lg:grid">
          <span>Ngày</span>
          <span>Nội dung</span>
          <span>Tiền mặt</span>
          <span>Tiền tài khoản</span>
          <span>Tổng tiền</span>
          <span>Thao tác</span>
        </div>

        <div className="divide-y divide-slate-100">
          {rows.map((row) => (
            <div key={row.id} className="grid gap-4 px-4 py-4 lg:grid-cols-[0.95fr_1.6fr_1fr_1fr_1fr_0.9fr] lg:px-5">
              <div>
                <p className="text-xs text-slate-500 lg:hidden">Ngày</p>
                <p className="text-sm font-medium text-slate-700">{formatDate(row.date)}</p>
              </div>
              <div>
                <p className="text-xs text-slate-500 lg:hidden">Nội dung</p>
                <p className="text-sm text-slate-700">{row.content}</p>
              </div>
              <div>
                <p className="text-xs text-slate-500 lg:hidden">Tiền mặt</p>
                <p className="text-sm text-slate-700">{formatCompactCurrency(row.cashAmount)}</p>
              </div>
              <div>
                <p className="text-xs text-slate-500 lg:hidden">Tiền tài khoản</p>
                <p className="text-sm text-slate-700">{formatCompactCurrency(row.bankAmount)}</p>
              </div>
              <div>
                <p className="text-xs text-slate-500 lg:hidden">Tổng tiền</p>
                <p className="text-sm font-semibold text-slate-800">{formatCompactCurrency(row.totalAmount)}</p>
              </div>
              <div className="flex gap-2">
                <Button variant="secondary" size="sm" className="flex-1">Sửa</Button>
                <Button variant="danger" size="sm" className="flex-1">Xóa</Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    ) : (
      <div className="mt-5 rounded-2xl bg-slate-50 px-4 py-10 text-center text-sm text-slate-500">
        Chưa có bản ghi doanh thu nào.
      </div>
    )}
  </section>
);
