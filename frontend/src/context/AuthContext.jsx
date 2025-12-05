import { useState, useEffect } from 'react';
import { AuthContext } from './AuthContextSetup';
import * as authAPI from '../api/auth';

// Auth Provider Component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Check locally stored token on app load
  useEffect(() => {
    const checkAuthStatus = async () => {
      const token = localStorage.getItem('token');
      const storedUser = localStorage.getItem('user');

      if (token && storedUser) {
        try {
          // Set user immediately from local storage for speed
          const parsedUser = JSON.parse(storedUser);
          setUser(parsedUser);

          // Verify token validity by fetching current user
          // If this fails (e.g. token expired/invalid), catch block will run
          await authAPI.getCurrentUser();
        } catch {
          console.log('Session expired or invalid');
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          setUser(null);
        }
      }
      setLoading(false);
    };

    checkAuthStatus();
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
    } catch (err) {
      console.log('Logout API failed, clearing local session anyway');
    } finally {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      setUser(null);
      setLoading(false);
      return { success: true };
    }
  };

  const value = {
    user,
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
