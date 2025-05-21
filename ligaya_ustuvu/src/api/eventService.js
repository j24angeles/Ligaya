import axios from 'axios';
const API_URL = 'http://localhost:3001';
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});
/**
 * Fetches all events from the server
 * @returns {Promise<Array>} Array of event objects
 */
export const getAllEvents = async () => {
  try {
    const response = await api.get('/events');
    return response.data;
  } catch (error) {
    console.error('Error fetching all events:', error);
    throw error.response?.data || new Error('Failed to fetch events');
  }
};

/**
 * Fetches all published events that are not archived
 * @returns {Promise<Array>} Array of published, non-archived event objects
 */
export const getPublishedEvents = async () => {
  try {
    const response = await api.get('/events');
    // Filter to only include published and non-archived events
    return response.data.filter(event => 
      event.isPublished === true && 
      event.status !== "archived"
    );
  } catch (error) {
    console.error('Error fetching published events:', error);
    throw error.response?.data || new Error('Failed to fetch published events');
  }
};

/**
 * Fetches a single event by ID
 * @param {string|number} id - Event ID
 * @returns {Promise<Object>} Event object
 */
export const getEventById = async (id) => {
  try {
    const response = await api.get(`/events/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching event ${id}:`, error);
    throw error.response?.data || new Error('Failed to fetch event');
  }
};

/**
 * Creates a new event
 * @param {Object} eventData - Event data to create
 * @returns {Promise<Object>} Created event object
 */
export const createEvent = async (eventData) => {
  try {
    const response = await api.post('/events', {
      ...eventData,
      id: Date.now(),
      createdAt: new Date().toISOString(),
      volunteers: [],
      isPublished: eventData.isPublished || false,
      status: eventData.status || "draft"
    });
    return response.data;
  } catch (error) {
    console.error('Error creating event:', error);
    throw error.response?.data || new Error('Failed to create event');
  }
};

/**
 * Updates an existing event
 * @param {string|number} id - Event ID
 * @param {Object} eventData - Updated event data
 * @returns {Promise<Object>} Updated event object
 */
export const updateEvent = async (id, eventData) => {
  try {
    const response = await api.put(`/events/${id}`, {
      ...eventData,
      updatedAt: new Date().toISOString()
    });
    return response.data;
  } catch (error) {
    console.error(`Error updating event ${id}:`, error);
    throw error.response?.data || new Error('Failed to update event');
  }
};

/**
 * Deletes an event
 * @param {string|number} id - Event ID
 * @returns {Promise<boolean>} True if successful
 */
export const deleteEvent = async (id) => {
  try {
    await api.delete(`/events/${id}`);
    return true;
  } catch (error) {
    console.error(`Error deleting event ${id}:`, error);
    throw error.response?.data || new Error('Failed to delete event');
  }
};

/**
 * Archives an event instead of deleting it
 * @param {string|number} id - Event ID
 * @returns {Promise<Object>} Updated event object
 */
export const archiveEvent = async (id) => {
  try {
    const event = await getEventById(id);
    const updatedEvent = await updateEvent(id, {
      ...event,
      status: "archived"
    });
    return updatedEvent;
  } catch (error) {
    console.error(`Error archiving event ${id}:`, error);
    throw error.response?.data || new Error('Failed to archive event');
  }
};

/**
 * Registers a user for an event
 * @param {string|number} eventId - Event ID
 * @param {Object} userData - User data
 * @returns {Promise<Object>} Updated event object
 */
export const registerForEvent = async (eventId, userData) => {
  try {
    const event = await getEventById(eventId);
    
    // Check if the event is archived
    if (event.status === "archived") {
      throw new Error('Cannot register for an archived event');
    }
    
    // Check if the event is published
    if (event.isPublished !== true) {
      throw new Error('Cannot register for an unpublished event');
    }
    
    // Check if already registered
    const isRegistered = event.volunteers?.some(
      v => String(v.id) === String(userData.id)
    );
    
    if (isRegistered) {
      throw new Error('User already registered for this event');
    }
    const updatedEvent = await updateEvent(eventId, {
      ...event,
      volunteers: [
        ...(event.volunteers || []),
        {
          id: userData.id,
          name: userData.name,
          email: userData.email,
          registeredAt: new Date().toISOString()
        }
      ]
    });
    await updateUserEvents(userData.id, eventId);
    return updatedEvent;
  } catch (error) {
    console.error(`Error registering for event ${eventId}:`, error);
    throw error.response?.data || error;
  }
};

/**
 * Cancels a user's event registration
 * @param {string|number} eventId - Event ID
 * @param {string|number} userId - User ID
 * @returns {Promise<Object>} Updated event object
 */
export const cancelEventRegistration = async (eventId, userId) => {
  try {
    const event = await getEventById(eventId);
    
    // Check if the event is archived
    if (event.status === "archived") {
      throw new Error('Cannot modify registration for an archived event');
    }
    
    const updatedEvent = await updateEvent(eventId, {
      ...event,
      volunteers: (event.volunteers || []).filter(
        v => String(v.id) !== String(userId)
      )
    });
    await removeUserEvent(userId, eventId);
    return updatedEvent;
  } catch (error) {
    console.error(`Error canceling registration for event ${eventId}:`, error);
    throw error.response?.data || error;
  }
};

/**
 * Gets all events a user is registered for
 * @param {string|number} userId - User ID
 * @returns {Promise<Array>} Array of event objects
 */
export const getUserEvents = async (userId) => {
  try {
    const [user, allEvents] = await Promise.all([
      api.get(`/users/${userId}`),
      getAllEvents()
    ]);
    
    // Filter out archived events from user's events
    return allEvents.filter(event => {
      // Skip archived events
      if (event.status === "archived") {
        return false;
      }
      
      const isVolunteer = event.volunteers?.some(
        v => String(v.id) === String(userId)
      );
      const isInEventsJoined = user.data.eventsJoined?.includes(event.id);
      return isVolunteer || isInEventsJoined;
    });
  } catch (error) {
    console.error(`Error fetching events for user ${userId}:`, error);
    throw error.response?.data || new Error('Failed to fetch user events');
  }
};

/**
 * Gets only upcoming events a user is registered for
 * @param {string|number} userId - User ID
 * @returns {Promise<Array>} Array of upcoming event objects, sorted by date
 */
export const getUpcomingUserEvents = async (userId) => {
  try {
    const userEvents = await getUserEvents(userId);
    const now = new Date();
    return userEvents
      .filter(event => event.date && new Date(event.date) > now)
      .sort((a, b) => new Date(a.date) - new Date(b.date));
  } catch (error) {
    console.error(`Error fetching upcoming events for user ${userId}:`, error);
    throw error.response?.data || new Error('Failed to fetch upcoming events');
  }
};

// Helper functions
const updateUserEvents = async (userId, eventId) => {
  try {
    const user = await api.get(`/users/${userId}`);
    const updated = await api.put(`/users/${userId}`, {
      ...user.data,
      eventsJoined: [...new Set([...(user.data.eventsJoined || []), eventId])],
      updatedAt: new Date().toISOString()
    });
    return updated.data;
  } catch (error) {
    console.error(`Error updating user ${userId} events:`, error);
    throw error.response?.data || error;
  }
};

const removeUserEvent = async (userId, eventId) => {
  try {
    const user = await api.get(`/users/${userId}`);
    const updated = await api.put(`/users/${userId}`, {
      ...user.data,
      eventsJoined: (user.data.eventsJoined || []).filter(id => id !== eventId),
      updatedAt: new Date().toISOString()
    });
    return updated.data;
  } catch (error) {
    console.error(`Error removing event from user ${userId}:`, error);
    throw error.response?.data || error;
  }
};

export default {
  getAllEvents,
  getPublishedEvents,
  getEventById,
  createEvent,
  updateEvent,
  deleteEvent,
  archiveEvent,
  registerForEvent,
  cancelEventRegistration,
  getUserEvents,
  getUpcomingUserEvents
};