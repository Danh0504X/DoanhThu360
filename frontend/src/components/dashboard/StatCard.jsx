import { formatCompactCurrency } from '../../utils/formatters.js';

export const StatCard = ({ title, value, change, featured = false, badgeLabel }) => (
  <article
    className={`rounded-[28px] border p-5 shadow-sm ${
      featured
        ? 'border-teal-700 bg-teal-700 text-white'
        : 'border-slate-200 bg-white text-slate-800'
    }`}
  >
    <div className="flex items-start justify-between gap-4">
      <div>
        <p className={`text-sm ${featured ? 'text-teal-50/90' : 'text-slate-500'}`}>{title}</p>
        <p className="mt-4 text-3xl font-semibold tracking-tight">{formatCompactCurrency(value)}</p>
      </div>
      <div
        className={`rounded-2xl px-3 py-2 text-xs font-medium ${
          featured ? 'bg-white/12 text-white' : 'bg-teal-50 text-teal-700'
        }`}
      >
        {badgeLabel || (featured ? 'Hôm nay' : 'Cập nhật')}
      </div>
    </div>
    <div
      className={`mt-6 inline-flex rounded-full px-3 py-2 text-sm ${
        featured ? 'bg-white/12 text-white' : 'bg-slate-50 text-teal-700'
      }`}
    >
      {change}
    </div>
  </article>
);
