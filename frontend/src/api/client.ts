import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';
import { useAuthStore } from '@/state/authStore';

const apiClient = axios.create({
  baseURL: '',
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const aiApiClient = axios.create({
  baseURL: '',
  timeout: 90000,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const mentorApiClient = axios.create({
  baseURL: '',
  timeout: 45000,
  headers: {
    'Content-Type': 'application/json',
  },
});

let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value: unknown) => void;
  reject: (reason?: unknown) => void;
}> = [];

const processQueue = (error: unknown, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

const authRequestInterceptor = (config: InternalAxiosRequestConfig) => {
  const token = useAuthStore.getState().token;
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
};

const errorResponseInterceptor = async (error: AxiosError) => {
  const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

  if (error.response?.status === 401 && !originalRequest._retry) {
    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        failedQueue.push({ resolve, reject });
      }).then((token) => {
        if (originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${token}`;
        }
        return apiClient(originalRequest);
      });
    }

    originalRequest._retry = true;
    isRefreshing = true;

    try {
      const refreshToken = useAuthStore.getState().refreshToken;
      if (!refreshToken) {
        throw new Error('No refresh token');
      }

      const { data } = await axios.post('/api/v1/auth/refresh', { refreshToken });
      const { token, refreshToken: newRefreshToken } = data;

      useAuthStore.getState().setTokens(token, newRefreshToken);
      processQueue(null, token);

      if (originalRequest.headers) {
        originalRequest.headers.Authorization = `Bearer ${token}`;
      }
      return apiClient(originalRequest);
    } catch (refreshError) {
      processQueue(refreshError, null);
      useAuthStore.getState().logout();
      window.location.href = '/login';
      return Promise.reject(refreshError);
    } finally {
      isRefreshing = false;
    }
  }

  const message = error.response?.data && typeof error.response.data === 'object'
    ? (error.response.data as { message?: string }).message
    : error.message;

  return Promise.reject(new Error(message || 'An error occurred'));
};

apiClient.interceptors.request.use(authRequestInterceptor, (error) => Promise.reject(error));
aiApiClient.interceptors.request.use(authRequestInterceptor, (error) => Promise.reject(error));
mentorApiClient.interceptors.request.use(authRequestInterceptor, (error) => Promise.reject(error));

apiClient.interceptors.response.use((response) => response, errorResponseInterceptor);
aiApiClient.interceptors.response.use((response) => response, errorResponseInterceptor);
mentorApiClient.interceptors.response.use((response) => response, errorResponseInterceptor);

export default apiClient;
