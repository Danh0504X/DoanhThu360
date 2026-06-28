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

  sendVerificationCode() {
    return api.post(`${ACCOUNT_URL}/send-verification-code`);
  },

  verifyEmail(data) {
    return api.post(`${ACCOUNT_URL}/verify-email`, data);
  },

  getRecentActivities() {
    return api.get(`${ACCOUNT_URL}/recent-activities`);
  },
};
