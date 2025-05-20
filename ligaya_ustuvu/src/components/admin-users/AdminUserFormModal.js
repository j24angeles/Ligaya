import React, { useState, useEffect } from 'react';
import { User, Mail, Calendar, Key, Shield, X } from 'lucide-react';

const AdminUserFormModal = ({ isOpen, onClose, onSubmit, currentUser = null }) => {
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
    birthdate: false,
    password: false
  });

  // Track if form has been submitted
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Store validation errors
  const [errors, setErrors] = useState({});
  
  // Password strength tracking
  const [passwordStrength, setPasswordStrength] = useState(0);

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
      birthdate: false,
      password: false
    });
    setErrors({});
    setIsSubmitted(false);
  }, [currentUser, isOpen]);

  // Calculate password strength
  const calculatePasswordStrength = (password) => {
    if (!password) return 0;
    
    let strength = 0;
    
    // Length check
    if (password.length >= 6) strength += 1;
    if (password.length >= 10) strength += 1;
    
    // Character variety checks
    if (/[A-Z]/.test(password)) strength += 1;
    if (/[0-9]/.test(password)) strength += 1;
    if (/[^A-Za-z0-9]/.test(password)) strength += 1;
    
    return Math.min(strength, 5); // Max score of 5
  };
  
  // Get strength label and color
  const getStrengthInfo = (strength) => {
    const labels = ['Very Weak', 'Weak', 'Fair', 'Good', 'Strong', 'Very Strong'];
    const colors = ['#ff4d4d', '#ff9933', '#ffcc00', '#99cc33', '#70cc33', '#33cc33'];
    
    return {
      label: labels[strength],
      color: colors[strength]
    };
  };

  // Calculate age from birthdate
  const calculateAge = (birthdate) => {
    const birthDate = new Date(birthdate);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    
    return age;
  };

  // Validate a single field
  const validateField = (name, value) => {
    switch (name) {
      case 'firstName':
        if (value.trim() === '') return 'First name is required';
        if (value.length > 50) return 'First name must be 50 characters or less';
        return '';
      case 'lastName':
        if (value.trim() === '') return 'Last name is required';
        if (value.length > 50) return 'Last name must be 50 characters or less';
        return '';
      case 'email':
        if (value.trim() === '') return 'Email is required';
        if (value.length > 100) return 'Email must be 100 characters or less';
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return 'Please enter a valid email address';
        return '';
      case 'password':
        // Only require password for new users
        if (!currentUser && value === '') return 'Password is required for new volunteers';
        if (value && value.length < 6) return 'Password must be at least 6 characters';
        if (value && value.length > 50) return 'Password must be 50 characters or less';
        if (value && !/(?=.*[A-Z])(?=.*\d)/.test(value)) return 'Password must contain at least 1 number and 1 capital letter';
        return '';
      case 'birthdate':
        if (value === '') return 'Birthdate is required';
        
        // Check if date is in the future
        const today = new Date();
        today.setHours(0, 0, 0, 0); // Reset time part for accurate comparison
        const selectedDate = new Date(value);
        if (selectedDate > today) return 'Birthdate cannot be in the future';
        
        // Check age is at least 13
        const age = calculateAge(value);
        if (age < 13) return 'You must be at least 13 years old';
        
        return '';
      default:
        return '';
    }
  };

  // Validate all fields
  const validateForm = () => {
    const newErrors = {};
    let isValid = true;
    
    // Validate all fields
    Object.entries(formData).forEach(([key, value]) => {
      if (key === 'role') return; // Skip role validation as it's fixed
      
      const error = validateField(key, value);
      if (error) {
        newErrors[key] = error;
        isValid = false;
      }
    });

    setErrors(newErrors);
    return isValid;
  };

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    // Enforce max lengths
    let processedValue = value;
    if (name === 'firstName' || name === 'lastName') {
      processedValue = value.slice(0, 50);
    } else if (name === 'email') {
      processedValue = value.slice(0, 100);
    } else if (name === 'password') {
      processedValue = value.slice(0, 50);
    }
    
    setFormData(prev => ({
      ...prev,
      [name]: processedValue
    }));
    
    // Update password strength when password changes
    if (name === 'password') {
      setPasswordStrength(calculatePasswordStrength(processedValue));
    }
    
    // Validate field if it's been touched or form has been submitted
    if (touched[name] || isSubmitted) {
      setErrors(prev => ({
        ...prev,
        [name]: validateField(name, processedValue)
      }));
    }
  };

  // Handle field blur to mark as touched
  const handleBlur = (e) => {
    const { name } = e.target;
    
    // Mark the field as touched
    setTouched(prev => ({
      ...prev,
      [name]: true
    }));
    
    // Validate the field
    setErrors(prev => ({
      ...prev,
      [name]: validateField(name, formData[name])
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
                  maxLength={50}
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
                  maxLength={50}
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
                  maxLength={100}
                  className={`w-full p-2 pl-10 border ${shouldShowError('email') ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-primary`}
                  placeholder="Enter email address"
                />
              </div>
              {shouldShowError('email') && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
            </div>
            
            <div className="space-y-1">
              <label htmlFor="birthdate" className="block text-sm font-medium text-gray-700">
                Birthdate*
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
                  onBlur={handleBlur}
                  className={`w-full p-2 pl-10 border ${shouldShowError('birthdate') ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-primary`}
                />
              </div>
              {shouldShowError('birthdate') && <p className="text-red-500 text-xs mt-1">{errors.birthdate}</p>}
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
                  maxLength={50}
                  className={`w-full p-2 pl-10 border ${shouldShowError('password') ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-primary`}
                  placeholder={currentUser ? 'Enter new password' : 'Enter password'}
                />
              </div>
              {shouldShowError('password') && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
              
              {/* Password strength indicator (only show when password has content) */}
              {formData.password && (
                <div className="flex items-center gap-2 mt-1">
                  <div className="flex-1 h-1 bg-gray-200 rounded-full">
                    <div 
                      className="h-1 rounded-full transition-all duration-300"
                      style={{ 
                        width: `${(passwordStrength / 5) * 100}%`,
                        backgroundColor: getStrengthInfo(passwordStrength).color
                      }}
                    />
                  </div>
                  <span 
                    className="text-xs leading-none whitespace-nowrap"
                    style={{ color: getStrengthInfo(passwordStrength).color }}
                  >
                    {getStrengthInfo(passwordStrength).label}
                  </span>
                </div>
              )}
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

export default AdminUserFormModal;