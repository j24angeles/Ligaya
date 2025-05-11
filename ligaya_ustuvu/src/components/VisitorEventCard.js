import React, { useState } from 'react';
import { Calendar, MapPin, Users, X, Clock } from 'lucide-react';

const VisitorEventDetailsModal = ({ event, isOpen, onClose }) => {
  // Function to format date
  const formatDate = (dateString) => {
    if (!dateString) return 'Date TBA';
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Function to format time
  const formatTime = (timeString) => {
    if (!timeString) return 'Time TBA';
    return timeString;
  };
  
  // Check if event is in the past
  const isEventInPast = (eventDate) => {
    if (!eventDate) return false;
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Reset time to start of day for accurate date comparison
    const eventDay = new Date(eventDate);
    return eventDay < today;
  };

  const isPastEvent = isEventInPast(event.date);

  // If modal is not open, don't render anything
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-xl">
        {/* Modal Header with close button */}
        <div className="sticky top-0 bg-white p-4 border-b border-gray-200 flex justify-between items-center z-10">
          <h2 className="text-2xl font-bold text-gray-800">Event Details</h2>
          <button 
            onClick={onClose}
            className="p-1 rounded-full hover:bg-gray-100"
          >
            <X size={24} />
          </button>
        </div>
        
        {/* Event Banner Image */}
        <div className="w-full h-64 relative">
          {event.bannerImage ? (
            typeof event.bannerImage === 'string' ? (
              <img 
                src={event.bannerImage} 
                alt={event.title} 
                className="w-full h-full object-cover"
              />
            ) : (
              <img 
                src={URL.createObjectURL(event.bannerImage)} 
                alt={event.title} 
                className="w-full h-full object-cover"
              />
            )
          ) : (
            <div className="w-full h-full bg-gradient-to-r from-gray-200 to-gray-300 flex items-center justify-center">
              <p className="text-gray-500">No image available</p>
            </div>
          )}
          
          {/* Event status badge */}
          {isPastEvent && (
            <div className="absolute top-4 right-4">
              <span className="bg-gray-800 text-white text-sm font-medium px-3 py-1 rounded-full">
                Past Event
              </span>
            </div>
          )}
        </div>
        
        {/* Event Content */}
        <div className="p-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">{event.title}</h1>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="space-y-4">
              <div className="flex items-start">
                <Calendar size={20} className="text-primary mr-3 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-medium text-gray-800">Date & Time</h3>
                  <p className="text-gray-600">{formatDate(event.date)} at {formatTime(event.time)}</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <MapPin size={20} className="text-primary mr-3 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-medium text-gray-800">Location</h3>
                  <p className="text-gray-600">{event.location || 'Location TBA'}</p>
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              {event.attendees && (
                <div className="flex items-start">
                  <Users size={20} className="text-primary mr-3 mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="font-medium text-gray-800">Attendees</h3>
                    <p className="text-gray-600">
                      {event.attendees.length} {event.attendees.length === 1 ? 'person' : 'people'} attending
                    </p>
                  </div>
                </div>
              )}
              
              {event.organizer && (
                <div className="flex items-start">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary mr-3 mt-1 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                  </svg>
                  <div>
                    <h3 className="font-medium text-gray-800">Organizer</h3>
                    <p className="text-gray-600">{event.organizer}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
          
          <div className="mb-6">
            <h3 className="font-medium text-gray-800 mb-2">Description</h3>
            <div className="text-gray-600 whitespace-pre-line">
              {event.description || 'No description available.'}
            </div>
          </div>
          
          {/* Status indicator for past events */}
          {isPastEvent && (
            <div className="mt-4 mb-6 p-3 bg-gray-100 rounded-lg text-gray-700 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              This event has already taken place
            </div>
          )}
          
          {/* Modal action button */}
          <div className="mt-8 flex justify-end">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors font-medium"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Updated VisitorEventCard component with modal functionality
const VisitorEventCard = ({ event }) => {
  const [showModal, setShowModal] = useState(false);
  
  const formatDate = (dateString) => {
    if (!dateString) return 'Date TBA';
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };
  
  // Check if event is in the past
  const isEventInPast = (eventDate) => {
    if (!eventDate) return false;
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Reset time to start of day for accurate date comparison
    const eventDay = new Date(eventDate);
    return eventDay < today;
  };

  const isPastEvent = isEventInPast(event.date);

  return (
    <>
      <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
        {/* Event Image */}
        <div className="h-48 bg-gray-100 relative">
          {event.bannerImage ? (
            typeof event.bannerImage === 'string' ? (
              <img 
                src={event.bannerImage} 
                alt={event.title} 
                className="w-full h-full object-cover"
              />
            ) : (
              <img 
                src={URL.createObjectURL(event.bannerImage)} 
                alt={event.title} 
                className="w-full h-full object-cover"
              />
            )
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-primary/10">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-primary/50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
          )}
          
          {/* Past event badge */}
          {isPastEvent && (
            <div className="absolute top-2 right-2">
              <span className="bg-gray-800 text-white text-xs font-medium px-2 py-1 rounded-full">
                Past Event
              </span>
            </div>
          )}
          
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
            <h3 className="text-xl font-bold text-white">{event.title}</h3>
          </div>
        </div>
        
        {/* Event Content */}
        <div className="p-6">
          <div className="flex items-center text-gray-600 mb-3">
            <Calendar size={16} className="mr-2" />
            <span>{formatDate(event.date)}</span>
          </div>
          
          <div className="flex items-center text-gray-600 mb-4">
            <MapPin size={16} className="mr-2" />
            <span>{event.location || 'Location TBA'}</span>
          </div>
          
          <p className="text-gray-700 mb-6 line-clamp-3">
            {event.description || 'Join us for this exciting event!'}
          </p>
          
          <button
            onClick={() => setShowModal(true)}
            className={`w-full py-2 ${
              isPastEvent ? 'bg-gray-500' : 'bg-primary'
            } text-white rounded-lg hover:bg-opacity-90 transition-colors inline-block text-center`}
          >
            View Details
          </button>
        </div>
      </div>
      
      {/* Event Details Modal */}
      <VisitorEventDetailsModal 
        event={event} 
        isOpen={showModal} 
        onClose={() => setShowModal(false)}
      />
    </>
  );
};

// Export both components - you can decide which to use based on your needs
export { VisitorEventCard, VisitorEventDetailsModal };

// Default export for backward compatibility
export default VisitorEventCard;