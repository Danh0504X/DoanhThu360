import { api } from '../lib/api.js';

export const settingsService = {
  getPublicRegistrationStatus() {
    return api.get('/auth/registration-status');
  },

  getSettings() {
    return api.get('/admin/settings');
  },

  updateSettings(patch) {
    return api.patch('/admin/settings', patch);
  },
};
