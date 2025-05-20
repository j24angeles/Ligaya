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
    if (userData.currentPassword && userData.newPassword) {
      const user = await getUserById(id);
      try {
        // Create a dedicated password verification request
        const verifyResponse = await api.post(`/users/${id}/verify-password`, {
          password: userData.currentPassword
        });
        
        if (!verifyResponse.data.success) {
          throw new Error('Current password is incorrect');
        }
      } catch (error) {
        if (user.password !== userData.currentPassword) {
          throw new Error('Current password is incorrect');
        }
      }
      
      // Update with new password and record the time of change
      const response = await api.put(`/users/${id}`, {
        ...user,
        password: userData.newPassword,
        lastPasswordChange: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });
      
      return response.data;
    } 
    
    // For other updates that don't involve password changes
    const existingUser = await getUserById(id);
    const response = await api.put(`/users/${id}`, {
      ...existingUser,
      ...userData,
      updatedAt: new Date().toISOString()
    });
    
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
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

export const loginUser = async (email, password) => {
  try {
    const response = await api.get(`/users`, {
      params: { email }
    });
    
    const user = response.data.find(u => u.email === email && u.password === password);
    
    if (!user) {
      throw new Error('Invalid email or password');
    }
    
    storeUserSession(user);
    
    return user;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const registerUser = async (userData) => {
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
    
    const createResponse = await api.post('/users', userDataToSave);
    
    return createResponse.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const storeUserSession = (user) => {
  const { password, ...userWithoutPassword } = user;
  localStorage.setItem('currentUser', JSON.stringify(userWithoutPassword));
};

export const getCurrentUser = () => {
  const userJson = localStorage.getItem('currentUser');
  return userJson ? JSON.parse(userJson) : null;
};

export const isLoggedIn = () => {
  return localStorage.getItem('currentUser') !== null;
};

export const logoutUser = () => {
  localStorage.removeItem('currentUser');
  window.location.href = '/login';
};