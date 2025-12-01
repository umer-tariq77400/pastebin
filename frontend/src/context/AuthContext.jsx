import { useState, useEffect } from 'react';
import { AuthContext } from './AuthContextSetup';
import * as authAPI from '../api/auth';

// Auth Provider Component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Check if user is already logged in on app load
  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        // Try to fetch snippets to see if authenticated
        // If this succeeds without 403/401, user is logged in
        const response = await authAPI.getCurrentUser();
        if (response.status === 200 && response.data) {
          // If we get here, user is authenticated
          setUser({ id: response.data.id, username: response.data.username });
          setError(null);
        }
      } catch {
        console.log('User not authenticated on app load');
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkAuthStatus();
  }, []);

  // Login function
  const login = async (username, password) => {
    setLoading(true);
    setError(null);
    try {
      // Step 1: Send login credentials (this sets the session cookie)
      await authAPI.login(username, password);
      
      // Step 2: After login response, fetch current user to verify session is valid
      // This also gives us the actual user data
      const userResponse = await authAPI.getCurrentUser();
      if (userResponse.status === 200 && userResponse.data) {
        // Set user as authenticated with returned info
        setUser({ id: userResponse.data.id, username: userResponse.data.username });
        return { success: true };
      } else {
        // Login succeeded but couldn't fetch user data
        setError('Login failed: Could not fetch user data');
        return { success: false, error: 'Login failed: Could not fetch user data' };
      }
    } catch (err) {
      console.error('Login error:', {
        status: err.response?.status,
        data: err.response?.data,
        headers: err.response?.headers,
        message: err.message
      });
      const errorMsg = err.response?.data?.non_field_errors?.[0] || 
                       err.response?.data?.detail || 
                       err.message || 
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
      if (response.status === 201) {
        // Registration successful, now login
        return await login(username, password);
      }
    } catch (err) {
      console.error('Registration error:', {
        status: err.response?.status,
        data: err.response?.data,
        message: err.message
      });
      const errorMsg = err.response?.data?.username?.[0] || 
                       err.response?.data?.password?.[0] ||
                       err.response?.data?.detail || 
                       err.message || 
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
      setUser(null);
      return { success: true };
    } catch (err) {
      // Even if logout request fails, clear local session
      setUser(null);
      const errorMsg = err.response?.data?.detail || 'Logged out locally';
      console.log(errorMsg);
      return { success: true };
    } finally {
      setLoading(false);
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
