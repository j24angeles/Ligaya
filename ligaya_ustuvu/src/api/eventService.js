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
    throw error.response?.data || new Error('Failed to fetch events');
  }
};

export const getEventById = async (id) => {
  try {
    const response = await api.get(`/events/${id}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || new Error('Failed to fetch event');
  }
};

export const createEvent = async (eventData) => {
  try {
    const response = await api.post('/events', {
      ...eventData,
      id: Date.now(),
      createdAt: new Date().toISOString(),
      volunteers: []
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || new Error('Failed to create event');
  }
};

export const updateEvent = async (id, eventData) => {
  try {
    const response = await api.put(`/events/${id}`, {
      ...eventData,
      updatedAt: new Date().toISOString()
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || new Error('Failed to update event');
  }
};

export const deleteEvent = async (id) => {
  try {
    await api.delete(`/events/${id}`);
    return true;
  } catch (error) {
    throw error.response?.data || new Error('Failed to delete event');
  }
};

export const registerForEvent = async (eventId, userData) => {
  try {
    const event = await getEventById(eventId);
    
    const isAlreadyRegistered = event.volunteers && 
      event.volunteers.some(volunteer => volunteer.id === userData.id);
    
    if (isAlreadyRegistered) {
      throw new Error('You are already registered for this event');
    }
    
    const volunteers = event.volunteers || [];
    volunteers.push({
      id: userData.id,
      name: userData.name,
      email: userData.email,
      registeredAt: new Date().toISOString()
    });
    
    const updatedEvent = await updateEvent(eventId, {
      ...event,
      volunteers
    });
    
    await updateUserEvents(userData.id, eventId);
    
    return updatedEvent;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const cancelEventRegistration = async (eventId, userId) => {
  try {
    const event = await getEventById(eventId);
    
    const volunteers = event.volunteers || [];
    const updatedVolunteers = volunteers.filter(volunteer => volunteer.id !== userId);
    
    const updatedEvent = await updateEvent(eventId, {
      ...event,
      volunteers: updatedVolunteers
    });
    
    await removeUserEvent(userId, eventId);
    
    return updatedEvent;
  } catch (error) {
    throw error.response?.data || error;
  }
};

const updateUserEvents = async (userId, eventId) => {
  try {
    const response = await api.get(`/users/${userId}`);
    const userData = response.data;
    
    const eventsJoined = userData.eventsJoined || [];
    if (!eventsJoined.includes(eventId)) {
      eventsJoined.push(eventId);
    }
    
    const updateResponse = await api.put(`/users/${userId}`, {
      ...userData,
      eventsJoined,
      updatedAt: new Date().toISOString()
    });
    
    return updateResponse.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

const removeUserEvent = async (userId, eventId) => {
  try {
    const response = await api.get(`/users/${userId}`);
    const userData = response.data;
    
    const eventsJoined = userData.eventsJoined || [];
    const updatedEvents = eventsJoined.filter(id => id !== eventId);
    
    const updateResponse = await api.put(`/users/${userId}`, {
      ...userData,
      eventsJoined: updatedEvents,
      updatedAt: new Date().toISOString()
    });
    
    return updateResponse.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};