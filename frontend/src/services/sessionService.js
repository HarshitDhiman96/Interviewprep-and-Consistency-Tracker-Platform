const AUTH_CHANGE_EVENT = 'authchange';

const decodeTokenPayload = (token) => {
  try {
    const payload = token.split('.')[1];

    if (!payload) {
      return null;
    }

    const normalized = payload.replace(/-/g, '+').replace(/_/g, '/');
    return JSON.parse(atob(normalized));
  } catch {
    return null;
  }
};

export const getSessionToken = () => localStorage.getItem('token');

export const hasActiveSession = () => {
  const token = getSessionToken();

  if (!token) {
    return false;
  }

  const payload = decodeTokenPayload(token);

  if (!payload?.exp) {
    return true;
  }

  const isExpired = payload.exp * 1000 <= Date.now();

  if (isExpired) {
    localStorage.removeItem('token');
    return false;
  }

  return true;
};

export const setSessionToken = (token) => {
  localStorage.setItem('token', token);
  window.dispatchEvent(new Event(AUTH_CHANGE_EVENT));
};

export const clearSessionToken = () => {
  localStorage.removeItem('token');
  window.dispatchEvent(new Event(AUTH_CHANGE_EVENT));
};

export const subscribeToSessionChanges = (listener) => {
  const handleChange = () => listener(hasActiveSession());

  window.addEventListener('storage', handleChange);
  window.addEventListener(AUTH_CHANGE_EVENT, handleChange);

  return () => {
    window.removeEventListener('storage', handleChange);
    window.removeEventListener(AUTH_CHANGE_EVENT, handleChange);
  };
};
