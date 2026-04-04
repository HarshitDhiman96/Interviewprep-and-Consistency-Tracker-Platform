import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { fetchCurrentUser, loginUser, logoutUser, updateRememberMe } from '../services/authService';
import { getRememberMePreference, notifySessionChange, setRememberMePreference } from '../services/sessionService';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);

  const refreshAuth = useCallback(async () => {
    setAuthLoading(true);

    try {
      const data = await fetchCurrentUser();
      const nextUser = data?.user || null;
      setUser(nextUser);
      setRememberMePreference(Boolean(nextUser?.rememberMe));
      notifySessionChange(Boolean(nextUser));
      return nextUser;
    } catch (error) {
      if (error.status === 401) {
        setUser(null);
        notifySessionChange(false);
        return null;
      }

      throw error;
    } finally {
      setAuthLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshAuth().catch(() => {
      setUser(null);
      notifySessionChange(false);
      setAuthLoading(false);
    });
  }, [refreshAuth]);

  const login = useCallback(async ({ email, password, rememberMe }) => {
    const data = await loginUser({ email, password, rememberMe });
    setRememberMePreference(Boolean(rememberMe));
    await refreshAuth();
    return data;
  }, [refreshAuth]);

  const logout = useCallback(async () => {
    try {
      await logoutUser();
    } finally {
      setUser(null);
      notifySessionChange(false);
    }
  }, []);

  const setRememberMe = useCallback(async (rememberMe) => {
    const data = await updateRememberMe(Boolean(rememberMe));
    setRememberMePreference(Boolean(rememberMe));
    setUser((current) => (current ? { ...current, rememberMe: Boolean(rememberMe) } : current));
    notifySessionChange(true);
    return data;
  }, []);

  const value = useMemo(() => ({
    user,
    isAuthenticated: Boolean(user),
    authLoading,
    rememberMePreference: user?.rememberMe ?? getRememberMePreference(),
    login,
    logout,
    refreshAuth,
    setRememberMe,
  }), [authLoading, login, logout, refreshAuth, setRememberMe, user]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
