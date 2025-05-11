import React, { useState } from 'react';
import { Calendar, Clock, MapPin, Users, ArrowRight, X, AlertCircle } from 'lucide-react';
import { useToast } from '../../hooks/ToastProvider';
import ConfirmationModal from '../ConfirmationModal';

const PublicEventCard = ({ event, isRegistered, isPastEvent, onRegister, onCancelRegistration }) => {
  const { showSuccess, showError } = useToast();
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [confirmAction, setConfirmAction] = useState(null);

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

  // Format time to include AM/PM
  const formatTime = (timeString) => {
    if (!timeString) return '';
    
    // If time is already in proper format, just return it
    if (timeString.includes('AM') || timeString.includes('PM')) {
      return timeString;
    }
    
    // Handle 24h format or other formats by creating a date object
    try {
      // Create a date object with the current date and the specified time
      const [hours, minutes] = timeString.split(':').map(num => parseInt(num, 10));
      const date = new Date();
      date.setHours(hours);
      date.setMinutes(minutes);
      
      return date.toLocaleTimeString('en-US', { 
        hour: 'numeric',
        minute: '2-digit',
        hour12: true 
      });
    } catch (e) {
      // Fallback if parsing fails
      return timeString;
    }
  };

  // Truncate description for preview
  const truncateDescription = (text, maxLength = 120) => {
    if (!text || text.length <= maxLength) return text || '';
    return text.substring(0, maxLength) + '...';
  };

  // Get volunteer count
  const volunteerCount = event.volunteers?.length || 0;
  
  // Handle registration with confirmation
  const handleRegisterClick = () => {
    if (isPastEvent) return; // Prevent registration for past events
    setConfirmAction('register');
    setShowConfirmModal(true);
  };
  
  // Handle cancellation with confirmation
  const handleCancelClick = () => {
    if (isPastEvent) return; // Prevent cancellation for past events
    setConfirmAction('cancel');
    setShowConfirmModal(true);
  };
  
  // Execute the confirmed action
  const handleConfirmAction = async () => {
    try {
      if (confirmAction === 'register') {
        await onRegister();
        showSuccess('Successfully registered for the event!');
      } else if (confirmAction === 'cancel') {
        await onCancelRegistration();
        showSuccess('Registration cancelled successfully');
      }
    } catch (error) {
      showError(error.message || 'An error occurred');
    }
  };

  // Determine status label and color
  let statusBadge = null;
  
  if (isPastEvent) {
    statusBadge = {
      text: "Past Event",
      bgColor: "bg-gray-100", 
      textColor: "text-gray-800"
    };
  } else if (isRegistered) {
    statusBadge = {
      text: "You're registered",
      bgColor: "bg-green-100", 
      textColor: "text-green-800"
    };
  }

  return (
    <>
      <div className={`bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-all duration-300 flex flex-col h-full border border-gray-100 ${isPastEvent ? 'opacity-85' : ''}`}>
        {/* Card clickable area */}
        <div 
          className="cursor-pointer flex-grow flex flex-col"
          onClick={() => setShowDetailsModal(true)}
        >
          {/* Banner image with gradient overlay */}
          <div className="relative w-full h-48">
            {event.bannerImage ? (
              <>
                <img 
                  src={event.bannerImage} 
                  alt={event.title} 
                  className={`w-full h-full object-cover ${isPastEvent ? 'filter grayscale opacity-80' : ''}`}
                />
                <div className={`absolute inset-0 bg-gradient-to-t from-black/60 to-transparent ${isPastEvent ? 'from-black/80' : ''}`}></div>
              </>
            ) : (
              <div className="w-full h-full bg-gradient-to-r from-gray-200 to-gray-300 flex items-center justify-center">
                <p className="text-gray-500">No image available</p>
              </div>
            )}
            
            {/* Status badge - displayed if present */}
            {statusBadge && (
              <div className={`absolute top-4 right-4 ${statusBadge.bgColor} ${statusBadge.textColor} py-1 px-3 rounded-full text-xs font-medium`}>
                {statusBadge.text}
              </div>
            )}
          </div>

          {/* Content */}
          <div className="p-5 flex-grow flex flex-col">
            <h3 className="text-xl font-bold text-gray-800 mb-3 line-clamp-2">
              {event.title}
            </h3>
            
            <div className="space-y-3 mb-4 text-sm">
              <div className="flex items-center text-gray-700">
                <Calendar size={16} className="text-primary mr-2 flex-shrink-0" />
                <span>{formatDate(event.date)}</span>
              </div>
              
              <div className="flex items-center text-gray-700">
                <Clock size={16} className="text-primary mr-2 flex-shrink-0" />
                <span>{formatTime(event.time)}</span>
              </div>
              
              <div className="flex items-center text-gray-700">
                <MapPin size={16} className="text-primary mr-2 flex-shrink-0" />
                <span className="line-clamp-1">{event.location}</span>
              </div>
              
              <div className="flex items-center text-gray-700">
                <Users size={16} className="text-primary mr-2 flex-shrink-0" />
                <span>{volunteerCount} volunteer{volunteerCount !== 1 ? 's' : ''} registered</span>
              </div>
            </div>
            
            <p className="text-gray-600 mb-4 text-sm flex-grow">
              {truncateDescription(event.description)}
            </p>
            
            <div className="flex items-center text-primary font-medium text-sm mt-2">
              View details
              <ArrowRight size={16} className="ml-1" />
            </div>
          </div>
        </div>
        
        {/* Action buttons - separate from the clickable area */}
        <div className="p-5 pt-0">
          {isPastEvent ? (
            <div className="px-4 py-2.5 bg-gray-100 text-gray-500 rounded-lg w-full font-medium text-sm flex items-center justify-center">
              <AlertCircle size={16} className="mr-2" />
              Event has ended
            </div>
          ) : isRegistered ? (
            <button 
              onClick={(e) => {
                e.stopPropagation(); // Prevent triggering the card click
                handleCancelClick();
              }} 
              className="px-4 py-2.5 bg-red-50 text-red-600 hover:bg-red-100 rounded-lg transition-colors w-full font-medium text-sm"
            >
              Cancel Registration
            </button>
          ) : (
            <button 
              onClick={(e) => {
                e.stopPropagation(); // Prevent triggering the card click
                handleRegisterClick();
              }} 
              className="px-4 py-2.5 bg-primary text-white hover:bg-primary/90 rounded-lg transition-colors w-full font-medium text-sm"
            >
              Register as Volunteer
            </button>
          )}
        </div>
      </div>

      {/* Event Details Modal */}
      {showDetailsModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-xl">
            {/* Modal Header with close button */}
            <div className="sticky top-0 bg-white p-4 border-b border-gray-200 flex justify-between items-center z-10">
              <h2 className="text-2xl font-bold text-gray-800">Event Details</h2>
              <button 
                onClick={() => setShowDetailsModal(false)}
                className="p-1 rounded-full hover:bg-gray-100"
              >
                <X size={24} />
              </button>
            </div>

            {/* Past Event Banner - only shown for past events */}
            {isPastEvent && (
              <div className="bg-gray-100 p-3 flex items-center justify-center text-gray-700">
                <AlertCircle size={18} className="mr-2" />
                <span>This event has already occurred and is no longer available for registration</span>
              </div>
            )}
            
            {/* Event Banner Image */}
            <div className="w-full h-64 relative">
              {event.bannerImage ? (
                <img 
                  src={event.bannerImage} 
                  alt={event.title} 
                  className={`w-full h-full object-cover ${isPastEvent ? 'filter grayscale opacity-80' : ''}`}
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-r from-gray-200 to-gray-300 flex items-center justify-center">
                  <p className="text-gray-500">No image available</p>
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
                      <p className="text-gray-600">{event.location}</p>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-start">
                    <Users size={20} className="text-primary mr-3 mt-1 flex-shrink-0" />
                    <div>
                      <h3 className="font-medium text-gray-800">Volunteers</h3>
                      <p className="text-gray-600">{volunteerCount} volunteer{volunteerCount !== 1 ? 's' : ''} registered</p>
                    </div>
                  </div>
                  
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
                  {event.description}
                </div>
              </div>
              
              {/* Modal action buttons */}
              <div className="mt-8 flex justify-end gap-4">
                <button
                  onClick={() => setShowDetailsModal(false)}
                  className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors font-medium"
                >
                  Close
                </button>
                
                {isPastEvent ? (
                  // No action button for past events
                  null
                ) : isRegistered ? (
                  <button 
                    onClick={handleCancelClick}
                    className="px-4 py-2 bg-red-50 text-red-600 hover:bg-red-100 rounded-lg transition-colors font-medium"
                  >
                    Cancel Registration
                  </button>
                ) : (
                  <button 
                    onClick={handleRegisterClick}
                    className="px-4 py-2 bg-primary text-white hover:bg-primary/90 rounded-lg transition-colors font-medium"
                  >
                    Register as Volunteer
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Confirmation Modal */}
      <ConfirmationModal
        show={showConfirmModal}
        onClose={() => setShowConfirmModal(false)}
        title={confirmAction === 'register' ? 'Confirm Registration' : 'Confirm Cancellation'}
        message={
          confirmAction === 'register' 
            ? `Are you sure you want to register as a volunteer for "${event.title}"?`
            : `Are you sure you want to cancel your registration for "${event.title}"?`
        }
        onConfirm={handleConfirmAction}
        type={confirmAction === 'register' ? 'info' : 'delete'}
        confirmText={confirmAction === 'register' ? 'Register' : 'Cancel Registration'}
      />
    </>
  );
};

export default PublicEventCard;