import apiClient from './axiosConfig';
import { createServiceError } from './serviceUtils';

export const loginUser = async ({ email, password, rememberMe }) => {
  try {
    const { data } = await apiClient.post('/api/auth/login', { email, password, rememberMe });
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

export const fetchCurrentUser = async () => {
  try {
    const { data } = await apiClient.get('/api/auth/me');
    return data;
  } catch (error) {
    throw createServiceError(error, 'Unable to verify your session right now.');
  }
};

export const logoutUser = async () => {
  try {
    const { data } = await apiClient.post('/api/auth/logout');
    return data;
  } catch (error) {
    throw createServiceError(error, 'Unable to log out right now.');
  }
};

export const updateRememberMe = async (rememberMe) => {
  try {
    const { data } = await apiClient.post('/api/auth/remember-me', { rememberMe });
    return data;
  } catch (error) {
    throw createServiceError(error, 'Unable to update your remember me preference.');
  }
};
