import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { formatCompactCurrency, formatShortDate } from '../../utils/formatters.js';

export const RevenueChart = ({ data = [], periodLabel = 'Ngày' }) => {
  const maxRevenue = data.length ? Math.max(...data.map((item) => item.revenue)) : 0;
  const averageRevenue = data.length
    ? Math.round(data.reduce((total, item) => total + item.revenue, 0) / data.length)
    : 0;

  return (
    <section className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h2 className="text-base font-semibold text-slate-800">Biểu đồ xu hướng</h2>
          <p className="mt-1 text-sm text-slate-500">Doanh thu thực tế theo {periodLabel.toLowerCase()}.</p>
        </div>
        <div className="rounded-full bg-teal-50 px-3 py-2 text-xs font-medium text-teal-700">
          {periodLabel}
        </div>
      </div>

      {data.length ? (
        <>
          <div className="mt-6 h-64 lg:h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data} margin={{ top: 8, right: 0, left: -18, bottom: 0 }}>
                <CartesianGrid vertical={false} stroke="#e2e8f0" />
                <XAxis
                  dataKey="label"
                  tickLine={false}
                  axisLine={false}
                  tick={{ fill: '#64748b', fontSize: 12 }}
                  tickFormatter={(value) => formatShortDate(value)}
                />
                <YAxis
                  tickLine={false}
                  axisLine={false}
                  tick={{ fill: '#64748b', fontSize: 12 }}
                  tickFormatter={(value) => `${Math.round(value / 1000000)}M`}
                />
                <Tooltip
                  formatter={(value) => [formatCompactCurrency(value), 'Doanh thu']}
                  labelFormatter={(value) => formatShortDate(value)}
                  cursor={{ fill: '#f8fafc' }}
                  contentStyle={{
                    borderRadius: 16,
                    border: '1px solid #e2e8f0',
                    boxShadow: '0 8px 24px rgba(15, 23, 42, 0.08)',
                  }}
                />
                <Bar dataKey="revenue" radius={[10, 10, 0, 0]}>
                  {data.map((entry, index) => (
                    <Cell key={entry.label} fill={index === data.length - 1 ? '#0f766e' : '#bdd9d7'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="mt-4 grid grid-cols-2 gap-4 border-t border-slate-100 pt-4 text-sm">
            <div>
              <p className="text-slate-500">Trung bình</p>
              <p className="mt-1 font-semibold text-slate-800">{formatCompactCurrency(averageRevenue)}</p>
            </div>
            <div>
              <p className="text-slate-500">Cao nhất</p>
              <p className="mt-1 font-semibold text-slate-800">{formatCompactCurrency(maxRevenue)}</p>
            </div>
          </div>
        </>
      ) : (
        <div className="mt-6 rounded-2xl bg-slate-50 px-4 py-10 text-center text-sm text-slate-500">
          Chưa có dữ liệu biểu đồ trong giai đoạn này.
        </div>
      )}
    </section>
  );
};
