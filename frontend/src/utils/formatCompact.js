// Compact Vietnamese money label: 3000000 -> "3tr", 1500000000 -> "1.5tỷ", 500 -> "500".
export const formatCompact = (value) => {
  const amount = Number(value || 0);
  if (Math.abs(amount) >= 1_000_000_000) return `${(amount / 1_000_000_000).toFixed(1)}tỷ`;
  if (Math.abs(amount) >= 1_000_000) return `${(amount / 1_000_000).toFixed(1)}tr`;
  if (Math.abs(amount) >= 1_000) return `${Math.round(amount / 1_000)}k`;
  return new Intl.NumberFormat('vi-VN').format(amount);
};
