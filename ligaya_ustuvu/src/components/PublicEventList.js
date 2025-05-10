import React, { useState, useEffect } from 'react';
import { Search, AlertCircle } from 'lucide-react';
import { getAllEvents, registerForEvent, cancelEventRegistration } from '../api/eventService';
import PublicEventCard from './PublicEventCard';
import { useToast } from '../hooks/ToastProvider';
import Toast from '../hooks/Toast';
import ConfirmationModal from './ConfirmationModal';

const PublicEventList = ({ currentUser }) => {
  const [events, setEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const { showSuccess, showError } = useToast();

  // Fetch all published events
  const fetchEvents = async () => {
    setIsLoading(true);
    try {
      const data = await getAllEvents();
      // Only show published events
      const publishedEvents = data.filter(event => event.isPublished);
      setEvents(publishedEvents);
      setError(null);
    } catch (err) {
      setError(err.message);
      showError(`Failed to load events: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  // Load events on component mount
  useEffect(() => {
    fetchEvents();
  }, []);

  // Handle registering for an event
  const handleRegister = async (eventId) => {
    setIsLoading(true);
    
    try {
      await registerForEvent(eventId, currentUser);
      await fetchEvents();
      showSuccess('Successfully registered for the event!');
    } catch (err) {
      showError(err.message || 'Failed to register for the event');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle canceling registration - with our custom confirmation handled by the card component
  const handleCancelRegistration = async (eventId) => {
    setIsLoading(true);
    try {
      await cancelEventRegistration(eventId, currentUser.id);
      await fetchEvents();
      showSuccess('Registration cancelled successfully');
    } catch (err) {
      showError(err.message || 'Failed to cancel registration');
    } finally {
      setIsLoading(false);
    }
  };

  // Check if user is registered for an event
  const isUserRegistered = (event) => {
    return event.volunteers && event.volunteers.some(volunteer => volunteer.id === currentUser.id);
  };

  // Filter events based on search term
  const filteredEvents = events.filter(event => {
    return event.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
           event.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
           event.location.toLowerCase().includes(searchTerm.toLowerCase());
  });

  return (
    <div className="p-6 max-w-7xl mx-auto transition-all duration-300">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-primary">Upcoming Events</h1>
        <p className="text-gray-600 mt-2">Browse and register for upcoming volunteer opportunities</p>
      </div>

      {/* Search */}
      <div className="mb-6">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <Search size={18} className="text-gray-400" />
          </div>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search events..."
            className="block w-full p-2 pl-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
      </div>

      {/* Loading state */}
      {isLoading && (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      )}

      {/* Error state */}
      {error && !isLoading && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
          <div className="flex">
            <AlertCircle className="h-5 w-5 text-red-500 mr-2" />
            <p className="text-red-700">Error loading events: {error}</p>
          </div>
        </div>
      )}

      {/* No events message */}
      {!isLoading && !error && filteredEvents.length === 0 && (
        <div className="bg-gray-50 rounded-lg border border-gray-200 p-8 text-center">
          <h3 className="text-lg font-medium text-gray-600 mb-2">No events found</h3>
          <p className="text-gray-500">
            {searchTerm ? "Try adjusting your search" : "There are no upcoming events at this time"}
          </p>
        </div>
      )}

      {/* Events grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredEvents.map(event => (
          <PublicEventCard 
            key={event.id}
            event={event}
            isRegistered={isUserRegistered(event)}
            onRegister={() => handleRegister(event.id)}
            onCancelRegistration={() => handleCancelRegistration(event.id)}
          />
        ))}
      </div>
    </div>
  );
};

export default PublicEventList;