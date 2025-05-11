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
 * Get all donations
 * @returns {Promise<Array>} - List of donations
 */
export const getAllDonations = async () => {
  try {
    const response = await api.get('/donations');
    return response.data;
  } catch (error) {
    console.error('Error fetching donations:', error);
    throw error.response?.data?.message || error.message || 'Failed to fetch donations';
  }
};

/**
 * Get single donation by ID
 * @param {string|number} id - Donation ID
 * @returns {Promise<Object>} - Donation data
 */
export const getDonationById = async (id) => {
  try {
    const response = await api.get(`/donations/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching donation:', error);
    throw error.response?.data?.message || error.message || 'Failed to fetch donation';
  }
};

/**
 * Create new donation
 * @param {Object} donationData - Donation data
 * @returns {Promise<Object>} - Created donation data
 */
export const createDonation = async (donationData) => {
  try {
    const donationToSave = {
      ...donationData,
      id: Date.now(),
      createdAt: new Date().toISOString(),
      status: 'active',
      isValidated: false
    };
    
    // Create the donation
    const createResponse = await api.post('/donations', donationToSave);
    
    // Update the user's donations array
    await updateUserDonations(donationData.userId, createResponse.data.id, 'add');
    
    return createResponse.data;
  } catch (error) {
    console.error('Donation creation error:', error);
    throw error.response?.data?.message || error.message || 'Failed to create donation';
  }
};

/**
 * Update existing donation
 * @param {string|number} id - Donation ID
 * @param {Object} donationData - Updated donation data
 * @returns {Promise<Object>} - Updated donation data
 */
export const updateDonation = async (id, donationData) => {
  try {
    // First get the existing donation to preserve createdAt
    const existingDonation = await api.get(`/donations/${id}`);
    
    const response = await api.put(`/donations/${id}`, {
      ...existingDonation.data, // Preserve all existing data
      ...donationData,          // Apply updates
      updatedAt: new Date().toISOString() // Add updatedAt
    });
    
    return response.data;
  } catch (error) {
    console.error('Error updating donation:', error);
    throw error.response?.data?.message || error.message || 'Failed to update donation';
  }
};

/**
 * Archive donation
 * @param {string|number} id - Donation ID
 * @returns {Promise<Object>} - Updated donation data
 */
export const archiveDonation = async (id) => {
  try {
    // First get the existing donation
    const existingDonation = await api.get(`/donations/${id}`);
    
    // Update the donation status to archived
    const response = await api.put(`/donations/${id}`, {
      ...existingDonation.data,
      status: 'archived',
      updatedAt: new Date().toISOString()
    });
    
    return response.data;
  } catch (error) {
    console.error('Error archiving donation:', error);
    throw error.response?.data?.message || error.message || 'Failed to archive donation';
  }
};

/**
 * Restore donation
 * @param {string|number} id - Donation ID
 * @returns {Promise<Object>} - Updated donation data
 */
export const restoreDonation = async (id) => {
  try {
    // First get the existing donation
    const existingDonation = await api.get(`/donations/${id}`);
    
    // Update the donation status to active
    const response = await api.put(`/donations/${id}`, {
      ...existingDonation.data,
      status: 'active',
      updatedAt: new Date().toISOString()
    });
    
    return response.data;
  } catch (error) {
    console.error('Error restoring donation:', error);
    throw error.response?.data?.message || error.message || 'Failed to restore donation';
  }
};

/**
 * Validate donation
 * @param {string|number} id - Donation ID
 * @returns {Promise<Object>} - Updated donation data
 */
export const validateDonation = async (id) => {
  try {
    // First get the existing donation
    const existingDonation = await api.get(`/donations/${id}`);
    
    // Update the donation validation status
    const response = await api.put(`/donations/${id}`, {
      ...existingDonation.data,
      isValidated: true,
      validatedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });
    
    return response.data;
  } catch (error) {
    console.error('Error validating donation:', error);
    throw error.response?.data?.message || error.message || 'Failed to validate donation';
  }
};

/**
 * Delete donation
 * @param {string|number} id - Donation ID
 * @returns {Promise<boolean>} - Success indicator
 */
export const deleteDonation = async (id) => {
  try {
    // First get the existing donation to get the userId
    const existingDonation = await api.get(`/donations/${id}`);
    
    // Remove from user's donations array
    await updateUserDonations(existingDonation.data.userId, id, 'remove');
    
    // Delete the donation
    await api.delete(`/donations/${id}`);
    return true;
  } catch (error) {
    console.error('Error deleting donation:', error);
    throw error.response?.data?.message || error.message || 'Failed to delete donation';
  }
};

/**
 * Update user's donations array
 * @param {string|number} userId - User ID
 * @param {string|number} donationId - Donation ID
 * @param {string} action - 'add' or 'remove'
 * @returns {Promise<Object>} - Updated user data
 */
export const updateUserDonations = async (userId, donationId, action) => {
  try {
    // Get the user
    const userResponse = await api.get(`/users/${userId}`);
    const user = userResponse.data;
    
    // Initialize donations array if it doesn't exist
    if (!user.donations) {
      user.donations = [];
    }
    
    if (action === 'add') {
      // Add donation to user's donations array if not already there
      if (!user.donations.includes(donationId)) {
        user.donations.push(donationId);
      }
    } else if (action === 'remove') {
      // Remove donation from user's donations array
      user.donations = user.donations.filter(id => id !== donationId);
    }
    
    // Update the user
    const updateResponse = await api.put(`/users/${userId}`, {
      ...user,
      updatedAt: new Date().toISOString()
    });
    
    return updateResponse.data;
  } catch (error) {
    console.error('Error updating user donations:', error);
    throw error.response?.data?.message || error.message || 'Failed to update user donations';
  }
};