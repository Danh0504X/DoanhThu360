export const formatPhone = (value) => {
  const digits = String(value || '').replace(/\D/g, '');

  if (!digits) return '';
  if (digits.length >= 10) {
    return `${digits.slice(0, 4)} ${digits.slice(4, 7)} ${digits.slice(7, 10)}${digits.length > 10 ? ` ${digits.slice(10)}` : ''}`.trim();
  }

  return value || '';
};
