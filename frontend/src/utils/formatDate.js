import { toVietnamDateString } from './timezone.js';

export const formatDate = (value) =>
  new Intl.DateTimeFormat('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    timeZone: 'Asia/Ho_Chi_Minh',
  }).format(new Date(value));

export const formatRelativeTime = (value) => {
  if (!value) return '';

  const diffInMinutes = Math.round((new Date(value).getTime() - Date.now()) / (1000 * 60));
  const formatter = new Intl.RelativeTimeFormat('vi', { numeric: 'auto' });

  if (Math.abs(diffInMinutes) < 60) {
    return formatter.format(diffInMinutes, 'minute');
  }

  const diffInHours = Math.round(diffInMinutes / 60);
  if (Math.abs(diffInHours) < 24) {
    return formatter.format(diffInHours, 'hour');
  }

  const diffInDays = Math.round(diffInHours / 24);
  return formatter.format(diffInDays, 'day');
};

export const toDateInputValue = (value) => {
  if (!value) return '';

  return toVietnamDateString(value);
};
