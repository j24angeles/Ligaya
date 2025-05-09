import React, { useState, useEffect } from 'react';
import { Plus, Search, AlertCircle } from 'lucide-react';
import EventFormModal from './EventFormModal';
import EventCard from './EventCard';
import ConfirmationModal from './ConfirmationModal';
import { getAllEvents, createEvent, updateEvent, deleteEvent } from '../api/eventService';
import { useToast } from '../hooks/ToastProvider';

const EventManagement = () => {
  const [events, setEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [currentEvent, setCurrentEvent] = useState(null);
  const [statusFilter, setStatusFilter] = useState('all');
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [confirmationData, setConfirmationData] = useState({
    title: '',
    message: '',
    onConfirm: () => {},
    type: 'info',
    confirmText: 'Confirm'
  });

  // Use toast context
  const { showSuccess, showError} = useToast();

  // Fetch all events
  const fetchEvents = async () => {
    setIsLoading(true);
    try {
      const data = await getAllEvents();
      setEvents(data);
      setError(null);
    } catch (err) {
      setError(err.message);
      showError(`Failed to fetch events: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  // Load events on component mount
  useEffect(() => {
    fetchEvents();
  }, []);

  // Show confirmation modal
  const confirmAction = (title, message, onConfirm, type = 'info', confirmText = 'Confirm') => {
    setConfirmationData({ title, message, onConfirm, type, confirmText });
    setShowConfirmation(true);
  };

  // Handle creating and updating events with confirmation
  const handleSubmitEvent = async (eventData) => {
    const isUpdate = !!currentEvent;
    
    confirmAction(
      isUpdate ? 'Update Event' : 'Create Event',
      isUpdate ? 'Are you sure you want to update this event?' : 'Are you sure you want to create this event?',
      async () => {
        setIsLoading(true);
        
        try {
          if (isUpdate) {
            // Update existing event
            await updateEvent(currentEvent.id, eventData);
            showSuccess('Event updated successfully!');
          } else {
            // Create new event
            await createEvent(eventData);
            showSuccess('Event created successfully!');
          }
          
          await fetchEvents();
          setShowModal(false);
          setCurrentEvent(null);
        } catch (err) {
          setError(err.message);
          showError(`Failed to ${isUpdate ? 'update' : 'create'} event: ${err.message}`);
        } finally {
          setIsLoading(false);
        }
      },
      'info'
    );
  };

  // Handle editing event
  const handleEdit = (event) => {
    setCurrentEvent(event);
    setShowModal(true);
  };

  // Handle deleting event with confirmation
  const handleDelete = (id) => {
    confirmAction(
      'Delete Event',
      'Are you sure you want to delete this event? This action cannot be undone.',
      async () => {
        setIsLoading(true);
        try {
          await deleteEvent(id);
          showSuccess('Event deleted successfully!');
          await fetchEvents();
        } catch (err) {
          setError(err.message);
          showError(`Failed to delete event: ${err.message}`);
        } finally {
          setIsLoading(false);
        }
      },
      'delete'
    );
  };

  // Filter events based on search term and status
  const filteredEvents = events.filter(event => {
    const matchesSearch = event.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         event.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         event.location.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (statusFilter === 'all') return matchesSearch;
    if (statusFilter === 'published') return matchesSearch && event.isPublished;
    if (statusFilter === 'draft') return matchesSearch && !event.isPublished;
    
    return matchesSearch;
  });

  return (
    <div className="p-6 max-w-7xl mx-auto transition-all duration-300">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-primary">Manage Events</h1>
        <button
          onClick={() => {
            setCurrentEvent(null);
            setShowModal(true);
          }}
          className="flex items-center gap-2 bg-primary text-white p-2 sm:px-4 sm:py-2 rounded-lg hover:bg-primary/90 transition-colors"
        >
          <Plus size={18} />
          <span className="hidden sm:inline">Add New Event</span>
        </button>
      </div>

      {/* Error alert */}
      {error && (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6 flex items-start" role="alert">
          <AlertCircle size={20} className="mr-2 mt-0.5" />
          <p>{error}</p>
        </div>
      )}

      {/* Search and filter */}
      <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="relative flex-1">
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
        
        <div className="flex items-center">
          <span className="mr-2 text-sm text-gray-600">Status:</span>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="border border-gray-300 rounded-md p-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="all">All</option>
            <option value="published">Published</option>
            <option value="draft">Draft</option>
          </select>
        </div>
      </div>

      {/* Loading state */}
      {isLoading && (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      )}

      {/* No events message */}
      {!isLoading && filteredEvents.length === 0 && (
        <div className="bg-gray-50 rounded-lg border border-gray-200 p-8 text-center">
          <h3 className="text-lg font-medium text-gray-600 mb-2">No events found</h3>
          <p className="text-gray-500">
            {searchTerm || statusFilter !== 'all' 
              ? "Try adjusting your search or filter" 
              : "Click the 'Add New Event' button to create your first event"}
          </p>
        </div>
      )}

      {/* Events grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredEvents.map(event => (
          <EventCard 
            key={event.id}
            event={event}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        ))}
      </div>

      {/* Event form modal */}
      <EventFormModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onSubmit={handleSubmitEvent}
        currentEvent={currentEvent}
      />

      {/* Confirmation modal */}
      <ConfirmationModal
        show={showConfirmation}
        onClose={() => setShowConfirmation(false)}
        title={confirmationData.title}
        message={confirmationData.message}
        onConfirm={confirmationData.onConfirm}
        type={confirmationData.type}
        confirmText={confirmationData.type === 'delete' ? 'Delete' : 'Confirm'}
      />
    </div>
  );
};

export default EventManagement;