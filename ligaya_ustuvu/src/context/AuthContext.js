import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  loginUser,
  registerUser,
  getCurrentUser,
  isLoggedIn,
  logoutUser as authLogout,
  storeUserSession
} from '../api/auth'; // Assuming auth.js is in the same directory

// Create context
const AuthContext = createContext();

// Custom hook to use the auth context
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

  // Check if user is already logged in on component mount
  useEffect(() => {
    const currentUser = getCurrentUser();
    if (currentUser) {
      setUser(currentUser);
    }
    setLoading(false);
  }, []);

  // Login function
  const login = async (email, password) => {
    try {
      const userData = await loginUser(email, password);
      setUser(userData);
      return userData;
    } catch (error) {
      throw error;
    }
  };

  // Register function
  const register = async (userData) => {
    try {
      const newUser = await registerUser(userData);
      setUser(newUser);
      return newUser;
    } catch (error) {
      throw error;
    }
  };

  // Update user in state and localStorage
  const updateUser = (userData) => {
    setUser(userData);
    if (userData) {
      storeUserSession(userData);
    } else {
      authLogout();
    }
  };

  // Logout function
  const logout = () => {
    setUser(null);
    authLogout();
  };

  // Check if user is authenticated
  const isAuthenticated = isLoggedIn();

  // Check if user has a specific role
  const hasRole = (role) => {
    return isAuthenticated && user?.role === role;
  };

  const value = {
    user,
    login,
    register,
    updateUser,
    logout,
    isAuthenticated,
    hasRole,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;