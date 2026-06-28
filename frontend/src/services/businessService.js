import { api } from '../lib/api.js';

const BUSINESSES_URL = '/businesses';

const normalizeBusinessPayload = (data = {}) => ({
  businessName: data.name,
  taxCode: data.taxCode,
  address: data.address,
  phone: data.phone || undefined,
  email: data.email || undefined,
  status: data.status,
  representativeName: data.note || undefined,
});

const normalizeBusinessParams = (params = {}) =>
  Object.fromEntries(
    Object.entries({
      keyword: params.keyword || undefined,
      status: params.status && params.status !== 'all' ? params.status : undefined,
      page: params.page || 1,
      limit: params.limit || 10,
    }).filter(([, value]) => value !== undefined && value !== ''),
  );

export const businessService = {
  getBusinesses(params = {}) {
    return api.get(BUSINESSES_URL, { params: normalizeBusinessParams(params) });
  },

  getBusinessById(id) {
    return api.get(`${BUSINESSES_URL}/${id}`);
  },

  createBusiness(data) {
    return api.post(BUSINESSES_URL, normalizeBusinessPayload(data));
  },

  updateBusiness(id, data) {
    return api.put(`${BUSINESSES_URL}/${id}`, normalizeBusinessPayload(data));
  },

  deleteBusiness(id) {
    return api.delete(`${BUSINESSES_URL}/${id}`);
  },

  changeBusinessStatus(id, status) {
    return api.patch(`${BUSINESSES_URL}/${id}/status`, { status });
  },
};
