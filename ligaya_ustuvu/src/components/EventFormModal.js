import React, { useState, useEffect } from 'react';
import { Calendar, Clock, MapPin, Image, X, User } from 'lucide-react';

const EventFormModal = ({ isOpen, onClose, onSubmit, currentEvent = null }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    location: '',
    date: '',
    time: '',
    bannerImage: '',
    isPublished: false
  });

  // Track which fields have been touched by the user (on blur)
  const [touched, setTouched] = useState({
    title: false,
    description: false,
    location: false,
    date: false,
    time: false
  });

  // Track if form has been submitted to show all errors
  const [isSubmitted, setIsSubmitted] = useState(false);
  
  // Store validation errors
  const [errors, setErrors] = useState({});
  
  // Initialize form with current event data if editing
  useEffect(() => {
    if (currentEvent) {
      setFormData({
        ...currentEvent,
        date: currentEvent.date ? currentEvent.date : '',
        time: currentEvent.time ? currentEvent.time : ''
      });
    } else {
      // Reset form when adding new event
      setFormData({
        title: '',
        description: '',
        location: '',
        date: '',
        time: '',
        bannerImage: '',
        isPublished: false
      });
    }
    // Reset touched states and errors when modal opens/closes or changes between edit/create
    setTouched({
      title: false,
      description: false,
      location: false,
      date: false,
      time: false
    });
    setErrors({});
    setIsSubmitted(false);
  }, [currentEvent, isOpen]);

  // Validate a single field
  const validateField = (name, value) => {
    switch (name) {
      case 'title':
        return value.trim() === '' ? 'Event title is required' : '';
      case 'description':
        return value.trim() === '' ? 'Description is required' : '';
      case 'location':
        return value.trim() === '' ? 'Location is required' : '';
      case 'date':
        return value === '' ? 'Date is required' : '';
      case 'time':
        return value === '' ? 'Time is required' : '';
      default:
        return '';
    }
  };

  // Validate all fields
  const validateForm = () => {
    const newErrors = {};
    let isValid = true;
    
    // Validate all required fields
    Object.entries(formData).forEach(([key, value]) => {
      if (['title', 'description', 'location', 'date', 'time'].includes(key)) {
        const error = validateField(key, value);
        if (error) {
          newErrors[key] = error;
          isValid = false;
        }
      }
    });

    setErrors(newErrors);
    return isValid;
  };

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === 'checkbox' ? checked : value;
    
    setFormData(prev => ({
      ...prev,
      [name]: newValue
    }));
    
    // Only validate if the field has been touched (blurred) or form has been submitted
    if (touched[name] || isSubmitted) {
      setErrors(prev => ({
        ...prev,
        [name]: validateField(name, newValue)
      }));
    }
  };

  // Handle field blur to mark as touched
  const handleBlur = (e) => {
    const { name, value } = e.target;
    
    // Mark the field as touched
    setTouched(prev => ({
      ...prev,
      [name]: true
    }));
    
    // Validate the field
    setErrors(prev => ({
      ...prev,
      [name]: validateField(name, value)
    }));
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitted(true);
    
    // Validate all fields before submitting
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  // Helper to determine if error should be shown
  const shouldShowError = (fieldName) => {
    return (touched[fieldName] || isSubmitted) && errors[fieldName];
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-xl font-semibold text-primary">
            {currentEvent ? 'Edit Event' : 'Create New Event'}
          </h2>
          <button
            onClick={onClose}
            className="p-1 rounded-full hover:bg-gray-200 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                  Event Title*
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">
                    <User size={16} />
                  </span>
                  <input
                    type="text"
                    id="title"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    onBlur={handleBlur}
                    className={`w-full p-2 pl-10 border ${shouldShowError('title') ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 ${shouldShowError('title') ? 'focus:ring-red-500' : 'focus:ring-primary'}`}
                    placeholder="Enter event title"
                  />
                </div>
                {shouldShowError('title') && (
                  <p className="text-red-500 text-sm mt-1">{errors.title}</p>
                )}
              </div>
              
              <div>
                <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">
                  Location*
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">
                    <MapPin size={16} />
                  </span>
                  <input
                    type="text"
                    id="location"
                    name="location"
                    value={formData.location}
                    onChange={handleInputChange}
                    onBlur={handleBlur}
                    className={`w-full p-2 pl-10 border ${shouldShowError('location') ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 ${shouldShowError('location') ? 'focus:ring-red-500' : 'focus:ring-primary'}`}
                    placeholder="Enter location"
                  />
                </div>
                {shouldShowError('location') && (
                  <p className="text-red-500 text-sm mt-1">{errors.location}</p>
                )}
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">
                    Date*
                  </label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">
                      <Calendar size={16} />
                    </span>
                    <input
                      type="date"
                      id="date"
                      name="date"
                      value={formData.date}
                      onChange={handleInputChange}
                      onBlur={handleBlur}
                      className={`w-full p-2 pl-10 border ${shouldShowError('date') ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 ${shouldShowError('date') ? 'focus:ring-red-500' : 'focus:ring-primary'}`}
                    />
                  </div>
                  {shouldShowError('date') && (
                    <p className="text-red-500 text-sm mt-1">{errors.date}</p>
                  )}
                </div>
                
                <div>
                  <label htmlFor="time" className="block text-sm font-medium text-gray-700 mb-1">
                    Time*
                  </label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">
                      <Clock size={16} />
                    </span>
                    <input
                      type="time"
                      id="time"
                      name="time"
                      value={formData.time}
                      onChange={handleInputChange}
                      onBlur={handleBlur}
                      className={`w-full p-2 pl-10 border ${shouldShowError('time') ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 ${shouldShowError('time') ? 'focus:ring-red-500' : 'focus:ring-primary'}`}
                    />
                  </div>
                  {shouldShowError('time') && (
                    <p className="text-red-500 text-sm mt-1">{errors.time}</p>
                  )}
                </div>
              </div>
              
              <div>
                <label htmlFor="bannerImage" className="block text-sm font-medium text-gray-700 mb-1">
                  Banner Image URL
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">
                    <Image size={16} />
                  </span>
                  <input
                    type="text"
                    id="bannerImage"
                    name="bannerImage"
                    value={formData.bannerImage}
                    onChange={handleInputChange}
                    className="w-full p-2 pl-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="Enter image URL"
                  />
                </div>
              </div>
              
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="isPublished"
                  name="isPublished"
                  checked={formData.isPublished}
                  onChange={handleInputChange}
                  className="rounded text-primary focus:ring-primary"
                />
                <label htmlFor="isPublished" className="ml-2 text-sm text-gray-700">
                  Publish event immediately
                </label>
              </div>
            </div>
            
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                Description*
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                onBlur={handleBlur}
                rows="12"
                className={`w-full p-2 border ${shouldShowError('description') ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 ${shouldShowError('description') ? 'focus:ring-red-500' : 'focus:ring-primary'}`}
                placeholder="Enter event description"
              ></textarea>
              {shouldShowError('description') && (
                <p className="text-red-500 text-sm mt-1">{errors.description}</p>
              )}
            </div>
          </div>
          
          <div className="flex justify-end mt-6 space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors"
            >
              {currentEvent ? 'Update Event' : 'Create Event'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EventFormModal;