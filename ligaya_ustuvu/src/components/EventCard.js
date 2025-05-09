import React, { useState } from 'react';
import { Calendar, Clock, MapPin, Users, Edit, Trash2 } from 'lucide-react';
import VolunteersModal from './VolunteersModal';

const EventCard = ({ event, onEdit, onDelete }) => {
  const [showVolunteers, setShowVolunteers] = useState(false);

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Format time for display
  const formatTime = (timeString) => {
    if (!timeString) return '';
    return timeString;
  };

  // Truncate description for preview
  const truncateDescription = (text, maxLength = 150) => {
    if (!text || text.length <= maxLength) return text || '';
    return text.substring(0, maxLength) + '...';
  };
  
  // Get volunteer count
  const volunteerCount = event.volunteers?.length || 0;

  // Handle view volunteers
  const handleViewVolunteers = () => {
    setShowVolunteers(true);
  };

  return (
    <>
      <div className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200">
        {/* Banner image */}
        <div className="h-48 bg-gray-200 relative">
          {event.bannerImage ? (
            <img 
              src={event.bannerImage} 
              alt={event.title} 
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gray-100">
              <span className="text-gray-400">No banner image</span>
            </div>
          )}
          
          {/* Published status badge */}
          <div className="absolute top-2 right-2">
            <span className={`px-2 py-1 text-xs font-medium rounded ${
              event.isPublished 
                ? 'bg-green-100 text-green-800' 
                : 'bg-gray-100 text-gray-800'
            }`}>
              {event.isPublished ? 'Published' : 'Draft'}
            </span>
          </div>
        </div>
        
        {/* Content */}
        <div className="p-4">
          <h3 className="text-lg font-semibold text-primary mb-2">{event.title}</h3>
          
          <div className="flex items-center text-sm text-gray-600 mb-2">
            <Calendar size={16} className="mr-1" />
            <span className="mr-3">{formatDate(event.date)}</span>
            <Clock size={16} className="mr-1" />
            <span>{formatTime(event.time)}</span>
          </div>
          
          <div className="flex items-center text-sm text-gray-600 mb-2">
            <MapPin size={16} className="mr-1" />
            <span>{event.location}</span>
          </div>
          
          {/* Volunteer count - clickable */}
          <div 
            className="flex items-center text-sm text-gray-600 mb-3 cursor-pointer hover:text-primary" 
            onClick={handleViewVolunteers}
          >
            <Users size={16} className="mr-1" />
            <span>{volunteerCount} volunteer{volunteerCount !== 1 ? 's' : ''} registered</span>
          </div>
          
          <p className="text-gray-700 text-sm mb-4">
            {truncateDescription(event.description)}
          </p>
          
          {/* Actions */}
          <div className="flex justify-end pt-2 border-t border-gray-100">
            <button 
              onClick={() => onEdit(event)}
              className="p-1 rounded-full hover:bg-gray-100 text-gray-600 hover:text-primary transition-colors mr-2"
              title="Edit event"
            >
              <Edit size={18} />
            </button>
            <button 
              onClick={() => onDelete(event.id)}
              className="p-1 rounded-full hover:bg-gray-100 text-gray-600 hover:text-red-500 transition-colors"
              title="Delete event"
            >
              <Trash2 size={18} />
            </button>
          </div>
        </div>
      </div>

      {/* Volunteers Modal */}
      <VolunteersModal 
        isOpen={showVolunteers}
        onClose={() => setShowVolunteers(false)}
        event={event}
      />
    </>
  );
};

export default EventCard;