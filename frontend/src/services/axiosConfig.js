import axios from 'axios';
import { notifySessionChange } from './sessionService';

const resolveApiBaseUrl = () => {
  if (globalThis.process?.env?.REACT_APP_API_URL) {
    return globalThis.process.env.REACT_APP_API_URL;
  }

  if (import.meta.env?.VITE_API_URL) {
    return import.meta.env.VITE_API_URL;
  }

  return '/';
};

const apiClient = axios.create({
  baseURL: resolveApiBaseUrl(),
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;

    if (status === 401) {
      notifySessionChange(false);
      console.error('Unauthorized API request. Cookie-based session is missing or expired.');
    } else if (status >= 500) {
      console.error('Backend server error:', error.response?.data || error.message);
    } else {
      console.error('API request failed:', error.response?.data || error.message);
    }

    return Promise.reject(error);
  },
);

export default apiClient;
