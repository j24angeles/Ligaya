import React, { useState, useEffect } from 'react';
import { Calendar, Clock, MapPin, Users, ArrowRight, X, AlertCircle, Loader2 } from 'lucide-react';
import { useToast } from '../../hooks/ToastProvider';
import ConfirmationModal from '../ConfirmationModal';

const PublicEventCard = ({ 
  event: propEvent, 
  isRegistered: propIsRegistered, 
  isPastEvent, 
  onRegister, 
  onCancelRegistration,
  currentUserId 
}) => {
  const { showSuccess, showError } = useToast();
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [confirmAction, setConfirmAction] = useState(null);
  const [localIsRegistered, setLocalIsRegistered] = useState(propIsRegistered);
  const [localEvent, setLocalEvent] = useState(propEvent);
  const [isProcessing, setIsProcessing] = useState(false);
  // Adding a specific state for volunteer count to ensure UI consistency
  const [volunteerCount, setVolunteerCount] = useState(propEvent.volunteers?.length || 0);

  // Sync local state with prop changes
  useEffect(() => {
    setLocalIsRegistered(propIsRegistered);
    setLocalEvent(propEvent);
    setVolunteerCount(propEvent.volunteers?.length || 0);
  }, [propIsRegistered, propEvent]);

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
    
    if (timeString.includes('AM') || timeString.includes('PM')) {
      return timeString;
    }
    
    try {
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
      return timeString;
    }
  };

  // Truncate description for preview
  const truncateDescription = (text, maxLength = 120) => {
    if (!text || text.length <= maxLength) return text || '';
    return text.substring(0, maxLength) + '...';
  };
  
  const handleRegisterClick = () => {
    if (isPastEvent || isProcessing) return;
    setConfirmAction('register');
    setShowConfirmModal(true);
  };
  
  const handleCancelClick = () => {
    if (isPastEvent || isProcessing) return;
    setConfirmAction('cancel');
    setShowConfirmModal(true);
  };
  
  const handleConfirmAction = async () => {
    setIsProcessing(true);
    setShowConfirmModal(false);
    
    try {
      if (confirmAction === 'register') {
        // Optimistic UI updates
        setLocalIsRegistered(true);
        // Update volunteer count immediately for better UI feedback
        setVolunteerCount(prevCount => prevCount + 1);
        setLocalEvent(prev => ({
          ...prev,
          volunteers: [...(prev.volunteers || []), { id: currentUserId }]
        }));
        
        await onRegister();
        showSuccess('Successfully registered for the event!');
      } else if (confirmAction === 'cancel') {
        // Optimistic UI updates
        setLocalIsRegistered(false);
        // Update volunteer count immediately for better UI feedback
        setVolunteerCount(prevCount => Math.max(0, prevCount - 1));
        setLocalEvent(prev => ({
          ...prev,
          volunteers: (prev.volunteers || []).filter(v => v.id !== currentUserId)
        }));
        
        await onCancelRegistration();
        showSuccess('Registration cancelled successfully');
      }
    } catch (error) {
      // Revert on error
      setLocalIsRegistered(confirmAction === 'register' ? false : true);
      // Also revert the volunteer count on error
      setVolunteerCount(propEvent.volunteers?.length || 0);
      setLocalEvent(propEvent);
      showError(error.message || 'An error occurred');
    } finally {
      setIsProcessing(false);
    }
  };

  // Determine status using LOCAL state
  let statusBadge = null;
  if (isPastEvent) {
    statusBadge = {
      text: "Past Event",
      bgColor: "bg-gray-100", 
      textColor: "text-gray-800"
    };
  } else if (localIsRegistered) {
    statusBadge = {
      text: "You're registered",
      bgColor: "bg-green-100", 
      textColor: "text-green-800"
    };
  }

  return (
    <>
      <div className={`bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-all duration-300 flex flex-col h-full border border-gray-100 ${isPastEvent ? 'opacity-85' : ''}`}>
        <div 
          className="cursor-pointer flex-grow flex flex-col"
          onClick={() => !isProcessing && setShowDetailsModal(true)}
        >
          <div className="relative w-full h-48">
            {localEvent.bannerImage ? (
              <>
                <img 
                  src={localEvent.bannerImage} 
                  alt={localEvent.title} 
                  className={`w-full h-full object-cover ${isPastEvent ? 'filter grayscale opacity-80' : ''}`}
                />
                <div className={`absolute inset-0 bg-gradient-to-t from-black/60 to-transparent ${isPastEvent ? 'from-black/80' : ''}`}></div>
              </>
            ) : (
              <div className="w-full h-full bg-gradient-to-r from-gray-200 to-gray-300 flex items-center justify-center">
                <p className="text-gray-500">No image available</p>
              </div>
            )}
            
            {statusBadge && (
              <div className={`absolute top-4 right-4 ${statusBadge.bgColor} ${statusBadge.textColor} py-1 px-3 rounded-full text-xs font-medium`}>
                {statusBadge.text}
              </div>
            )}
          </div>

          <div className="p-5 flex-grow flex flex-col">
            <h3 className="text-xl font-bold text-gray-800 mb-3 line-clamp-2">
              {localEvent.title}
            </h3>
            
            <div className="space-y-3 mb-4 text-sm">
              <div className="flex items-center text-gray-700">
                <Calendar size={16} className="text-primary mr-2 flex-shrink-0" />
                <span>{formatDate(localEvent.date)}</span>
              </div>
              
              <div className="flex items-center text-gray-700">
                <Clock size={16} className="text-primary mr-2 flex-shrink-0" />
                <span>{formatTime(localEvent.time)}</span>
              </div>
              
              <div className="flex items-center text-gray-700">
                <MapPin size={16} className="text-primary mr-2 flex-shrink-0" />
                <span className="line-clamp-1">{localEvent.location}</span>
              </div>
              
              <div className="flex items-center text-gray-700">
                <Users size={16} className="text-primary mr-2 flex-shrink-0" />
                <span>{volunteerCount} volunteer{volunteerCount !== 1 ? 's' : ''} registered</span>
              </div>
            </div>
            
            <p className="text-gray-600 mb-4 text-sm flex-grow">
              {truncateDescription(localEvent.description)}
            </p>
            
            <div className="flex items-center text-primary font-medium text-sm mt-2">
              View details
              <ArrowRight size={16} className="ml-1" />
            </div>
          </div>
        </div>
        
        <div className="p-5 pt-0">
          {isPastEvent ? (
            <div className="px-4 py-2.5 bg-gray-100 text-gray-500 rounded-lg w-full font-medium text-sm flex items-center justify-center">
              <AlertCircle size={16} className="mr-2" />
              Event has ended
            </div>
          ) : localIsRegistered ? (
            <button 
              onClick={(e) => {
                e.stopPropagation();
                handleCancelClick();
              }} 
              disabled={isProcessing}
              className={`px-4 py-2.5 bg-red-50 text-red-600 hover:bg-red-100 rounded-lg transition-colors w-full font-medium text-sm flex items-center justify-center ${
                isProcessing ? 'opacity-70 cursor-not-allowed' : ''
              }`}
            >
              {isProcessing ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                'Cancel Registration'
              )}
            </button>
          ) : (
            <button 
              onClick={(e) => {
                e.stopPropagation();
                handleRegisterClick();
              }}
              disabled={isProcessing}
              className={`px-4 py-2.5 bg-primary text-white hover:bg-primary/90 rounded-lg transition-colors w-full font-medium text-sm flex items-center justify-center ${
                isProcessing ? 'opacity-70 cursor-not-allowed' : ''
              }`}
            >
              {isProcessing ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                'Register as Volunteer'
              )}
            </button>
          )}
        </div>
      </div>

      {showDetailsModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-xl">
            <div className="sticky top-0 bg-white p-4 border-b border-gray-200 flex justify-between items-center z-10">
              <h2 className="text-2xl font-bold text-gray-800">Event Details</h2>
              <button 
                onClick={() => setShowDetailsModal(false)}
                className="p-1 rounded-full hover:bg-gray-100"
                disabled={isProcessing}
              >
                <X size={24} />
              </button>
            </div>

            {isPastEvent && (
              <div className="bg-gray-100 p-3 flex items-center justify-center text-gray-700">
                <AlertCircle size={18} className="mr-2" />
                <span>This event has already occurred</span>
              </div>
            )}
            
            <div className="w-full h-64 relative">
              {localEvent.bannerImage ? (
                <img 
                  src={localEvent.bannerImage} 
                  alt={localEvent.title} 
                  className={`w-full h-full object-cover ${isPastEvent ? 'filter grayscale opacity-80' : ''}`}
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-r from-gray-200 to-gray-300 flex items-center justify-center">
                  <p className="text-gray-500">No image available</p>
                </div>
              )}
            </div>
            
            <div className="p-6">
              <h1 className="text-2xl font-bold text-gray-800 mb-4">{localEvent.title}</h1>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className="space-y-4">
                  <div className="flex items-start">
                    <Calendar size={20} className="text-primary mr-3 mt-1 flex-shrink-0" />
                    <div>
                      <h3 className="font-medium text-gray-800">Date & Time</h3>
                      <p className="text-gray-600">{formatDate(localEvent.date)} at {formatTime(localEvent.time)}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <MapPin size={20} className="text-primary mr-3 mt-1 flex-shrink-0" />
                    <div>
                      <h3 className="font-medium text-gray-800">Location</h3>
                      <p className="text-gray-600">{localEvent.location}</p>
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
                  
                  {localEvent.organizer && (
                    <div className="flex items-start">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary mr-3 mt-1 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                      </svg>
                      <div>
                        <h3 className="font-medium text-gray-800">Organizer</h3>
                        <p className="text-gray-600">{localEvent.organizer}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="mb-6">
                <h3 className="font-medium text-gray-800 mb-2">Description</h3>
                <div className="text-gray-600 whitespace-pre-line">
                  {localEvent.description}
                </div>
              </div>
              
              <div className="mt-8 flex justify-end gap-4">
                <button
                  onClick={() => setShowDetailsModal(false)}
                  disabled={isProcessing}
                  className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors font-medium"
                >
                  Close
                </button>
                
                {isPastEvent ? null : localIsRegistered ? (
                  <button 
                    onClick={handleCancelClick}
                    disabled={isProcessing}
                    className={`px-4 py-2 bg-red-50 text-red-600 hover:bg-red-100 rounded-lg transition-colors font-medium flex items-center ${
                      isProcessing ? 'opacity-70 cursor-not-allowed' : ''
                    }`}
                  >
                    {isProcessing && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    {isProcessing ? 'Processing...' : 'Cancel Registration'}
                  </button>
                ) : (
                  <button 
                    onClick={handleRegisterClick}
                    disabled={isProcessing}
                    className={`px-4 py-2 bg-primary text-white hover:bg-primary/90 rounded-lg transition-colors font-medium flex items-center ${
                      isProcessing ? 'opacity-70 cursor-not-allowed' : ''
                    }`}
                  >
                    {isProcessing && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    {isProcessing ? 'Processing...' : 'Register as Volunteer'}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      <ConfirmationModal
        show={showConfirmModal}
        onClose={() => !isProcessing && setShowConfirmModal(false)}
        title={confirmAction === 'register' ? 'Confirm Registration' : 'Confirm Cancellation'}
        message={
          confirmAction === 'register' 
            ? `Are you sure you want to register as a volunteer for "${localEvent.title}"?`
            : `Are you sure you want to cancel your registration for "${localEvent.title}"?`
        }
        onConfirm={handleConfirmAction}
        type={confirmAction === 'register' ? 'info' : 'delete'}
        confirmText={confirmAction === 'register' ? 'Register' : 'Cancel Registration'}
        isProcessing={isProcessing}
      />
    </>
  );
};

export default PublicEventCard;