import React, { useState } from 'react';
import { Calendar, Clock, MapPin, Users, Edit, Trash2, Archive, RefreshCw } from 'lucide-react';
import VolunteersModal from './EventVolunteersModal';

const EventCard = ({ event, onEdit, onDelete, onArchive, onRestore, isPastEvent }) => {
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

  // Format time for display with AM/PM
  const formatTime = (timeString) => {
    if (!timeString) return '';
    
    // Convert 24-hour format to 12-hour format with AM/PM
    try {
      const [hours, minutes] = timeString.split(':');
      const hour = parseInt(hours, 10);
      const minute = parseInt(minutes, 10);
      
      const period = hour >= 12 ? 'PM' : 'AM';
      const hour12 = hour % 12 || 12; // Convert 0 to 12 for 12 AM
      
      return `${hour12}:${minute.toString().padStart(2, '0')} ${period}`;
    } catch (e) {
      // If parsing fails, return the original string
      return timeString;
    }
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

  const isArchived = event.status === 'archived';

  return (
    <>
      <div className="bg-white rounded-lg shadow-md overflow-hidden flex flex-col h-full
        ${isPastEvent ? 'border-l-4 border-amber-400' : ''} 
        ${isArchived ? 'border-l-4 border-red-400 opacity-75' : ''}">
        {/* Banner image */}
        <div className="relative w-full h-48">
          {event.bannerImage ? (
            <img 
              src={event.bannerImage} 
              alt={event.title} 
              className={`w-full h-full object-cover ${isPastEvent || isArchived ? 'opacity-70' : ''}`}
            />
          ) : (
            <div className="w-full h-full bg-gray-200 flex items-center justify-center">
              <p className="text-gray-500">No banner image</p>
            </div>
          )}
          
          {/* Status badges */}
          <div className="absolute top-4 right-4 flex flex-col gap-2">
            {/* Archived event badge */}
            {isArchived && (
              <span className="px-2 py-1 text-xs font-medium rounded-full bg-red-100 text-red-800">
                Archived
              </span>
            )}
            
            {/* Past event badge */}
            {isPastEvent && !isArchived && (
              <span className="px-2 py-1 text-xs font-medium rounded-full bg-amber-100 text-amber-800">
                Past Event
              </span>
            )}
            
            {/* Published status badge */}
            {!isArchived && (
              <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                event.isPublished ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
              }`}>
                {event.isPublished ? 'Published' : 'Draft'}
              </span>
            )}
          </div>
        </div>
        
        {/* Content */}
        <div className="p-4 flex flex-col flex-grow">
          <h3 className="text-xl font-semibold text-gray-800 mb-2">
            {event.title}
          </h3>
          
          <div className="space-y-2 mb-3">
            <div className="flex items-center text-gray-600">
              <Calendar size={16} className="mr-2" />
              <span className={isPastEvent ? 'text-amber-600 font-medium' : ''}>
                {formatDate(event.date)}
              </span>
            </div>
            
            <div className="flex items-center text-gray-600">
              <Clock size={16} className="mr-2" />
              <span>{formatTime(event.time)}</span>
            </div>
            
            <div className="flex items-center text-gray-600">
              <MapPin size={16} className="mr-2" />
              <span>{event.location}</span>
            </div>
            
            {/* Volunteer count - clickable */}
            <div 
              className="flex items-center text-gray-600 cursor-pointer hover:text-primary"
              onClick={handleViewVolunteers}
            >
              <Users size={16} className="mr-2" />
              <span>{volunteerCount} volunteer{volunteerCount !== 1 ? 's' : ''} registered</span>
            </div>
          </div>
          
          <div className="text-gray-700 mb-4 flex-grow">
            {truncateDescription(event.description)}
          </div>
          
          {/* Actions - Fixed position at bottom of card */}
          <div className="flex justify-between items-center mt-auto pt-3 border-t border-gray-100">
            {/* Event status indicator */}
            {isPastEvent && !isArchived && (
              <div className="text-amber-600 text-xs font-medium bg-amber-50 px-2 py-1 rounded-md">
                Event has passed
              </div>
            )}
            {isArchived && (
              <div className="text-red-600 text-xs font-medium bg-red-50 px-2 py-1 rounded-md">
                Archived event
              </div>
            )}
            {!isPastEvent && !isArchived && (
              <div className="text-green-600 text-xs font-medium bg-green-50 px-2 py-1 rounded-md">
                Upcoming event
              </div>
            )}
            
            <div className="flex ml-auto">
              {!isArchived ? (
                <>
                  <button
                    onClick={() => onEdit(event)}
                    className="p-1 rounded-full hover:bg-gray-100 text-gray-600 hover:text-primary transition-colors mr-2"
                    title="Edit event"
                  >
                    <Edit size={18} />
                  </button>
                  <button
                    onClick={() => onArchive(event.id)}
                    className="p-1 rounded-full hover:bg-gray-100 text-gray-600 hover:text-amber-600 transition-colors"
                    title="Archive event"
                  >
                    <Archive size={18} />
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => onRestore(event.id)}
                    className="p-1 rounded-full hover:bg-gray-100 text-gray-600 hover:text-green-600 transition-colors mr-2"
                    title="Restore event"
                  >
                    <RefreshCw size={18} />
                  </button>
                  <button
                    onClick={() => onDelete(event.id)}
                    className="p-1 rounded-full hover:bg-gray-100 text-gray-600 hover:text-red-500 transition-colors"
                    title="Delete event permanently"
                  >
                    <Trash2 size={18} />
                  </button>
                </>
              )}
            </div>
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