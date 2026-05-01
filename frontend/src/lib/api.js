import axios from 'axios';
import { authStore } from '../stores/authStore.js';

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8080/api',
  withCredentials: false,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
    const token = authStore.getToken();

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error),
);

api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (error.response?.status === 401) {
      authStore.clearSession();
    }

    const normalizedError = new Error(
      error.response?.data?.message || error.message || 'Có lỗi xảy ra',
    );
    normalizedError.status = error.response?.status;
    normalizedError.payload = error.response?.data;

    return Promise.reject(normalizedError);
  },
);
