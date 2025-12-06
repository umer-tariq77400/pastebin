import { useState, useEffect } from 'react';
import { AuthContext } from './AuthContextSetup';
import * as authAPI from '../api/auth';

// Auth Provider Component
export const AuthProvider = ({ children }) => {
  // Initialize user from local storage immediately for optimistic UI
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem('user');
    const token = localStorage.getItem('token');
    if (storedUser && token) {
        return JSON.parse(storedUser);
    }
    return null;
  });

  // Loading state can now default to false since we have an optimistic user
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Verify token validity in background
  useEffect(() => { 
    const verifyAuth = async () => {
      const token = localStorage.getItem('token');
      
      if (token) {
        try {
            // If this fails (e.g. token expired), we log them out
            await authAPI.getCurrentUser();
        } catch {
            console.log('Session expired or invalid');
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            setUser(null);
        }
      }
    };

    verifyAuth();
  }, []);

  // Login function
  const login = async (username, password) => {
    setLoading(true);
    setError(null);
    try {
      const response = await authAPI.login(username, password);
      
      if (response.status === 200 && response.data.token) {
        const { token, user } = response.data;
        
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));
        setUser(user);
        
        return { success: true };
      } else {
        throw new Error('Invalid response from server');
      }
    } catch (err) {
      console.error('Login error:', err);
      const errorMsg = err.response?.data?.error || 
                       err.response?.data?.detail || 
                       'Login failed';
      setError(errorMsg);
      return { success: false, error: errorMsg };
    } finally {
      setLoading(false);
    }
  };

  // Register function
  const register = async (username, email, password) => {
    setLoading(true);
    setError(null);
    try {
      const response = await authAPI.register(username, email, password);
      
      if (response.status === 201 && response.data.token) {
        const { token, user } = response.data;
        
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));
        setUser(user);
        
        return { success: true };
      }
    } catch (err) {
      console.error('Registration error:', err);
      const errorMsg = err.response?.data?.username?.[0] || 
                       err.response?.data?.password?.[0] ||
                       err.response?.data?.detail || 
                       'Registration failed';
      setError(errorMsg);
      return { success: false, error: errorMsg };
    } finally {
      setLoading(false);
    }
  };


  // Logout function
  const logout = async () => {
    setLoading(true);
    setError(null);
    try {
      await authAPI.logout();
    } catch {
      return { success: false, error: 'Logout failed' };
    } finally {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      setUser(null);
      setLoading(false);
    }
    return { success: true };
  };

  const value = {
    user,
    setUser,
    loading,
    error,
    login,
    register,
    logout,
    isAuthenticated: !!user,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
