import React from 'react';
import { Calendar, Clock, MapPin, Users } from 'lucide-react';

const PublicEventCard = ({ event, isRegistered, onRegister, onCancelRegistration }) => {
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

  return (
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
        
        <div className="flex items-center text-sm text-gray-600 mb-3">
          <Users size={16} className="mr-1" />
          <span>{volunteerCount} volunteer{volunteerCount !== 1 ? 's' : ''} registered</span>
        </div>
        
        <p className="text-gray-700 text-sm mb-4">
          {truncateDescription(event.description)}
        </p>
        
        {/* Action button */}
        <div className="pt-2 border-t border-gray-100">
          {isRegistered ? (
            <button 
              onClick={onCancelRegistration}
              className="w-full py-2 bg-red-100 text-red-700 rounded-md hover:bg-red-200 transition-colors"
            >
              Cancel Registration
            </button>
          ) : (
            <button 
              onClick={onRegister}
              className="w-full py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors"
            >
              Register as Volunteer
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default PublicEventCard;
