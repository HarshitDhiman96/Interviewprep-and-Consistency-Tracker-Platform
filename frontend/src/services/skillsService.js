import apiClient from './axiosConfig';
import { createServiceError } from './serviceUtils';

export const fetchSkills = async () => {
  try {
    const { data } = await apiClient.get('/api/skills/fetch');
    return data;
  } catch (error) {
    throw createServiceError(error, 'Unable to load skills.');
  }
};

export const addSkill = async (newskillname) => {
  try {
    const { data } = await apiClient.post('/api/skills/add', { newskillname });
    return data;
  } catch (error) {
    throw createServiceError(error, 'Unable to add that skill.');
  }
};

export const deleteSkill = async (skillId) => {
  try {
    const { data } = await apiClient.post(`/api/skills/delete/${skillId}`);
    return data;
  } catch (error) {
    throw createServiceError(error, 'Unable to delete that skill.');
  }
};
