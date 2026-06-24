import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:4000/api',
  withCredentials: true, 
});

let accessToken = null;
export const setAccessToken = (token) => {
  accessToken = token;
};
export const getAccessToken = () => accessToken;

api.interceptors.request.use((config) => {
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  return config;
});

let isRefreshing = false;
let refreshQueue = [];

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    const isRefreshCall = originalRequest?.url?.includes('/auth/refresh');
    const isLoginCall = originalRequest?.url?.includes('/auth/login');
    const isRegisterCall = originalRequest?.url?.includes('/auth/register');

    if (
      error.response?.status !== 401 ||
      originalRequest._retry ||
      isRefreshCall ||
      isLoginCall ||
      isRegisterCall
    ) {
      return Promise.reject(error);
    }

    originalRequest._retry = true;

    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        refreshQueue.push({ resolve, reject });
      }).then((newToken) => {
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return api(originalRequest);
      });
    }

    isRefreshing = true;
    try {
      const { data } = await api.post('/auth/refresh');
      setAccessToken(data.accessToken);
      refreshQueue.forEach((p) => p.resolve(data.accessToken));
      refreshQueue = [];
      originalRequest.headers.Authorization = `Bearer ${data.accessToken}`;
      return api(originalRequest);
    } catch (refreshErr) {
      refreshQueue.forEach((p) => p.reject(refreshErr));
      refreshQueue = [];
      setAccessToken(null);
      window.location.href = '/login';
      return Promise.reject(refreshErr);
    } finally {
      isRefreshing = false;
    }

    return Promise.reject(error);
  }
);

export default api;
