import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts';
import { formatCompactCurrency } from '../../utils/formatters.js';

export const PaymentSplitCard = ({ data = [] }) => (
  <section className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm">
    <div>
      <h2 className="text-base font-semibold text-slate-800">Tỷ lệ tiền mặt / chuyển khoản</h2>
      <p className="mt-1 text-sm text-slate-500">Cơ cấu thanh toán lấy từ dữ liệu doanh thu thật.</p>
    </div>

    {data.some((item) => item.value > 0) ? (
      <>
        <div className="mt-4 h-56">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                dataKey="value"
                nameKey="name"
                innerRadius={48}
                outerRadius={78}
                paddingAngle={2}
              >
                {data.map((item) => (
                  <Cell key={item.name} fill={item.color} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => formatCompactCurrency(value)} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="space-y-3">
          {data.map((item) => (
            <div key={item.name} className="flex items-center justify-between rounded-2xl bg-slate-50 px-4 py-3">
              <div className="flex items-center gap-3">
                <span className="h-3 w-3 rounded-full" style={{ backgroundColor: item.color }} />
                <span className="text-sm text-slate-600">{item.name}</span>
              </div>
              <span className="text-sm font-semibold text-slate-800">{formatCompactCurrency(item.value)}</span>
            </div>
          ))}
        </div>
      </>
    ) : (
      <div className="mt-6 rounded-2xl bg-slate-50 px-4 py-10 text-center text-sm text-slate-500">
        Chưa có dữ liệu thanh toán để hiển thị.
      </div>
    )}
  </section>
);
