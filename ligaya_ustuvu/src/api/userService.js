import axios from 'axios';

const API_URL = 'http://localhost:3001';

// Create axios instance with common configuration
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

/**
 * Get all users
 * @returns {Promise<Array>} - List of users
 */
export const getAllUsers = async () => {
  try {
    const response = await api.get('/users');
    return response.data;
  } catch (error) {
    console.error('Error fetching users:', error);
    throw error.response?.data || new Error('Failed to fetch users');
  }
};

/**
 * Get single user by ID
 * @param {string|number} id - User ID
 * @returns {Promise<Object>} - User data
 */
export const getUserById = async (id) => {
  try {
    const response = await api.get(`/users/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching user:', error);
    throw error.response?.data || new Error('Failed to fetch user');
  }
};

/**
 * Update existing user
 * @param {string|number} id - User ID
 * @param {Object} userData - Updated user data
 * @returns {Promise<Object>} - Updated user data
 */
export const updateUser = async (id, userData) => {
  try {
    // First get the existing user to preserve createdAt
    const existingUser = await api.get(`/users/${id}`);
    
    const response = await api.put(`/users/${id}`, {
      ...existingUser.data, // Preserve all existing data
      ...userData,          // Apply updates
      updatedAt: new Date().toISOString() // Add updatedAt
    });
    
    return response.data;
  } catch (error) {
    console.error('Error updating user:', error);
    throw error.response?.data || new Error('Failed to update user');
  }
};

/**
 * Delete user
 * @param {string|number} id - User ID
 * @returns {Promise<boolean>} - Success indicator
 */
export const deleteUser = async (id) => {
  try {
    await api.delete(`/users/${id}`);
    return true;
  } catch (error) {
    console.error('Error deleting user:', error);
    throw error.response?.data || new Error('Failed to delete user');
  }
};

/**
 * Create new user (for admin purposes)
 * @param {Object} userData - User data
 * @returns {Promise<Object>} - Created user data
 */
export const createUser = async (userData) => {
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
      ...userData,
      name: fullName,
      id: Date.now(),
      createdAt: new Date().toISOString()
    };
    
    // Create new user
    const createResponse = await api.post('/users', userDataToSave);
    
    return createResponse.data;
  } catch (error) {
    console.error('User creation error:', error);
    throw error.response?.data || error;
  }
};