export const VIETNAM_TIMEZONE = 'Asia/Ho_Chi_Minh';
const VIETNAM_UTC_OFFSET_HOURS = 7;

const pad = (value) => String(value).padStart(2, '0');

export const getVietnamDateParts = (value = new Date()) => {
  const date = value instanceof Date ? value : new Date(value);
  const vietnamTime = new Date(date.getTime() + VIETNAM_UTC_OFFSET_HOURS * 60 * 60 * 1000);

  return {
    year: vietnamTime.getUTCFullYear(),
    month: vietnamTime.getUTCMonth() + 1,
    day: vietnamTime.getUTCDate(),
  };
};

export const toVietnamDateString = (value = new Date()) => {
  const { year, month, day } = getVietnamDateParts(value);
  return `${year}-${pad(month)}-${pad(day)}`;
};

export const getVietnamHour = (value = new Date()) => {
  const date = value instanceof Date ? value : new Date(value);
  const vietnamTime = new Date(date.getTime() + VIETNAM_UTC_OFFSET_HOURS * 60 * 60 * 1000);
  return vietnamTime.getUTCHours();
};

export const getVietnamPeriodRange = (period = 'day', value = new Date()) => {
  const parts = getVietnamDateParts(value);

  if (period === 'year') {
    return {
      from: `${parts.year}-01-01`,
      to: `${parts.year}-12-31`,
    };
  }

  if (period === 'month') {
    const lastDay = new Date(Date.UTC(parts.year, parts.month, 0)).getUTCDate();
    return {
      from: `${parts.year}-${pad(parts.month)}-01`,
      to: `${parts.year}-${pad(parts.month)}-${pad(lastDay)}`,
    };
  }

  const today = `${parts.year}-${pad(parts.month)}-${pad(parts.day)}`;
  return {
    from: today,
    to: today,
  };
};
