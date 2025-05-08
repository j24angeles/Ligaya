import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getCurrentUser, logoutUser as authLogoutUser } from '../api/auth';

// Create context
const AuthContext = createContext(null);

// Auth provider component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Load user from localStorage when the app initializes
    const loadUser = () => {
      const currentUser = getCurrentUser();
      setUser(currentUser);
      setLoading(false);
    };

    loadUser();
  }, []);

  // Update user data
  const updateUser = (userData) => {
    // Save to localStorage
    localStorage.setItem('user', JSON.stringify(userData));
    // Update state
    setUser(userData);
  };

  // Login function
  const login = (userData) => {
    // Save user to localStorage
    localStorage.setItem('user', JSON.stringify(userData));
    // Update state
    setUser(userData);
  };

  // Logout function
  const logout = () => {
    // Call the logout function from auth.js
    authLogoutUser();
    // Clear user state
    setUser(null);
    // Redirect to login
    navigate('/login');
  };

  // Context value
  const contextValue = {
    user,
    loading,
    login,
    logout,
    updateUser,
    isAuthenticated: !!user,
    isAdmin: user?.role === 'admin',
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use the auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === null) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;