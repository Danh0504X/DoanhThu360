import { revenueService } from './revenueService.js';
import { api } from '../lib/api.js';

const REVENUES_URL = '/revenue-entries';

const normalizeDate = (date) => {
  const normalizedDate = new Date(date);
  normalizedDate.setHours(0, 0, 0, 0);
  return normalizedDate;
};

const formatISODate = (date) => normalizeDate(date).toISOString().slice(0, 10);

const buildDateRangeByPeriod = (period) => {
  const now = new Date();
  const start = normalizeDate(now);
  const end = normalizeDate(now);

  if (period === 'month') {
    start.setDate(1);
    end.setMonth(end.getMonth() + 1, 0);
  } else if (period === 'year') {
    start.setMonth(0, 1);
    end.setMonth(11, 31);
  } else {
    end.setHours(23, 59, 59, 999);
  }

  return {
    from: formatISODate(start),
    to: formatISODate(end),
  };
};

const withPeriodRange = (params = {}) => {
  if (params.from || params.to) {
    return params;
  }

  const period = params.period || 'day';
  const range = buildDateRangeByPeriod(period);

  return {
    ...params,
    ...range,
  };
};

export const dashboardService = {
  async getDashboardStats(params = {}) {
    return api.get(`${REVENUES_URL}/summary`, {
      params: withPeriodRange(params),
    });
  },

  async getRevenueChart(params = {}) {
    return api.get(`${REVENUES_URL}/chart/daily`, {
      params: withPeriodRange(params),
    });
  },

  async getRecentRevenues(params = {}) {
    return revenueService.getRevenues({
      limit: 5,
      page: 1,
      ...withPeriodRange(params),
    });
  },
};
