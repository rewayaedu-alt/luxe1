import { createContext, useContext, useState, useEffect, useCallback } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoadingAuth, setIsLoadingAuth] = useState(true);
  const [authChecked, setAuthChecked] = useState(false);
  const [authError, setAuthError] = useState(null);

  const checkUserAuth = useCallback(() => {
    try {
      setIsLoadingAuth(true);
      const token = localStorage.getItem('adminToken');
      setIsAuthenticated(!!token);
      setAuthError(null);
    } catch (err) {
      setAuthError({ type: 'auth_check_failed', message: err.message });
    } finally {
      setIsLoadingAuth(false);
      setAuthChecked(true);
    }
  }, []);

  useEffect(() => {
    checkUserAuth();
  }, [checkUserAuth]);

  const login = useCallback((credentials) => {
    // Simple authentication - in production, this should call a backend API
    const { password } = credentials;
    const ADMIN_PASSWORD = 'admin123'; // TODO: Use proper backend authentication

    if (password === ADMIN_PASSWORD) {
      localStorage.setItem('adminToken', 'admin-token-' + Date.now());
      setIsAuthenticated(true);
      setAuthError(null);
      return true;
    } else {
      setAuthError({ type: 'invalid_credentials', message: 'Invalid password' });
      return false;
    }
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('adminToken');
    setIsAuthenticated(false);
    setAuthError(null);
  }, []);

  return (
    <AuthContext.Provider value={{
      isAuthenticated,
      isLoadingAuth,
      authChecked,
      authError,
      checkUserAuth,
      login,
      logout
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
