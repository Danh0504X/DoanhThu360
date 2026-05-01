import { formatCurrency } from '../../utils/formatCurrency.js';

const cards = [
  { key: 'totalCash', label: 'Tổng tiền mặt' },
  { key: 'totalBank', label: 'Tổng tài khoản' },
  { key: 'totalRevenue', label: 'Tổng doanh thu thực tế', featured: true },
];

export const RevenueSummaryCards = ({ summary }) => (
  <section className="grid gap-4 md:grid-cols-3">
    {cards.map((card) => (
      <article
        key={card.key}
        className={`rounded-[24px] border p-5 shadow-sm ${
          card.featured
            ? 'border-teal-700 bg-teal-700 text-white'
            : 'border-slate-200 bg-white text-slate-800'
        }`}
      >
        <p className={`text-sm ${card.featured ? 'text-teal-50/90' : 'text-slate-500'}`}>{card.label}</p>
        <p className="mt-3 text-2xl font-semibold">{formatCurrency(summary?.[card.key] || 0)}</p>
      </article>
    ))}
  </section>
);
