import { api } from '../lib/api.js';

const ACCOUNT_URL = '/account';

export const accountService = {
  getProfile() {
    return api.get(`${ACCOUNT_URL}/profile`);
  },

  updateProfile(data) {
    return api.put(`${ACCOUNT_URL}/profile`, data);
  },

  changePassword(data) {
    return api.put(`${ACCOUNT_URL}/change-password`, data);
  },

  resendVerifyEmail() {
    return api.post(`${ACCOUNT_URL}/resend-verification-email`);
  },

  getRecentActivities() {
    return api.get(`${ACCOUNT_URL}/recent-activities`);
  },
};
