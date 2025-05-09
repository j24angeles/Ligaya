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
      createdAt: new Date().toISOString(),
      volunteers: [] // Initialize empty volunteers array
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

/**
 * Register current user for an event
 * @param {string|number} eventId - Event ID
 * @param {Object} userData - User data
 * @returns {Promise<Object>} - Updated event data
 */
export const registerForEvent = async (eventId, userData) => {
  try {
    // First, get the current event data
    const event = await getEventById(eventId);
    
    // Check if user is already registered
    const isAlreadyRegistered = event.volunteers && 
      event.volunteers.some(volunteer => volunteer.id === userData.id);
    
    if (isAlreadyRegistered) {
      throw new Error('You are already registered for this event');
    }
    
    // Add user to volunteers array
    const volunteers = event.volunteers || [];
    volunteers.push({
      id: userData.id,
      name: userData.name,
      email: userData.email,
      registeredAt: new Date().toISOString()
    });
    
    // Update event with new volunteers array
    const updatedEvent = await updateEvent(eventId, {
      ...event,
      volunteers
    });
    
    // Also update user's eventsJoined array
    await updateUserEvents(userData.id, eventId);
    
    return updatedEvent;
  } catch (error) {
    console.error('Error registering for event:', error);
    throw error.response?.data || error;
  }
};

/**
 * Cancel registration for an event
 * @param {string|number} eventId - Event ID
 * @param {string|number} userId - User ID
 * @returns {Promise<Object>} - Updated event data
 */
export const cancelEventRegistration = async (eventId, userId) => {
  try {
    // First, get the current event data
    const event = await getEventById(eventId);
    
    // Remove user from volunteers array
    const volunteers = event.volunteers || [];
    const updatedVolunteers = volunteers.filter(volunteer => volunteer.id !== userId);
    
    // Update event with new volunteers array
    const updatedEvent = await updateEvent(eventId, {
      ...event,
      volunteers: updatedVolunteers
    });
    
    // Also remove from user's eventsJoined array
    await removeUserEvent(userId, eventId);
    
    return updatedEvent;
  } catch (error) {
    console.error('Error canceling event registration:', error);
    throw error.response?.data || error;
  }
};

/**
 * Update user's eventsJoined array
 * @param {string|number} userId - User ID
 * @param {string|number} eventId - Event ID
 * @returns {Promise<Object>} - Updated user data
 */
const updateUserEvents = async (userId, eventId) => {
  try {
    // Get current user data
    const response = await api.get(`/users/${userId}`);
    const userData = response.data;
    
    // Add event to eventsJoined array if not already there
    const eventsJoined = userData.eventsJoined || [];
    if (!eventsJoined.includes(eventId)) {
      eventsJoined.push(eventId);
    }
    
    // Update user with new eventsJoined array
    const updateResponse = await api.put(`/users/${userId}`, {
      ...userData,
      eventsJoined,
      updatedAt: new Date().toISOString()
    });
    
    return updateResponse.data;
  } catch (error) {
    console.error('Error updating user events:', error);
    throw error.response?.data || error;
  }
};

/**
 * Remove event from user's eventsJoined array
 * @param {string|number} userId - User ID
 * @param {string|number} eventId - Event ID
 * @returns {Promise<Object>} - Updated user data
 */
const removeUserEvent = async (userId, eventId) => {
  try {
    // Get current user data
    const response = await api.get(`/users/${userId}`);
    const userData = response.data;
    
    // Remove event from eventsJoined array
    const eventsJoined = userData.eventsJoined || [];
    const updatedEvents = eventsJoined.filter(id => id !== eventId);
    
    // Update user with new eventsJoined array
    const updateResponse = await api.put(`/users/${userId}`, {
      ...userData,
      eventsJoined: updatedEvents,
      updatedAt: new Date().toISOString()
    });
    
    return updateResponse.data;
  } catch (error) {
    console.error('Error removing user event:', error);
    throw error.response?.data || error;
  }
};