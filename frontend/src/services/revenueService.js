import { api } from '../lib/api.js';

const REVENUES_URL = '/revenue-entries';

const normalizeRevenueParams = (params = {}) => {
  const normalizedParams = {
    page: params.page,
    limit: params.limit,
    businessId: params.businessId && params.businessId !== 'all' ? params.businessId : undefined,
    from: params.fromDate || params.from,
    to: params.toDate || params.to,
    status: params.status,
  };

  if (params.keyword) {
    normalizedParams.keyword = params.keyword;
  }

  return Object.fromEntries(
    Object.entries(normalizedParams).filter(([, value]) => value !== undefined && value !== ''),
  );
};

export const revenueService = {
  getRevenues(params = {}) {
    return api.get(REVENUES_URL, { params: normalizeRevenueParams(params) });
  },

  getRevenueById(id) {
    return api.get(`${REVENUES_URL}/${id}`);
  },

  createRevenue(data) {
    return api.post(REVENUES_URL, data);
  },

  updateRevenue(id, data) {
    return api.put(`${REVENUES_URL}/${id}`, data);
  },

  deleteRevenue(id) {
    return api.delete(`${REVENUES_URL}/${id}`);
  },

  getRevenueSummary(params = {}) {
    return api.get(`${REVENUES_URL}/summary`, {
      params: normalizeRevenueParams(params),
    });
  },
};
