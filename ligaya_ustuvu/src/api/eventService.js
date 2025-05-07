// Service for event CRUD operations
const API_URL = 'http://localhost:3001';

// Get all events
export const getAllEvents = async () => {
  const response = await fetch(`${API_URL}/events`);
  if (!response.ok) throw new Error('Failed to fetch events');
  return await response.json();
};

// Get single event
export const getEventById = async (id) => {
  const response = await fetch(`${API_URL}/events/${id}`);
  if (!response.ok) throw new Error('Failed to fetch event');
  return await response.json();
};

// Create new event
export const createEvent = async (eventData) => {
  const response = await fetch(`${API_URL}/events`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      ...eventData,
      id: Date.now(),
      createdAt: new Date().toISOString()
    })
  });
  
  if (!response.ok) throw new Error('Failed to create event');
  return await response.json();
};

// Update existing event
export const updateEvent = async (id, eventData) => {
  const response = await fetch(`${API_URL}/events/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      ...eventData,
      updatedAt: new Date().toISOString()
    })
  });
  
  if (!response.ok) throw new Error('Failed to update event');
  return await response.json();
};

// Delete event
export const deleteEvent = async (id) => {
  const response = await fetch(`${API_URL}/events/${id}`, {
    method: 'DELETE'
  });
  
  if (!response.ok) throw new Error('Failed to delete event');
  return true;
};