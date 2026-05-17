const AUTH_CHANGE_EVENT = 'authchange';
const INCONSISTENCY_REASON_EVENT = 'inconsistencyreasonrequired';
const INCONSISTENCY_REASON_KEY = 'needs_inconsistency_reason';
const INCONSISTENCY_GAP_DAYS_KEY = 'inconsistency_gap_days';
const REMEMBER_ME_PREFERENCE_KEY = 'remember_me_preference';

let authSnapshot = false;

export const getRememberMePreference = () => localStorage.getItem(REMEMBER_ME_PREFERENCE_KEY) === 'true';

export const setRememberMePreference = (rememberMe) => {
  localStorage.setItem(REMEMBER_ME_PREFERENCE_KEY, String(Boolean(rememberMe)));
};

export const getPendingInconsistencyReason = () => ({
  needsInconsistencyReason: sessionStorage.getItem(INCONSISTENCY_REASON_KEY) === 'true',
  gapDays: Number(sessionStorage.getItem(INCONSISTENCY_GAP_DAYS_KEY) || 0),
});

export const setPendingInconsistencyReason = (needsReason, gapDays = 0) => {
  console.log('[InconsistencyPopup] setPendingInconsistencyReason', {
    needsReason: Boolean(needsReason),
    gapDays: Number(gapDays) || 0,
  });

  if (needsReason) {
    sessionStorage.setItem(INCONSISTENCY_REASON_KEY, 'true');
    sessionStorage.setItem(INCONSISTENCY_GAP_DAYS_KEY, String(Number(gapDays) || 0));
  } else {
    sessionStorage.removeItem(INCONSISTENCY_REASON_KEY);
    sessionStorage.removeItem(INCONSISTENCY_GAP_DAYS_KEY);
  }

  window.dispatchEvent(new CustomEvent(INCONSISTENCY_REASON_EVENT, {
    detail: {
      needsInconsistencyReason: Boolean(needsReason),
      gapDays: Number(gapDays) || 0,
    },
  }));
};

export const subscribeToInconsistencyReason = (listener) => {
  const handleChange = (event) => {
    if (event.type === INCONSISTENCY_REASON_EVENT) {
      listener({
        needsInconsistencyReason: Boolean(event.detail?.needsInconsistencyReason),
        gapDays: Number(event.detail?.gapDays) || 0,
      });
      return;
    }

    listener(getPendingInconsistencyReason());
  };

  window.addEventListener('storage', handleChange);
  window.addEventListener(INCONSISTENCY_REASON_EVENT, handleChange);

  return () => {
    window.removeEventListener('storage', handleChange);
    window.removeEventListener(INCONSISTENCY_REASON_EVENT, handleChange);
  };
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
