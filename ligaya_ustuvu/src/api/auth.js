import axios from 'axios';

const API_URL = 'http://localhost:3001';

// Create an axios instance with common configuration
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

/**
 * Login a user with email and password
 * @param {string} email - User email
 * @param {string} password - User password
 * @returns {Promise<Object>} - User data
 */
export const loginUser = async (email, password) => {
  try {
    // Get users with matching email
    const response = await api.get(`/users`, {
      params: { email }
    });
    
    // Find user with matching email and password
    const user = response.data.find(u => u.email === email && u.password === password);
    
    if (!user) {
      throw new Error('Invalid email or password');
    }
    
    // Store user data in localStorage for session persistence
    storeUserSession(user);
    
    return user;
  } catch (error) {
    console.error('Login error:', error);
    throw error.response?.data || error;
  }
};

/**
 * Register a new user
 * @param {Object} userData - User data including firstName, lastName, email, password, birthdate
 * @returns {Promise<Object>} - Created user data
 */
export const registerUser = async (userData) => {
  try {
    // Check if user already exists
    const checkResponse = await api.get(`/users`, {
      params: { email: userData.email }
    });
    
    const existingUsers = checkResponse.data;
    if (existingUsers.length > 0) {
      throw new Error('User with this email already exists');
    }

    // Create full name from first and last name
    const fullName = `${userData.firstName} ${userData.lastName}`;
    
    // Prepare user data for saving
    const userDataToSave = {
      firstName: userData.firstName,
      lastName: userData.lastName,
      email: userData.email,
      password: userData.password,
      birthdate: userData.birthdate,
      name: fullName,
      id: Date.now(),
      role: 'volunteer',
      createdAt: new Date().toISOString()
    };
    
    // Create new user
    const createResponse = await api.post('/users', userDataToSave);
    
    return createResponse.data;
  } catch (error) {
    console.error('Registration error:', error);
    throw error.response?.data || error;
  }
};

/**
 * Store user session data in localStorage
 * @param {Object} user - User data to store
 */
export const storeUserSession = (user) => {
  // Remove sensitive information before storing
  const { password, ...userWithoutPassword } = user;
  localStorage.setItem('currentUser', JSON.stringify(userWithoutPassword));
};

/**
 * Get the current logged-in user from localStorage
 * @returns {Object|null} - User data or null if not logged in
 */
export const getCurrentUser = () => {
  const userJson = localStorage.getItem('currentUser');
  return userJson ? JSON.parse(userJson) : null;
};

/**
 * Check if a user is currently logged in
 * @returns {boolean} - True if a user is logged in
 */
export const isLoggedIn = () => {
  return localStorage.getItem('currentUser') !== null;
};

/**
 * Log out the current user
 */
export const logoutUser = () => {
  localStorage.removeItem('currentUser');
  // You might want to redirect to the login page here or handle it in the component
};