const API_URL = 'http://localhost:3001';

export const loginUser = async (email, password) => {
  const response = await fetch(`${API_URL}/users?email=${email}&password=${password}`);
  const data = await response.json();
  if (data.length === 0) throw new Error('Invalid credentials');
  return data[0];
};

export const registerUser = async (userData) => {
  // Check if user exists
  const checkResponse = await fetch(`${API_URL}/users?email=${userData.email}`);
  const existingUsers = await checkResponse.json();
  
  if (existingUsers.length > 0) throw new Error('User already exists');

  // Create full name from first and last name
  const fullName = `${userData.firstName} ${userData.lastName}`;
  
  // Remove confirmPassword if it exists in userData
  const { confirmPassword, ...userDataToSave } = userData;
  
  const response = await fetch(`${API_URL}/users`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      ...userDataToSave,
      name: fullName, // Add full name field
      id: Date.now(),
      role: 'volunteer',
      createdAt: new Date().toISOString()
    })
  });
  
  return await response.json();
};