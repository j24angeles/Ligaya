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
 * Get all events
 * @returns {Promise<Array>} - List of events
 */
export const getAllEvents = async () => {
  try {
    const response = await api.get('/events');
    return response.data;
  } catch (error) {
    console.error('Error fetching events:', error);
    throw error.response?.data || new Error('Failed to fetch events');
  }
};

/**
 * Get single event by ID
 * @param {string|number} id - Event ID
 * @returns {Promise<Object>} - Event data
 */
export const getEventById = async (id) => {
  try {
    const response = await api.get(`/events/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching event:', error);
    throw error.response?.data || new Error('Failed to fetch event');
  }
};

/**
 * Create new event
 * @param {Object} eventData - Event data
 * @returns {Promise<Object>} - Created event data
 */
export const createEvent = async (eventData) => {
  try {
    const response = await api.post('/events', {
      ...eventData,
      id: Date.now(),
      createdAt: new Date().toISOString()
    });
    return response.data;
  } catch (error) {
    console.error('Error creating event:', error);
    throw error.response?.data || new Error('Failed to create event');
  }
};

/**
 * Update existing event
 * @param {string|number} id - Event ID
 * @param {Object} eventData - Updated event data
 * @returns {Promise<Object>} - Updated event data
 */
export const updateEvent = async (id, eventData) => {
  try {
    const response = await api.put(`/events/${id}`, {
      ...eventData,
      updatedAt: new Date().toISOString()
    });
    return response.data;
  } catch (error) {
    console.error('Error updating event:', error);
    throw error.response?.data || new Error('Failed to update event');
  }
};

/**
 * Delete event
 * @param {string|number} id - Event ID
 * @returns {Promise<boolean>} - Success indicator
 */
export const deleteEvent = async (id) => {
  try {
    await api.delete(`/events/${id}`);
    return true;
  } catch (error) {
    console.error('Error deleting event:', error);
    throw error.response?.data || new Error('Failed to delete event');
  }
};