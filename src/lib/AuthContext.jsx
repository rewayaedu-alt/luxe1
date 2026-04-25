import React, { createContext, useContext, useState, useCallback } from 'react';

const AuthContext = createContext(null);
const TOKEN_KEY = 'app_access_token';

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoadingAuth, setIsLoadingAuth] = useState(false);
  const [authChecked, setAuthChecked] = useState(false);
  const [authError, setAuthError] = useState(null);

  const isAuthenticated = !!user;

  const setToken = (token) => {
    if (token) localStorage.setItem(TOKEN_KEY, token);
    else localStorage.removeItem(TOKEN_KEY);
  };

  const login = async (email, password) => {
    setIsLoadingAuth(true);
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      if (!res.ok) throw new Error('Login failed');
      const data = await res.json();
      setToken(data.token);
      setUser(data.user);
      setAuthError(null);
      setAuthChecked(true);
      return data;
    } catch (err) {
      setAuthError({ message: err.message });
      setUser(null);
      setToken(null);
      setAuthChecked(true);
      throw err;
    } finally {
      setIsLoadingAuth(false);
    }
  };

  const logout = useCallback(() => {
    setUser(null);
    setToken(null);
    setAuthChecked(false);
    setAuthError(null);
  }, []);

  const checkUserAuth = useCallback(async () => {
    const token = localStorage.getItem(TOKEN_KEY);
    if (!token) {
      setAuthChecked(true);
      setUser(null);
      return;
    }

    setIsLoadingAuth(true);
    try {
      const res = await fetch('/api/auth/me', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!res.ok) {
        setUser(null);
        setToken(null);
        setAuthError({ message: 'Unauthorized' });
        setAuthChecked(true);
        return;
      }
      const data = await res.json();
      setUser(data.user);
      setAuthError(null);
      setAuthChecked(true);
    } catch (err) {
      setUser(null);
      setToken(null);
      setAuthError({ message: err.message });
      setAuthChecked(true);
    } finally {
      setIsLoadingAuth(false);
    }
  }, []);

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, isLoadingAuth, authChecked, authError, login, logout, checkUserAuth }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}

export default AuthContext;
