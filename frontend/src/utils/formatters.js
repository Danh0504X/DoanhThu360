import { formatCurrency as formatCurrencyValue } from './formatCurrency.js';
import { formatDate as formatDateValue } from './formatDate.js';
import { getVietnamHour, VIETNAM_TIMEZONE } from './timezone.js';

export const formatCurrency = (value) =>
  formatCurrencyValue(value);

export const formatCompactCurrency = (value) =>
  `${new Intl.NumberFormat('vi-VN').format(Number(value || 0))}đ`;

export const formatDate = (value) =>
  formatDateValue(value);

export const formatShortDate = (value) =>
  new Intl.DateTimeFormat('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    timeZone: VIETNAM_TIMEZONE,
  }).format(new Date(value));

export const getGreeting = () => {
  const hour = getVietnamHour();

  if (hour < 12) return 'Chào buổi sáng';
  if (hour < 18) return 'Chào buổi chiều';
  return 'Chào buổi tối';
};
