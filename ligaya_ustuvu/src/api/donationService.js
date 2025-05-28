import axios from 'axios';

const API_URL = 'http://localhost:3001';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

export const getAllDonations = async () => {
  try {
    const response = await api.get('/donations');
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || error.message || 'Failed to fetch donations';
  }
};

export const getDonationById = async (id) => {
  try {
    const response = await api.get(`/donations/${id}`);
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || error.message || 'Failed to fetch donation';
  }
};

export const getDonationsByUserId = async (userId) => {
  try {
    const response = await api.get('/donations', {
      params: {
        userId: userId.toString(),
        _sort: 'date',
        _order: 'desc'
      }
    });
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || error.message || 'Failed to fetch user donations';
  }
};

export const createDonation = async (donationData) => {
  try {
    const donationToSave = {
      ...donationData,
      id: Date.now(),
      createdAt: donationData.createdAt || new Date().toISOString(),
      status: 'active',
      validationStatus: donationData.validationStatus || 'pending',
      isValidated: donationData.validationStatus === 'validated',
      rejectionReason: donationData.rejectionReason || null,
      validatedAt: donationData.validationStatus === 'validated' ? new Date().toISOString() : null,
      rejectedAt: donationData.validationStatus === 'rejected' ? new Date().toISOString() : null,
      updatedAt: new Date().toISOString(),
      // Include proof of receipt if provided
      proofOfReceipt: donationData.proofOfReceipt || ''
    };
    
    const createResponse = await api.post('/donations', donationToSave);
    await updateUserDonations(donationData.userId, createResponse.data.id, 'add');
    return createResponse.data;
  } catch (error) {
    throw error.response?.data?.message || error.message || 'Failed to create donation';
  }
};

export const updateDonation = async (id, donationData) => {
  try {
    const existingDonation = await api.get(`/donations/${id}`);
    const response = await api.put(`/donations/${id}`, {
      ...existingDonation.data,
      ...donationData,
      updatedAt: new Date().toISOString()
    });
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || error.message || 'Failed to update donation';
  }
};

export const archiveDonation = async (id) => {
  try {
    const existingDonation = await api.get(`/donations/${id}`);
    const response = await api.put(`/donations/${id}`, {
      ...existingDonation.data,
      status: 'archived',
      updatedAt: new Date().toISOString()
    });
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || error.message || 'Failed to archive donation';
  }
};

export const restoreDonation = async (id) => {
  try {
    const existingDonation = await api.get(`/donations/${id}`);
    const response = await api.put(`/donations/${id}`, {
      ...existingDonation.data,
      status: 'active',
      updatedAt: new Date().toISOString()
    });
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || error.message || 'Failed to restore donation';
  }
};

export const validateDonation = async (id) => {
  try {
    const existingDonation = await api.get(`/donations/${id}`);
    const response = await api.put(`/donations/${id}`, {
      ...existingDonation.data,
      validationStatus: 'validated',
      isValidated: true,
      validatedAt: new Date().toISOString(),
      rejectionReason: null,
      rejectedAt: null,
      updatedAt: new Date().toISOString()
    });
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || error.message || 'Failed to validate donation';
  }
};

export const rejectDonation = async (id, reason = '') => {
  try {
    const existingDonation = await api.get(`/donations/${id}`);
    const response = await api.put(`/donations/${id}`, {
      ...existingDonation.data,
      validationStatus: 'rejected',
      isValidated: false,
      rejectionReason: reason,
      rejectedAt: new Date().toISOString(),
      validatedAt: null,
      updatedAt: new Date().toISOString()
    });
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || error.message || 'Failed to reject donation';
  }
};

export const deleteDonation = async (id) => {
  try {
    const existingDonation = await api.get(`/donations/${id}`);
    await updateUserDonations(existingDonation.data.userId, id, 'remove');
    await api.delete(`/donations/${id}`);
    return true;
  } catch (error) {
    throw error.response?.data?.message || error.message || 'Failed to delete donation';
  }
};

export const updateUserDonations = async (userId, donationId, action) => {
  try {
    const userResponse = await api.get(`/users/${userId}`);
    const user = userResponse.data;
    
    if (!user.donations) {
      user.donations = [];
    }
    
    if (action === 'add') {
      if (!user.donations.includes(donationId)) {
        user.donations.push(donationId);
      }
    } else if (action === 'remove') {
      user.donations = user.donations.filter(id => id !== donationId);
    }
    
    const updateResponse = await api.put(`/users/${userId}`, {
      ...user,
      updatedAt: new Date().toISOString()
    });
    
    return updateResponse.data;
  } catch (error) {
    throw error.response?.data?.message || error.message || 'Failed to update user donations';
  }
};