import React from 'react';
import { X, Mail, Calendar } from 'lucide-react';

const VolunteersModal = ({ isOpen, onClose, event }) => {
  if (!isOpen) return null;
  
  const volunteers = event?.volunteers || [];
  
  // Format registration date
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <h3 className="font-semibold text-lg">
            Volunteers for {event?.title || 'Event'}
          </h3>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X size={20} />
          </button>
        </div>
        
        {/* Content */}
        <div className="p-4">
          {volunteers.length === 0 ? (
            <p className="text-gray-500 text-center py-4">No volunteers registered yet.</p>
          ) : (
            <div className="divide-y">
              {volunteers.map((volunteer) => (
                <div key={volunteer.id} className="py-3">
                  <div className="font-medium">{volunteer.name}</div>
                  <div className="flex items-center text-sm text-gray-600 mt-1">
                    <Mail size={14} className="mr-1" />
                    <span>{volunteer.email}</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-500 mt-1">
                    <Calendar size={14} className="mr-1" />
                    <span>Registered: {formatDate(volunteer.registeredAt)}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        
        {/* Footer */}
        <div className="border-t p-4 bg-gray-50 flex justify-end">
          <button 
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded text-sm font-medium"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default VolunteersModal;