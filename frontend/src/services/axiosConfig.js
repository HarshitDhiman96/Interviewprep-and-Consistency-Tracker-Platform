import axios from 'axios';
import { notifySessionChange, setPendingInconsistencyReason } from './sessionService';
import { API_BASE_URL } from './apiConfig';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15000,
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;

    if (status === 401) {
      notifySessionChange(false);
      console.error('Unauthorized API request. Cookie-based session is missing or expired.');
    } else if (status === 423 && error.response?.data?.needsInconsistencyReason) {
      console.log('[InconsistencyPopup] API blocked with pending reason', error.response.data);
      setPendingInconsistencyReason(true, error.response?.data?.gapDays);
      console.error('Inconsistency reason is required before continuing.');
    } else if (status >= 500) {
      console.error('Backend server error:', error.response?.data || error.message);
    } else if (error.code === 'ECONNABORTED') {
      console.error('API request timed out:', error.message);
    } else if (!error.response) {
      console.error('Network error while contacting backend:', error.message);
    } else {
      console.error('API request failed:', error.response?.data || error.message);
    }

    return Promise.reject(error);
  },
);

export default apiClient;
