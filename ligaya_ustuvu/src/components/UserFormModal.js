import React, { useState, useEffect } from 'react';
import { User, Mail, Calendar, Key, Shield, X } from 'lucide-react';

const UserFormModal = ({ isOpen, onClose, onSubmit, currentUser = null }) => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    birthdate: '',
    password: '',
    role: 'volunteer'
  });

  // Track which fields have been touched by the user
  const [touched, setTouched] = useState({
    firstName: false,
    lastName: false,
    email: false,
    password: false
  });

  // Track if form has been submitted
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Store validation errors
  const [errors, setErrors] = useState({});

  // Initialize form with current user data if editing
  useEffect(() => {
    if (currentUser) {
      setFormData({
        firstName: currentUser.firstName || '',
        lastName: currentUser.lastName || '',
        email: currentUser.email || '',
        birthdate: currentUser.birthdate || '',
        password: '',
        role: 'volunteer'
      });
    } else {
      // Reset form when adding new user
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        birthdate: '',
        password: '',
        role: 'volunteer'
      });
    }
    // Reset touched states and errors when modal opens/closes or changes between edit/create
    setTouched({
      firstName: false,
      lastName: false,
      email: false,
      password: false
    });
    setErrors({});
    setIsSubmitted(false);
  }, [currentUser, isOpen]);

  // Validate a single field
  const validateField = (name, value) => {
    switch (name) {
      case 'firstName':
        return value.trim() === '' ? 'First name is required' : '';
      case 'lastName':
        return value.trim() === '' ? 'Last name is required' : '';
      case 'email':
        if (value.trim() === '') return 'Email is required';
        if (!/\S+@\S+\.\S+/.test(value)) return 'Email is invalid';
        return '';
      case 'password':
        if (!currentUser && value === '') return 'Password is required for new volunteers';
        if (value && value.length < 6) return 'Password must be at least 6 characters';
        return '';
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
      if (['firstName', 'lastName', 'email', 'password'].includes(key)) {
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
    const { name, value } = e.target;
    
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Validate field if it's been touched or form has been submitted
    if (touched[name] || isSubmitted) {
      setErrors(prev => ({
        ...prev,
        [name]: validateField(name, value)
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

  // Helper to determine if error should be shown
  const shouldShowError = (fieldName) => {
    return (touched[fieldName] || isSubmitted) && errors[fieldName];
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitted(true);
    
    if (validateForm()) {
      // Ensure role is volunteer before submitting
      onSubmit({...formData, role: 'volunteer'});
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-xl font-semibold text-primary">
            {currentUser ? 'Edit Volunteer' : 'Create New Volunteer'}
          </h2>
          <button
            onClick={onClose}
            className="p-1 rounded-full hover:bg-gray-200 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">
                First Name*
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">
                  <User size={16} />
                </span>
                <input
                  type="text"
                  id="firstName"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  onBlur={handleBlur}
                  className={`w-full p-2 pl-10 border ${shouldShowError('firstName') ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-primary`}
                  placeholder="Enter first name"
                />
              </div>
              {shouldShowError('firstName') && <p className="text-red-500 text-xs mt-1">{errors.firstName}</p>}
            </div>
            
            <div className="space-y-1">
              <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">
                Last Name*
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">
                  <User size={16} />
                </span>
                <input
                  type="text"
                  id="lastName"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  onBlur={handleBlur}
                  className={`w-full p-2 pl-10 border ${shouldShowError('lastName') ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-primary`}
                  placeholder="Enter last name"
                />
              </div>
              {shouldShowError('lastName') && <p className="text-red-500 text-xs mt-1">{errors.lastName}</p>}
            </div>
            
            <div className="space-y-1">
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email*
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">
                  <Mail size={16} />
                </span>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  onBlur={handleBlur}
                  className={`w-full p-2 pl-10 border ${shouldShowError('email') ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-primary`}
                  placeholder="Enter email address"
                />
              </div>
              {shouldShowError('email') && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
            </div>
            
            <div className="space-y-1">
              <label htmlFor="birthdate" className="block text-sm font-medium text-gray-700">
                Birthdate
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">
                  <Calendar size={16} />
                </span>
                <input
                  type="date"
                  id="birthdate"
                  name="birthdate"
                  value={formData.birthdate}
                  onChange={handleInputChange}
                  className="w-full p-2 pl-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
            </div>
            
            <div className="space-y-1">
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                {currentUser ? 'Password (leave empty to keep current)' : 'Password*'}
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">
                  <Key size={16} />
                </span>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  onBlur={handleBlur}
                  className={`w-full p-2 pl-10 border ${shouldShowError('password') ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-primary`}
                  placeholder={currentUser ? 'Enter new password' : 'Enter password'}
                />
              </div>
              {shouldShowError('password') && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
            </div>
            
            <div className="space-y-1">
              <label htmlFor="role" className="block text-sm font-medium text-gray-700">
                Role
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">
                  <Shield size={16} />
                </span>
                <input
                  type="text"
                  id="role"
                  name="role"
                  value="Volunteer"
                  disabled
                  className="w-full p-2 pl-10 border border-gray-300 rounded-md bg-gray-50 text-gray-500"
                />
              </div>
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
              {currentUser ? 'Update Volunteer' : 'Create Volunteer'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UserFormModal;