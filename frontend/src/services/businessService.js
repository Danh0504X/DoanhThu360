import { api } from '../lib/api.js';

const BUSINESSES_URL = '/businesses';

export const businessService = {
  getBusinesses(params = {}) {
    return api.get(BUSINESSES_URL, { params });
  },
};
