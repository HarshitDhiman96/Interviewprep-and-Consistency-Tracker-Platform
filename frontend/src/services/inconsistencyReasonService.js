import apiClient from './axiosConfig';
import { createServiceError } from './serviceUtils';

export const submitInconsistencyReason = async ({ reason, tag, gapDays }) => {
  try {
    const { data } = await apiClient.post('/api/inconsistency-reason', {
      reason,
      tag,
      gapDays,
    });
    return data;
  } catch (error) {
    throw createServiceError(error, 'Unable to save your reason right now.');
  }
};
