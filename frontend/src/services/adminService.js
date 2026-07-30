import { api } from '../lib/api.js';

const USERS_URL = '/users';

const normalizeUserParams = (params = {}) =>
  Object.fromEntries(
    Object.entries({
      keyword: params.keyword || undefined,
      role: params.role && params.role !== 'all' ? params.role : undefined,
      status: params.status && params.status !== 'all' ? params.status : undefined,
      page: params.page || 1,
      limit: params.limit || 10,
    }).filter(([, value]) => value !== undefined && value !== ''),
  );

export const adminService = {
  getStats() {
    return api.get('/admin/stats');
  },

  getUsers(params = {}) {
    return api.get(USERS_URL, { params: normalizeUserParams(params) });
  },

  updateUser(id, data) {
    return api.patch(`${USERS_URL}/${id}`, data);
  },

  adminUpdateUser(id, data) {
    return api.patch(`${USERS_URL}/${id}/admin`, data);
  },

  deleteUser(id) {
    return api.delete(`${USERS_URL}/${id}`);
  },
};
