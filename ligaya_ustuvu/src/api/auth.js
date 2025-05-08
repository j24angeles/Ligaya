// auth.js - Authentication service with exported functions
import axios from 'axios';

// API base URL - replace with your actual API endpoint
const API_URL = process.env.REACT_APP_API_URL || 'https://your-api-url.com/api';

// User registration function
export const registerUser = async (userData) => {
  try {
    const response = await axios.post(`${API_URL}/auth/register`, userData);
    
    if (response.data && response.data.token) {
      // Store token in localStorage
      localStorage.setItem('authToken', response.data.token);
      
      // Store user info
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    
    return {
      success: true,
      data: response.data
    };
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || 'Registration failed. Please try again.'
    };
  }
};

// User login function
export const loginUser = async (credentials) => {
  try {
    const response = await axios.post(`${API_URL}/auth/login`, credentials);
    
    if (response.data && response.data.token) {
      // Store token in localStorage
      localStorage.setItem('authToken', response.data.token);
      
      // Store user info
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    
    return {
      success: true,
      data: response.data
    };
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || 'Invalid credentials. Please try again.'
    };
  }
};

// User logout function
export const logoutUser = () => {
  // Remove token and user data from localStorage
  localStorage.removeItem('authToken');
  localStorage.removeItem('user');
  
  // Optionally: Call logout endpoint to invalidate token on server
  try {
    axios.post(`${API_URL}/auth/logout`, {}, {
      headers: { Authorization: `Bearer ${getAuthToken()}` }
    });
  } catch (error) {
    console.error('Logout error:', error);
  }
};

// Check if user is authenticated
export const isAuthenticated = () => {
  const token = getAuthToken();
  return !!token; // Return true if token exists, false otherwise
};

// Get current user from localStorage
export const getCurrentUser = () => {
  try {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  } catch (error) {
    console.error('Error getting current user:', error);
    return null;
  }
};

// Get authentication token
export const getAuthToken = () => {
  return localStorage.getItem('authToken');
};

// Check if user has a specific role
export const hasRole = (requiredRole) => {
  const user = getCurrentUser();
  
  if (!user || !user.role) {
    return false;
  }
  
  // If requiredRole is an array, check if user has any of the roles
  if (Array.isArray(requiredRole)) {
    return requiredRole.includes(user.role);
  }
  
  // If requiredRole is a string, check if user has that role
  return user.role === requiredRole;
};

// Set auth token in axios headers for all requests
export const setAuthHeader = (token) => {
  if (token) {
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete axios.defaults.headers.common['Authorization'];
  }
};

// Initialize auth on app load
export const initAuth = () => {
  const token = getAuthToken();
  if (token) {
    setAuthHeader(token);
  }
};

// Refresh user data from server
export const refreshUserData = async () => {
  if (!isAuthenticated()) {
    return { success: false };
  }
  
  try {
    const response = await axios.get(`${API_URL}/auth/me`, {
      headers: { Authorization: `Bearer ${getAuthToken()}` }
    });
    
    // Update user data in localStorage
    localStorage.setItem('user', JSON.stringify(response.data));
    
    return { 
      success: true,
      data: response.data
    };
  } catch (error) {
    console.error('Error refreshing user data:', error);
    
    // If token is invalid/expired, log out user
    if (error.response?.status === 401) {
      logoutUser();
    }
    
    return { 
      success: false,
      message: error.response?.data?.message || 'Failed to refresh user data'
    };
  }
};

// Update user profile
export const updateUserProfile = async (userData) => {
  try {
    const response = await axios.put(`${API_URL}/auth/profile`, userData, {
      headers: { Authorization: `Bearer ${getAuthToken()}` }
    });
    
    // Update user data in localStorage
    const updatedUser = { ...getCurrentUser(), ...response.data };
    localStorage.setItem('user', JSON.stringify(updatedUser));
    
    return {
      success: true,
      data: response.data
    };
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || 'Failed to update profile'
    };
  }
};

// Password reset request
export const requestPasswordReset = async (email) => {
  try {
    const response = await axios.post(`${API_URL}/auth/password-reset-request`, { email });
    
    return {
      success: true,
      message: response.data.message || 'Reset link sent to your email'
    };
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || 'Failed to request password reset'
    };
  }
};

// Reset password
export const resetPassword = async (token, newPassword) => {
  try {
    const response = await axios.post(`${API_URL}/auth/password-reset`, {
      token,
      newPassword
    });
    
    return {
      success: true,
      message: response.data.message || 'Password reset successful'
    };
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || 'Failed to reset password'
    };
  }
};

// Export default for backward compatibility
export default {
  registerUser,
  loginUser,
  logoutUser,
  isAuthenticated,
  getCurrentUser,
  getAuthToken,
  hasRole,
  setAuthHeader,
  initAuth,
  refreshUserData,
  updateUserProfile,
  requestPasswordReset,
  resetPassword
};