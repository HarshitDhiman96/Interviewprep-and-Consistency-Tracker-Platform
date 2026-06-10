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

export const updateUserGoal = async (primaryGoal) => {
  const goalEndpoints = ['/api/update-goal', '/api/auth/goal'];
  let lastError;

  for (const endpoint of goalEndpoints) {
    try {
      const { data } = await apiClient.post(endpoint, { primaryGoal });
      return data;
    } catch (error) {
      lastError = error;
      const status = error.response?.status;
      const responseText = typeof error.response?.data === 'string' ? error.response.data : '';
      const isMissingRoute = status === 404 && responseText.includes('Cannot POST');

      if (!isMissingRoute) {
        throw createServiceError(error, 'Unable to update your primary goal right now.');
      }
    }
  }

  try {
    const { data } = await apiClient.put('/api/auth/goal', { primaryGoal });
    return data;
  } catch (error) {
    throw createServiceError(error || lastError, 'Unable to update your primary goal right now.');
  }
};
