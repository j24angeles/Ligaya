import axios from 'axios';

// Set the base URL for json-server
const API_URL = 'http://localhost:3000';  // Default json-server port

// Create axios instance with common configuration
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  },
  // Add a timeout to detect connection issues faster
  timeout: 5000
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
    if (error.code === 'ECONNREFUSED') {
      throw new Error('Cannot connect to json-server. Make sure it is running on port 3000.');
    }
    throw error.response?.data || new Error('Failed to fetch donations');
  }
};

/**
 * Get single donation by ID
 * @param {string|number} id - Donation ID
 * @returns {Promise<Object>} - Donation data
 */
export const getDonationById = async (id) => {
  if (!id) throw new Error('Donation ID is required');
  
  try {
    const response = await api.get(`/donations/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching donation with ID ${id}:`, error);
    if (error.response?.status === 404) {
      throw new Error(`Donation with ID ${id} not found`);
    }
    throw error.response?.data || new Error('Failed to fetch donation');
  }
};

/**
 * Update existing donation
 * @param {string|number} id - Donation ID
 * @param {Object} donationData - Updated donation data
 * @returns {Promise<Object>} - Updated donation data
 */
export const updateDonation = async (id, donationData) => {
  if (!id) throw new Error('Donation ID is required');
  if (!donationData || Object.keys(donationData).length === 0) {
    throw new Error('No data provided for update');
  }
  
  try {
    // First get the existing donation to preserve createdAt and other fields
    const existingDonation = await getDonationById(id);
    
    const response = await api.put(`/donations/${id}`, {
      ...existingDonation, // Preserve all existing data
      ...donationData,      // Apply updates
      updatedAt: new Date().toISOString() // Add updatedAt
    });
    
    return response.data;
  } catch (error) {
    console.error(`Error updating donation with ID ${id}:`, error);
    throw error.response?.data || new Error('Failed to update donation');
  }
};

/**
 * Delete donation
 * @param {string|number} id - Donation ID
 * @returns {Promise<boolean>} - Success indicator
 */
export const deleteDonation = async (id) => {
  if (!id) throw new Error('Donation ID is required');
  
  try {
    await api.delete(`/donations/${id}`);
    return true;
  } catch (error) {
    console.error(`Error deleting donation with ID ${id}:`, error);
    if (error.response?.status === 404) {
      throw new Error(`Donation with ID ${id} not found`);
    }
    throw error.response?.data || new Error('Failed to delete donation');
  }
};

/**
 * Create new donation
 * @param {Object} donationData - Donation data
 * @returns {Promise<Object>} - Created donation data
 */
export const createDonation = async (donationData) => {
  if (!donationData) throw new Error('Donation data is required');
  
  try {
    // Ensure numerical ID for json-server compatibility
    const donationDataToSave = {
      ...donationData,
      id: donationData.id || Date.now().toString(), // Ensure string ID for consistency
      status: donationData.status || 'Pending',
      createdAt: new Date().toISOString(),
      updatedAt: null
    };
    
    // Create new donation
    const response = await api.post('/donations', donationDataToSave);
    return response.data;
  } catch (error) {
    console.error('Donation creation error:', error);
    throw error.response?.data || error;
  }
};

/**
 * Get donations by volunteer ID
 * @param {string|number} volunteerId - Volunteer ID
 * @returns {Promise<Array>} - List of donations by the volunteer
 */
export const getDonationsByVolunteer = async (volunteerId) => {
  if (!volunteerId) throw new Error('Volunteer ID is required');
  
  try {
    // Use proper json-server query format
    const response = await api.get('/donations', {
      params: { volunteerId }
    });
    return response.data;
  } catch (error) {
    console.error(`Error fetching donations for volunteer ${volunteerId}:`, error);
    throw error.response?.data || new Error('Failed to fetch donations by volunteer');
  }
};

/**
 * Get donations by status
 * @param {string} status - Donation status (Pending/Verified)
 * @returns {Promise<Array>} - List of donations with the specified status
 */
export const getDonationsByStatus = async (status) => {
  if (!status) throw new Error('Status is required');
  
  try {
    // Use proper json-server query format
    const response = await api.get('/donations', {
      params: { status }
    });
    return response.data;
  } catch (error) {
    console.error(`Error fetching donations with status ${status}:`, error);
    throw error.response?.data || new Error('Failed to fetch donations by status');
  }
};