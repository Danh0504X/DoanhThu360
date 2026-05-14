export const VIETNAM_TIMEZONE = 'Asia/Ho_Chi_Minh';
const VIETNAM_UTC_OFFSET_HOURS = 7;
const DATE_ONLY_REGEX = /^\d{4}-\d{2}-\d{2}$/;

const getDatePartsFromDate = (value) => ({
  year: value.getUTCFullYear(),
  month: value.getUTCMonth() + 1,
  day: value.getUTCDate(),
});

const getDateParts = (value) => {
  if (typeof value === 'string' && DATE_ONLY_REGEX.test(value)) {
    const [year, month, day] = value.split('-').map(Number);
    return { year, month, day };
  }

  const date = value instanceof Date ? value : new Date(value);
  return getDatePartsFromDate(date);
};

export const toVietnamDateBoundary = (value, boundary = 'start') => {
  const { year, month, day } = getDateParts(value);

  if (boundary === 'end') {
    return new Date(
      Date.UTC(year, month - 1, day, 23 - VIETNAM_UTC_OFFSET_HOURS, 59, 59, 999),
    );
  }

  return new Date(
    Date.UTC(year, month - 1, day, -VIETNAM_UTC_OFFSET_HOURS, 0, 0, 0),
  );
};
