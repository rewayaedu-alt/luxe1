import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { galleryApi } from '../services/galleryApi';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoadingAuth, setIsLoadingAuth] = useState(true);
  const [authChecked, setAuthChecked] = useState(false);
  const [authError, setAuthError] = useState(null);
  const [user, setUser] = useState(null);

  const checkUserAuth = useCallback(async () => {
    try {
      setIsLoadingAuth(true);
      const token = localStorage.getItem('adminToken');
      
      if (token) {
        try {
          const data = await galleryApi.verifyAuth();
          if (data.user) {
            setUser(data.user);
            setIsAuthenticated(true);
            setAuthError(null);
          } else {
            throw new Error('Invalid token');
          }
        } catch (err) {
          localStorage.removeItem('adminToken');
          setIsAuthenticated(false);
          setUser(null);
        }
      } else {
        setIsAuthenticated(false);
        setUser(null);
      }
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

  const login = useCallback(async (credentials) => {
    try {
      setIsLoadingAuth(true);
      const { username, password } = credentials;

      const data = await galleryApi.login(username, password);
      
      if (data.token && data.user) {
        localStorage.setItem('adminToken', data.token);
        setUser(data.user);
        setIsAuthenticated(true);
        setAuthError(null);
        return true;
      }
      return false;
    } catch (err) {
      setAuthError({ type: 'login_failed', message: err.message });
      return false;
    } finally {
      setIsLoadingAuth(false);
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      await galleryApi.logout();
    } catch (err) {
      console.error('Logout error:', err);
    } finally {
      localStorage.removeItem('adminToken');
      setIsAuthenticated(false);
      setUser(null);
      setAuthError(null);
    }
  }, []);

  return (
    <AuthContext.Provider value={{
      isAuthenticated,
      isLoadingAuth,
      authChecked,
      authError,
      user,
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
