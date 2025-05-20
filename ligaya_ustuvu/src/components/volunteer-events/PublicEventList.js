import React, { useState, useEffect } from 'react';
import { Search, AlertCircle } from 'lucide-react';
import { getAllEvents, registerForEvent, cancelEventRegistration } from '../../api/eventService';
import PublicEventCard from './PublicEventCard';
import { useToast } from '../../hooks/ToastProvider';

const PublicEventList = ({ currentUser }) => {
  const [events, setEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('upcoming'); // Changed default to 'upcoming' instead of 'all'
  const { showSuccess, showError } = useToast();

  // Fetch all published events
  const fetchEvents = async () => {
    setIsLoading(true);
    try {
      const data = await getAllEvents();
      // Only show published events
      const publishedEvents = data.filter(event => event.isPublished);
      
      // Sort events by date (nearest date first)
      const sortedEvents = [...publishedEvents].sort((a, b) => {
        const dateA = new Date(a.date);
        const dateB = new Date(b.date);
        return dateA - dateB;
      });
      
      setEvents(sortedEvents);
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

  // Check if event is in the past
  const isEventInPast = (eventDate) => {
    if (!eventDate) return false;
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Reset time to start of day for accurate date comparison
    const eventDay = new Date(eventDate);
    return eventDay < today;
  };

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

  // Handle canceling registration
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

  // Filter events based on search term and filter type
  const filteredEvents = events.filter(event => {
    // First apply search filter
    const matchesSearch = event.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         event.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         event.location.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Apply registration filter
    if (filter === 'registered') {
      return matchesSearch && isUserRegistered(event);
    }
    // Then apply time filter
    else if (filter === 'upcoming') {
      return matchesSearch && !isEventInPast(event.date);
    } else if (filter === 'past') {
      return matchesSearch && isEventInPast(event.date);
    }
    
    // All events
    return matchesSearch;
  }).sort((a, b) => {
    const dateA = new Date(a.date);
    const dateB = new Date(b.date);
    
    // For upcoming events tab, sort by nearest date first
    if (filter === 'upcoming') {
      return dateA - dateB;
    }
    // For past events tab, sort by most recent past date first
    else if (filter === 'past') {
      return dateB - dateA;
    }
    // For registered events, sort by nearest date first, with upcoming events before past events
    else if (filter === 'registered') {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      // If one is past and one is upcoming, upcoming comes first
      const aIsPast = dateA < today;
      const bIsPast = dateB < today;
      
      if (aIsPast && !bIsPast) return 1;
      if (!aIsPast && bIsPast) return -1;
      
      // If both are upcoming, nearest first
      if (!aIsPast && !bIsPast) return dateA - dateB;
      
      // If both are past, most recent first
      return dateB - dateA;
    }
    // For all events, sort by nearest date first, with upcoming events before past events
    else {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      // If one is past and one is upcoming, upcoming comes first
      const aIsPast = dateA < today;
      const bIsPast = dateB < today;
      
      if (aIsPast && !bIsPast) return 1;
      if (!aIsPast && bIsPast) return -1;
      
      // If both are upcoming, nearest first
      if (!aIsPast && !bIsPast) return dateA - dateB;
      
      // If both are past, most recent first
      return dateB - dateA;
    }
  });

  return (
    <div className="p-6 max-w-7xl mx-auto transition-all duration-300">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-primary">Volunteer Events</h1>
        <p className="text-gray-600 mt-2">Browse and register for volunteer opportunities</p>
      </div>

      {/* Search and Filter */}
      <div className="mb-6 flex flex-col md:flex-row gap-4">
        {/* Search */}
        <div className="flex-grow">
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
        
        {/* Filter Tabs - Added Registered tab */}
        <div className="inline-flex rounded-md shadow-sm overflow-x-auto" role="group">
          <button
            type="button"
            onClick={() => setFilter('upcoming')}
            className={`px-4 py-2 text-sm font-medium border rounded-l-lg ${
              filter === 'upcoming'
                ? 'bg-primary text-white border-primary'
                : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
            }`}
          >
            Upcoming
          </button>
          <button
            type="button"
            onClick={() => setFilter('registered')}
            className={`px-4 py-2 text-sm font-medium border-t border-b border-r ${
              filter === 'registered'
                ? 'bg-primary text-white border-primary'
                : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
            }`}
          >
            My Registrations
          </button>
          <button
            type="button"
            onClick={() => setFilter('all')}
            className={`px-4 py-2 text-sm font-medium border-t border-b border-r ${
              filter === 'all'
                ? 'bg-primary text-white border-primary'
                : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
            }`}
          >
            All Events
          </button>
          <button
            type="button"
            onClick={() => setFilter('past')}
            className={`px-4 py-2 text-sm font-medium border-t border-b border-r rounded-r-lg ${
              filter === 'past'
                ? 'bg-primary text-white border-primary'
                : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
            }`}
          >
            Past Events
          </button>
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
            {searchTerm 
              ? "Try adjusting your search" 
              : filter === 'upcoming' 
                ? "There are no upcoming events at this time" 
                : filter === 'past' 
                  ? "There are no past events to display" 
                  : filter === 'registered'
                    ? "You haven't registered for any events yet"
                    : "There are no events to display"}
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
            isPastEvent={isEventInPast(event.date)}
            onRegister={() => handleRegister(event.id)}
            onCancelRegistration={() => handleCancelRegistration(event.id)}
          />
        ))}
      </div>
    </div>
  );
};

export default PublicEventList;