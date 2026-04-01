import apiClient from './axiosConfig';
import { createServiceError } from './serviceUtils';

export const addRevision = async ({ skill, topic }) => {
  try {
    const { data } = await apiClient.post('/api/revision/add', { skill, topic });
    return data;
  } catch (error) {
    throw createServiceError(error, 'Unable to update revision tracking.');
  }
};

export const fetchRevisions = async () => {
  try {
    const { data } = await apiClient.get('/api/revision/fetch');
    return data;
  } catch (error) {
    throw createServiceError(error, 'Unable to load revisions.');
  }
};

export const deleteRevision = async (revisionId) => {
  try {
    const { data } = await apiClient.delete(`/api/revision/${revisionId}`);
    return data;
  } catch (error) {
    throw createServiceError(error, 'Unable to update revision tracking.');
  }
};
