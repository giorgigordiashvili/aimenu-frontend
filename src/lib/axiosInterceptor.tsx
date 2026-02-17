import axios from 'axios';

import { authTokenRefreshCreate } from '@/api/generated';

axios.interceptors.request.use(config => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('access_token');

    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }

  return config;
});

axios.interceptors.response.use(
  response => response,
  async error => {
    if (typeof window === 'undefined') {
      return Promise.reject(error);
    }

    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      const refreshToken = localStorage.getItem('refresh_token');

      if (!refreshToken) {
        window.location.href = '/login';
        return Promise.reject(error);
      }

      try {
        const response = await authTokenRefreshCreate({
          refresh: refreshToken,
        });

        localStorage.setItem('access_token', response.access);

        if (originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${response.access}`;
        }

        return axios(originalRequest);
      } catch {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        window.location.href = '/login';
      }
    }

    return Promise.reject(error);
  }
);
