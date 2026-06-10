import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { fetchCurrentUser, loginUser, logoutUser, updateRememberMe, updateUserGoal } from '../services/authService';
import { submitInconsistencyReason } from '../services/inconsistencyReasonService';
import {
  getPendingInconsistencyReason,
  getRememberMePreference,
  notifySessionChange,
  setPendingInconsistencyReason,
  setRememberMePreference,
  subscribeToInconsistencyReason
} from '../services/sessionService';

const AuthContext = createContext();
const DEBUG_INCONSISTENCY_POPUP = true;

const logInconsistencyPopup = (...args) => {
  if (DEBUG_INCONSISTENCY_POPUP) {
    console.log('[InconsistencyPopup]', ...args);
  }
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [needsInconsistencyReason, setNeedsInconsistencyReason] = useState(
    () => getPendingInconsistencyReason().needsInconsistencyReason
  );
  const [inconsistencyGapDays, setInconsistencyGapDays] = useState(
    () => getPendingInconsistencyReason().gapDays
  );

  const applyInconsistencyState = useCallback((needsReason, gapDays = 0) => {
    logInconsistencyPopup('applyInconsistencyState', {
      needsReason: Boolean(needsReason),
      gapDays: Number(gapDays) || 0,
    });
    setPendingInconsistencyReason(needsReason, gapDays);
    setNeedsInconsistencyReason(Boolean(needsReason));
    setInconsistencyGapDays(Number(gapDays) || 0);
  }, []);

  const refreshAuth = useCallback(async () => {
    setAuthLoading(true);

    try {
      const data = await fetchCurrentUser();
      const nextUser = data?.user || null;
      const pendingReason = getPendingInconsistencyReason();
      const serverNeedsReason = Boolean(data?.needsInconsistencyReason || nextUser?.needsInconsistencyReason);
      const nextNeedsReason = serverNeedsReason || pendingReason.needsInconsistencyReason;
      const nextGapDays = data?.gapDays || nextUser?.gapDays || pendingReason.gapDays || 0;

      logInconsistencyPopup('refreshAuth response', {
        serverNeedsReason,
        pendingReason,
        nextNeedsReason,
        nextGapDays,
        rawResponse: data,
      });

      setUser(nextUser);
      applyInconsistencyState(nextNeedsReason, nextGapDays);
      setRememberMePreference(Boolean(nextUser?.rememberMe));
      notifySessionChange(Boolean(nextUser));
      return nextUser;
    } catch (error) {
      if (error.status === 401) {
        setUser(null);
        applyInconsistencyState(false);
        notifySessionChange(false);
        return null;
      }

      throw error;
    } finally {
      setAuthLoading(false);
    }
  }, [applyInconsistencyState]);

  useEffect(() => {
    refreshAuth().catch(() => {
      setUser(null);
      applyInconsistencyState(false);
      notifySessionChange(false);
      setAuthLoading(false);
    });
  }, [applyInconsistencyState, refreshAuth]);

  useEffect(() => subscribeToInconsistencyReason((state) => {
    setNeedsInconsistencyReason(Boolean(state.needsInconsistencyReason));
    setInconsistencyGapDays(Number(state.gapDays) || 0);
  }), []);

  const login = useCallback(async ({ email, password, rememberMe }) => {
    const data = await loginUser({ email, password, rememberMe });
    setRememberMePreference(Boolean(rememberMe));
    logInconsistencyPopup('login response', {
      needsInconsistencyReason: data?.needsInconsistencyReason,
      userNeedsInconsistencyReason: data?.user?.needsInconsistencyReason,
      gapDays: data?.gapDays || data?.user?.gapDays || 0,
      inconsistencyCheck: data?.inconsistencyCheck,
      rawResponse: data,
    });
    applyInconsistencyState(
      Boolean(data?.needsInconsistencyReason || data?.user?.needsInconsistencyReason),
      data?.gapDays || data?.user?.gapDays || 0
    );
    await refreshAuth();
    return data;
  }, [applyInconsistencyState, refreshAuth]);

  const logout = useCallback(async () => {
    try {
      await logoutUser();
    } finally {
      setUser(null);
      applyInconsistencyState(false);
      notifySessionChange(false);
    }
  }, [applyInconsistencyState]);

  const submitReason = useCallback(async ({ reason, tag }) => {
    const data = await submitInconsistencyReason({
      reason,
      tag,
      gapDays: inconsistencyGapDays,
    });

    applyInconsistencyState(false);
    setUser((current) => (
      current
        ? { ...current, needsInconsistencyReason: false, gapDays: 0 }
        : current
    ));

    return data;
  }, [applyInconsistencyState, inconsistencyGapDays]);

  const setRememberMe = useCallback(async (rememberMe) => {
    const data = await updateRememberMe(Boolean(rememberMe));
    setRememberMePreference(Boolean(rememberMe));
    setUser((current) => (current ? { ...current, rememberMe: Boolean(rememberMe) } : current));
    notifySessionChange(true);
    return data;
  }, []);

  const updateGoal = useCallback(async (primaryGoal) => {
    const data = await updateUserGoal(primaryGoal);
    setUser((current) => ({
      ...(current || {}),
      ...(data?.user || {}),
      primaryGoal,
      goalCompleted: true,
    }));
    notifySessionChange(true);
    return data;
  }, []);

  const value = useMemo(() => ({
    user,
    isAuthenticated: Boolean(user),
    authLoading,
    rememberMePreference: user?.rememberMe ?? getRememberMePreference(),
    needsInconsistencyReason,
    inconsistencyGapDays,
    login,
    logout,
    refreshAuth,
    setRememberMe,
    updateGoal,
    submitReason,
  }), [
    authLoading,
    inconsistencyGapDays,
    login,
    logout,
    needsInconsistencyReason,
    refreshAuth,
    setRememberMe,
    submitReason,
    updateGoal,
    user
  ]);

  useEffect(() => {
    logInconsistencyPopup('state changed', {
      isAuthenticated: Boolean(user),
      needsInconsistencyReason,
      inconsistencyGapDays,
      userNeedsInconsistencyReason: user?.needsInconsistencyReason,
      userGapDays: user?.gapDays,
    });
  }, [inconsistencyGapDays, needsInconsistencyReason, user]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
