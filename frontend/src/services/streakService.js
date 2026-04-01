import apiClient from './axiosConfig';
import { createServiceError } from './serviceUtils';

export const fetchStreak = async () => {
  try {
    const { data } = await apiClient.get('/api/streak/fetch');
    return data;
  } catch (error) {
    throw createServiceError(error, 'Unable to load streak data.');
  }
};
