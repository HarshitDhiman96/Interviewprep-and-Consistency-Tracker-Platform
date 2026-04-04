import axios from 'axios';
import { clearSessionToken, getSessionToken } from './sessionService';

const resolveApiBaseUrl = () => {
  if (typeof process !== 'undefined' && process.env?.REACT_APP_API_URL) {
    return process.env.REACT_APP_API_URL;
  }

  if (import.meta.env?.VITE_API_URL) {
    return import.meta.env.VITE_API_URL;
  }

  return '/';
};

const apiClient = axios.create({
  baseURL: resolveApiBaseUrl(),
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use(
  (config) => {
    const token = getSessionToken();

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error),
);

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;

    if (status === 401) {
      clearSessionToken();
      console.error('Unauthorized API request. Check the stored session token.');
    } else if (status >= 500) {
      console.error('Backend server error:', error.response?.data || error.message);
    } else {
      console.error('API request failed:', error.response?.data || error.message);
    }

    return Promise.reject(error);
  },
);

export default apiClient;
