import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { getAuthToken, setAuthToken, removeAuthToken } from '../utils/cookieHelper';
import api from '../utils/api';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch user data from API using JWT token
  const fetchUserData = async () => {
    try {
      const { data } = await api.get('/auth/me');
      setUser(data.data);
      return data.data;
    } catch (error) {
      console.error('Error fetching user data:', error);
      // If token is invalid or expired, clear authentication
      removeAuthToken();
      setUser(null);
      throw error;
    }
  };

  useEffect(() => {
    // Check if user is logged in by verifying token and fetching user data
    const initAuth = async () => {
      const token = getAuthToken();
      
      if (token) {
        try {
          await fetchUserData();
        } catch (error) {
          // Token is invalid or expired
          console.error('Authentication failed:', error);
        }
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  const register = async (userData) => {
    try {
      const { data } = await axios.post(
        `${process.env.REACT_APP_API_URL}/auth/register`,
        userData
      );
      
      // Extract token from response
      const { token } = data.data;
      
      // Store token in cookie (persistent)
      setAuthToken(token, 7);
      
      // Fetch user data from API using the token
      await fetchUserData();
      
      return { success: true };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Registration failed'
      };
    }
  };

  const login = async (email, password) => {
    try {
      const { data } = await axios.post(
        `${process.env.REACT_APP_API_URL}/auth/login`,
        { email, password }
      );
      
      // Extract token from response
      const { token } = data.data;
      
      // Store token in cookie (persistent)
      setAuthToken(token, 7);
      
      // Fetch user data from API using the token
      await fetchUserData();
      
      return { success: true };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Login failed'
      };
    }
  };

  const logout = () => {
    // Remove token from cookie
    removeAuthToken();
    
    // Clear user state
    setUser(null);
  };

  const updateUser = async (updatedUser) => {
    try {
      // Update user profile on the server
      const { data } = await api.put('/auth/profile', updatedUser);
      
      // Fetch fresh user data from API
      await fetchUserData();
      
      return { success: true };
    } catch (error) {
      console.error('Error updating user:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to update profile'
      };
    }
  };

  const value = {
    user,
    loading,
    register,
    login,
    logout,
    updateUser,
    fetchUserData
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

