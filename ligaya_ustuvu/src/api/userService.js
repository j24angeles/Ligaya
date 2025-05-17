import axios from 'axios';

const API_URL = 'http://localhost:3001';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

export const getAllUsers = async () => {
  try {
    const response = await api.get('/users');
    return response.data;
  } catch (error) {
    throw error.response?.data || new Error('Failed to fetch users');
  }
};

export const getUserById = async (id) => {
  try {
    const response = await api.get(`/users/${id}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || new Error('Failed to fetch user');
  }
};

export const updateUser = async (id, userData) => {
  try {
    const existingUser = await api.get(`/users/${id}`);
    const response = await api.put(`/users/${id}`, {
      ...existingUser.data,
      ...userData,
      updatedAt: new Date().toISOString()
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || new Error('Failed to update user');
  }
};

export const deleteUser = async (id) => {
  try {
    await api.delete(`/users/${id}`);
    return true;
  } catch (error) {
    throw error.response?.data || new Error('Failed to delete user');
  }
};

export const createUser = async (userData) => {
  try {
    const checkResponse = await api.get(`/users`, {
      params: { email: userData.email }
    });
    
    const existingUsers = checkResponse.data;
    if (existingUsers.length > 0) {
      throw new Error('User with this email already exists');
    }
    
    const fullName = `${userData.firstName} ${userData.lastName}`;
    
    const userDataToSave = {
      ...userData,
      name: fullName,
      id: Date.now(),
      createdAt: new Date().toISOString()
    };
    
    const createResponse = await api.post('/users', userDataToSave);
    return createResponse.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};