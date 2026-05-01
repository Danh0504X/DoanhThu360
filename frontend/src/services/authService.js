import { api } from '../lib/api.js';
import { authStore } from '../stores/authStore.js';

const AUTH_URL = '/auth';

export const authService = {
  async login(payload) {
    return api.post(`${AUTH_URL}/login`, payload);
  },

  async register(payload) {
    return api.post(`${AUTH_URL}/register`, payload);
  },

  async forgotPassword(payload) {
    return api.post(`${AUTH_URL}/forgot-password`, payload);
  },

  async resetPassword(payload) {
    return api.post(`${AUTH_URL}/reset-password`, payload);
  },

  async getMe() {
    if (!authStore.getToken()) {
      return null;
    }

    try {
      return await api.get(`${AUTH_URL}/me`);
    } catch (error) {
      if (error.status === 404 || error.status === 405) {
        return {
          success: true,
          data: authStore.getUser(),
        };
      }

      throw error;
    }
  },

  async logout() {
    try {
      return await api.post(`${AUTH_URL}/logout`);
    } catch (error) {
      if (error.status === 404 || error.status === 405) {
        return {
          success: true,
        };
      }

      throw error;
    }
  },
};
