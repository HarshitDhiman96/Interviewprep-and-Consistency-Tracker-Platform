import apiClient from './axiosConfig';
import { createServiceError } from './serviceUtils';

export const addLog = async (payload) => {
  try {
    const { data } = await apiClient.post('/api/log/add', payload);
    return data;
  } catch (error) {
    throw createServiceError(error, 'Unable to save your study log.');
  }
};

export const fetchDailyLog = async (date) => {
  try {
    const { data } = await apiClient.post('/api/log/dailylog', { date });
    return data;
  } catch (error) {
    throw createServiceError(error, 'Unable to load today\'s logs.');
  }
};

export const fetchWeekLog = async ({ startDate, endDate }) => {
  try {
    const { data } = await apiClient.post('/api/log/weeklog', { startDate, endDate });
    return data;
  } catch (error) {
    throw createServiceError(error, 'Unable to load weekly logs.');
  }
};

export const filterLogsBySkill = async (skill) => {
  try {
    const { data } = await apiClient.get('/api/log/filterbyskills', {
      params: { skill },
    });
    return data;
  } catch (error) {
    throw createServiceError(error, 'Unable to filter logs by skill.');
  }
};

export const fetchAllLogs = async () => {
  try {
    const { data } = await apiClient.get('/api/log/all');
    return data;
  } catch (error) {
    throw createServiceError(error, 'Unable to load your logs.');
  }
};
