import { formatCurrency } from '../../utils/formatCurrency.js';

export const ChartTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;

  return (
    <div className="rounded-md border border-bone-200 bg-white px-3 py-2 shadow-1">
      <p className="mb-1 text-xs font-bold text-bone-700">{label}</p>
      {payload.map((entry) => (
        <p key={entry.dataKey} className="text-xs font-medium" style={{ color: entry.color }}>
          {entry.name}: {formatCurrency(entry.value)}
        </p>
      ))}
    </div>
  );
};
