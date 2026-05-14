import { revenueService } from './revenueService.js';
import { api } from '../lib/api.js';
import { getVietnamPeriodRange } from '../utils/timezone.js';

const REVENUES_URL = '/revenue-entries';

const withPeriodRange = (params = {}) => {
  if (params.from || params.to) {
    return params;
  }

  const period = params.period || 'day';
  const range = getVietnamPeriodRange(period);

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
