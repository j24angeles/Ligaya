import axios from 'axios';

const API_URL = 'http://localhost:3001';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

export const loginUser = async (email, password) => {
  try {
    const response = await api.get(`/users`, {
      params: { email }
    });
    
    const user = response.data.find(u => u.email === email && u.password === password);
    
    if (!user) {
      throw new Error('Invalid email or password');
    }
    
    // Check if account is archived/suspended
    if (user.status === 'archived' || user.archived === true) {
      throw new Error('This account has been suspended. Please wait for further instructions or contact support.');
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
      createdAt: new Date().toISOString(),
      status: 'active', // Adding explicit active status
      archived: false // Ensuring archived flag is explicitly set to false
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

export const isAccountSuspended = (user) => {
  return user.status === 'archived' || user.archived === true;
};