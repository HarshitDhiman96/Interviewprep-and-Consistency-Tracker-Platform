import apiClient from './axiosConfig';
import { createServiceError } from './serviceUtils';

export const loginUser = async ({ email, password }) => {
  try {
    const { data } = await apiClient.post('/api/auth/login', { email, password });
    return data;
  } catch (error) {
    throw createServiceError(error, 'Unable to log in right now.');
  }
};

export const registerUser = async ({ name, email, password, role, skills }) => {
  try {
    const { data } = await apiClient.post('/api/auth/register', {
      name,
      email,
      password,
      role,
      skills,
    });
    return data;
  } catch (error) {
    throw createServiceError(error, 'Unable to create your account right now.');
  }
};

export const changePassword = async ({ email, oldpassword, newpassword }) => {
  try {
    const { data } = await apiClient.post('/api/auth/changepassword', {
      email,
      oldpassword,
      newpassword,
    });
    return data;
  } catch (error) {
    throw createServiceError(error, 'Unable to change your password right now.');
  }
};
