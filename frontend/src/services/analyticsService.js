import apiClient from './axiosConfig';
import { createServiceError } from './serviceUtils';

export const fetchSkillProgress = async () => {
  try {
    const { data } = await apiClient.get('/api/analytics/progressskill');
    return data;
  } catch (error) {
    throw createServiceError(error, 'Unable to load skill progress.');
  }
};

export const fetchWeeklyProgress = async () => {
  try {
    const { data } = await apiClient.get('/api/analytics/progressweekly');
    return data;
  } catch (error) {
    throw createServiceError(error, 'Unable to load weekly progress.');
  }
};

export const fetchConsistency = async () => {
  try {
    const { data } = await apiClient.get('/api/analytics/consistency');
    return data;
  } catch (error) {
    throw createServiceError(error, 'Unable to load consistency metrics.');
  }
};

export const fetchWeakAreas = async () => {
  try {
    const { data } = await apiClient.get('/api/analytics/weakarea');
    return data;
  } catch (error) {
    throw createServiceError(error, 'Unable to load weak area analytics.');
  }
};

export const saveHeatmapClicks = async (clicks) => {
  try {
    const { data } = await apiClient.post('/api/analytics/click', { clicks });
    return data;
  } catch (error) {
    throw createServiceError(error, 'Unable to save heatmap clicks.');
  }
};

export const fetchHeatmap = async (route) => {
  try {
    const { data } = await apiClient.get('/api/analytics/heatmap', {
      params: { route },
    });
    return data;
  } catch (error) {
    throw createServiceError(error, 'Unable to load heatmap data.');
  }
};
