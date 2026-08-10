import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserRole } from '../types';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api/v1';

interface AuthContextType {
  currentUser: User | null;
  loading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<boolean>;
  loginWithGoogle: (googleData: {
    idToken: string;
    role?: UserRole;
  }) => Promise<void>;
  logout: () => void;
  fetchCurrentUser: () => Promise<void>;
  updateProfile: (updatedData: Partial<User>) => Promise<void>;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const clearError = () => setError(null);

  const getAuthHeaders = () => {
    const token = localStorage.getItem('auth_token');
    return {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` }),
    };
  };

  const login = async (email: string, password: string) => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();
      if (data.success) {
        localStorage.setItem('auth_token', data.data.token);
        setCurrentUser(data.data.user);
        // Clear any stale mock data
        localStorage.removeItem('we_donate_current_user');
        localStorage.removeItem('we_donate_users');
        return true;
      } else {
        setError(data.message || 'Login failed');
        return false;
      }
    } catch (error) {
      console.error('Login error:', error);
      setError('Network error. Please try again.');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const loginWithGoogle = async (googleData: {
    idToken: string;
    role?: UserRole;
  }) => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(`${API_BASE_URL}/auth/google`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(googleData),
      });
      const data = await response.json();
      if (data.success) {
        localStorage.setItem('auth_token', data.data.token);
        const user = data.data.user;
        console.log('Google auth user data:', user);
        console.log('User role:', user.role);
        // Clear any stale mock data
        localStorage.removeItem('we_donate_current_user');
        localStorage.removeItem('we_donate_users');
        setCurrentUser(user);
      } else {
        throw new Error(data.message || 'Google authentication failed');
      }
    } catch (error) {
      console.error('Google auth error:', error);
      setError(error instanceof Error ? error.message : 'Google authentication failed');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('we_donate_current_user');
    localStorage.removeItem('we_donate_users');
    setCurrentUser(null);
    setError(null);
  };

  const fetchCurrentUser = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(`${API_BASE_URL}/users/me`, {
        method: 'GET',
        headers: getAuthHeaders(),
      });
      
      if (response.status === 401) {
        // Token expired or invalid, clear it
        localStorage.removeItem('auth_token');
        setCurrentUser(null);
        setError('Session expired. Please login again.');
        return;
      }
      
      const data = await response.json();
      if (data.success) {
        setCurrentUser(data.data);
      } else {
        setError(data.message || 'Failed to fetch user profile');
      }
    } catch (error) {
      console.error('Fetch current user error:', error);
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (updatedData: Partial<User>) => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(`${API_BASE_URL}/users/me`, {
        method: 'PATCH',
        headers: getAuthHeaders(),
        body: JSON.stringify(updatedData),
      });
      
      if (response.status === 401) {
        localStorage.removeItem('auth_token');
        setCurrentUser(null);
        setError('Session expired. Please login again.');
        return;
      }
      
      const data = await response.json();
      if (data.success) {
        setCurrentUser(data.data);
      } else {
        setError(data.message || 'Failed to update profile');
        throw new Error(data.message);
      }
    } catch (error) {
      console.error('Update profile error:', error);
      setError(error instanceof Error ? error.message : 'Failed to update profile');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Fetch current user on mount if token exists
  useEffect(() => {
    const token = localStorage.getItem('auth_token');
    if (token && !currentUser) {
      fetchCurrentUser();
    }
  }, []);

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        loading,
        error,
        login,
        loginWithGoogle,
        logout,
        fetchCurrentUser,
        updateProfile,
        clearError,
      }}
    >
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
