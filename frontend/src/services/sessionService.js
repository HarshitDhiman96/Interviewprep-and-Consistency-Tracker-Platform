const AUTH_CHANGE_EVENT = 'authchange';
const REMEMBER_ME_PREFERENCE_KEY = 'remember_me_preference';

let authSnapshot = false;

export const getRememberMePreference = () => localStorage.getItem(REMEMBER_ME_PREFERENCE_KEY) === 'true';

export const setRememberMePreference = (rememberMe) => {
  localStorage.setItem(REMEMBER_ME_PREFERENCE_KEY, String(Boolean(rememberMe)));
};

export const getAuthSnapshot = () => authSnapshot;

export const notifySessionChange = (isAuthenticated) => {
  authSnapshot = Boolean(isAuthenticated);
  window.dispatchEvent(new CustomEvent(AUTH_CHANGE_EVENT, {
    detail: { isAuthenticated: authSnapshot },
  }));
};

export const subscribeToSessionChanges = (listener) => {
  const handleChange = (event) => {
    if (event.type === 'storage' && event.key && event.key !== REMEMBER_ME_PREFERENCE_KEY) {
      return;
    }

    if (event.type === AUTH_CHANGE_EVENT) {
      listener(Boolean(event.detail?.isAuthenticated));
      return;
    }

    listener(authSnapshot);
  };

  window.addEventListener('storage', handleChange);
  window.addEventListener(AUTH_CHANGE_EVENT, handleChange);

  return () => {
    window.removeEventListener('storage', handleChange);
    window.removeEventListener(AUTH_CHANGE_EVENT, handleChange);
  };
};
