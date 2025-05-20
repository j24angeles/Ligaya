import React from 'react';
import { MdCalendarToday, MdClose } from 'react-icons/md';

const EventModal = ({ event, onClose }) => {
  if (!event) return null;

  const formatEventDate = (date, time) => {
    if (!date) return 'Date TBD';
    try {
      const options = { month: 'short', day: 'numeric', year: 'numeric' };
      const formatted = new Date(date).toLocaleDateString('en-US', options);
      return time ? `${formatted} • ${time}` : formatted;
    } catch {
      return 'Date TBD';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto relative">
        <button 
          onClick={onClose} 
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
        >
          <MdClose size={24} />
        </button>
        
        <div className="h-48 bg-gray-100 overflow-hidden">
          {event.bannerImage || event.image ? (
            <img
              src={event.bannerImage || event.image}
              alt={event.title || 'Event'}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400">
              Event Image
            </div>
          )}
        </div>
        
        <div className="p-6">
          <div className="mb-4">
            <span className="inline-flex items-center bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded-full">
              <MdCalendarToday className="mr-1" size={12} />
              {formatEventDate(event.date, event.time)}
            </span>
          </div>
          
          <h2 className="text-xl font-bold text-gray-900 mb-2">
            {event.title || 'Untitled Event'}
          </h2>
          
          <div className="mb-4">
            <h3 className="text-sm font-semibold text-gray-700 mb-1">Description</h3>
            <p className="text-gray-600 text-sm">
              {event.description || 'No description available'}
            </p>
          </div>
          
          {event.location && (
            <div className="mb-4">
              <h3 className="text-sm font-semibold text-gray-700 mb-1">Location</h3>
              <p className="text-gray-600 text-sm">{event.location}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EventModal;