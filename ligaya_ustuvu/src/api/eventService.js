import axios from 'axios';
const API_URL = 'http://localhost:3001';
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

export const getAllEvents = async () => {
  try {
    const response = await api.get('/events');
    return response.data;
  } catch (error) {
    console.error('Error fetching all events:', error);
    throw error.response?.data || new Error('Failed to fetch events');
  }
};

export const getPublishedEvents = async () => {
  try {
    const response = await api.get('/events');
    return response.data.filter(event => 
      event.isPublished === true && 
      event.status !== "archived"
    );
  } catch (error) {
    console.error('Error fetching published events:', error);
    throw error.response?.data || new Error('Failed to fetch published events');
  }
};

export const getEventById = async (id) => {
  try {
    const response = await api.get(`/events/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching event ${id}:`, error);
    throw error.response?.data || new Error('Failed to fetch event');
  }
};

export const createEvent = async (eventData) => {
  try {
    let status = eventData.status;
    
    if (eventData.isPublished === true) {
      if (!status || status === 'draft') {
        status = undefined;
      }
    } else {
      status = status || 'draft';
    }
    
    const response = await api.post('/events', {
      ...eventData,
      id: Date.now(),
      createdAt: new Date().toISOString(),
      volunteers: [],
      isPublished: eventData.isPublished || false,
      status: status
    });
    return response.data;
  } catch (error) {
    console.error('Error creating event:', error);
    throw error.response?.data || new Error('Failed to create event');
  }
};

export const updateEvent = async (id, eventData) => {
  try {
    let updatedData = { ...eventData };
    
    if (updatedData.isPublished === true) {
      if (updatedData.status === 'draft') {
        delete updatedData.status;
      }
    }
    
    const response = await api.put(`/events/${id}`, {
      ...updatedData,
      updatedAt: new Date().toISOString()
    });
    return response.data;
  } catch (error) {
    console.error(`Error updating event ${id}:`, error);
    throw error.response?.data || new Error('Failed to update event');
  }
};

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

export const registerForEvent = async (eventId, userData) => {
  try {
    const event = await getEventById(eventId);
    
    if (event.status === "archived") {
      throw new Error('Cannot register for an archived event');
    }
    
    if (event.isPublished !== true) {
      throw new Error('Cannot register for an unpublished event');
    }
    
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

export const cancelEventRegistration = async (eventId, userId) => {
  try {
    const event = await getEventById(eventId);
    
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

export const getUserEvents = async (userId) => {
  try {
    const [user, allEvents] = await Promise.all([
      api.get(`/users/${userId}`),
      getAllEvents()
    ]);
    
    return allEvents.filter(event => {
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
  archiveEvent,
  registerForEvent,
  cancelEventRegistration,
  getUserEvents,
  getUpcomingUserEvents
};