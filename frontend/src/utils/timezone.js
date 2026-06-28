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

// First day (Monday) of the current week in Vietnam time, as a YYYY-MM-DD string.
export const getVietnamWeekStart = (value = new Date()) => {
  const parts = getVietnamDateParts(value);
  const base = Date.UTC(parts.year, parts.month - 1, parts.day);
  const dayOfWeek = new Date(base).getUTCDay(); // 0 = Sunday ... 6 = Saturday
  const daysSinceMonday = (dayOfWeek + 6) % 7;
  const monday = new Date(base - daysSinceMonday * 24 * 60 * 60 * 1000);
  return `${monday.getUTCFullYear()}-${pad(monday.getUTCMonth() + 1)}-${pad(monday.getUTCDate())}`;
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

// The range immediately before the current one: yesterday / last month / last year.
// Used to compute the "so với kỳ trước" trend.
export const getVietnamPreviousPeriodRange = (period = 'day', value = new Date()) => {
  const parts = getVietnamDateParts(value);

  if (period === 'year') {
    const year = parts.year - 1;
    return { from: `${year}-01-01`, to: `${year}-12-31` };
  }

  if (period === 'month') {
    let year = parts.year;
    let month = parts.month - 1;
    if (month < 1) {
      month = 12;
      year -= 1;
    }
    const lastDay = new Date(Date.UTC(year, month, 0)).getUTCDate();
    return {
      from: `${year}-${pad(month)}-01`,
      to: `${year}-${pad(month)}-${pad(lastDay)}`,
    };
  }

  // day -> yesterday (computed from the Vietnam-local calendar date)
  const yesterday = new Date(Date.UTC(parts.year, parts.month - 1, parts.day) - 24 * 60 * 60 * 1000);
  const dateStr = `${yesterday.getUTCFullYear()}-${pad(yesterday.getUTCMonth() + 1)}-${pad(yesterday.getUTCDate())}`;
  return { from: dateStr, to: dateStr };
};
