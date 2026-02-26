import axiosInstance from '@/api/axios';
import { authTokenRefreshCreate } from '@/api/generated';

axiosInstance.interceptors.request.use(config => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('access_token');

    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }

  return config;
});

axiosInstance.interceptors.response.use(
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
        document.cookie = 'access_token=; path=/; max-age=0';
        window.location.href = '/login';
        return Promise.reject(error);
      }

      try {
        const response = await authTokenRefreshCreate({
          refresh: refreshToken,
        });

        localStorage.setItem('access_token', response.access);
        document.cookie = `access_token=${response.access}; path=/; max-age=${7 * 24 * 60 * 60}; SameSite=Lax`;

        if (originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${response.access}`;
        }

        return axiosInstance(originalRequest);
      } catch {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        document.cookie = 'access_token=; path=/; max-age=0';
        window.location.href = '/login';
      }
    }

    return Promise.reject(error);
  }
);
