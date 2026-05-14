import axios from 'axios';
import { authStore } from '../stores/authStore.js';
import { getRefreshToken, setAccessToken, setRefreshToken } from '../utils/tokenStorage.js';

const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';

export const rawApi = axios.create({
  baseURL,
  withCredentials: false,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const api = axios.create({
  baseURL,
  withCredentials: false,
  headers: {
    'Content-Type': 'application/json',
  },
});

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

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
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      const refreshToken = getRefreshToken();

      if (!refreshToken) {
        authStore.clearSession();
        window.location.href = '/login';
        return Promise.reject(error);
      }

      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return api(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      isRefreshing = true;

      try {
        const res = await rawApi.post('/auth/refresh-token', { refreshToken });
        const { accessToken, refreshToken: newRefreshToken } = res.data.data;

        setAccessToken(accessToken);
        if (newRefreshToken) {
          setRefreshToken(newRefreshToken);
        }

        // We only manually update the store state token here because the request interceptor reads from it,
        // but setSession does too much. We will just let tokenStorage handle it, but we should update authStore token.
        authStore.getSnapshot().token = accessToken;

        processQueue(null, accessToken);

        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);
        authStore.clearSession();
        window.location.href = '/login';
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    const normalizedError = new Error(
      error.response?.data?.message || error.message || 'Có lỗi xảy ra',
    );
    normalizedError.status = error.response?.status;
    normalizedError.payload = error.response?.data;

    return Promise.reject(normalizedError);
  },
);
