import React, { useState, useEffect } from 'react';
import { User, DollarSign, Calendar, X, Hash, CreditCard } from 'lucide-react';

const AdminDonationFormModal = ({ isOpen, onClose, onSubmit, currentDonation = null, users = [] }) => {
  const [formData, setFormData] = useState({
    userId: '',
    amount: '',
    date: new Date().toISOString().split('T')[0],
    paymentMethod: 'cash',
    referenceNumber: ''
  });

  // Track which fields have been touched by the user
  const [touched, setTouched] = useState({
    userId: false,
    amount: false,
    date: false,
    paymentMethod: false,
    referenceNumber: false
  });

  // Track if form has been submitted
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Store validation errors
  const [errors, setErrors] = useState({});

  // Initialize form with current donation data if editing
  useEffect(() => {
    if (currentDonation) {
      setFormData({
        userId: currentDonation.userId || '',
        amount: currentDonation.amount || '',
        date: currentDonation.date ? new Date(currentDonation.date).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
        paymentMethod: currentDonation.paymentMethod || 'cash',
        referenceNumber: currentDonation.referenceNumber || ''
      });
    } else {
      // Reset form when adding new donation
      setFormData({
        userId: '',
        amount: '',
        date: new Date().toISOString().split('T')[0],
        paymentMethod: 'cash',
        referenceNumber: ''
      });
    }
    // Reset touched states and errors when modal opens/closes or changes between edit/create
    setTouched({
      userId: false,
      amount: false,
      date: false,
      paymentMethod: false,
      referenceNumber: false
    });
    setErrors({});
    setIsSubmitted(false);
  }, [currentDonation, isOpen]);

  // Validate a single field
  const validateField = (name, value) => {
    switch (name) {
      case 'userId':
        return value === '' ? 'Donor is required' : '';
      case 'amount':
        if (value.trim() === '') return 'Amount is required';
        if (isNaN(value) || parseFloat(value) <= 0) return 'Amount must be a positive number';
        return '';
      case 'date':
        return value.trim() === '' ? 'Date is required' : '';
      case 'paymentMethod':
        return value.trim() === '' ? 'Payment method is required' : '';
      case 'referenceNumber':
        if (formData.paymentMethod !== 'cash' && value.trim() === '') {
          return 'Reference number is required for electronic payments';
        }
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
    
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // If payment method changes, handle reference number validation
    if (name === 'paymentMethod') {
      if (value === 'cash') {
        setFormData(prev => ({
          ...prev,
          referenceNumber: '',
          [name]: value
        }));
      }
    }
    
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
      onSubmit(formData);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-xl font-semibold text-primary">
            {currentDonation ? 'Edit Donation' : 'Record New Donation'}
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
              <label htmlFor="userId" className="block text-sm font-medium text-gray-700">
                Donor*
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">
                  <User size={16} />
                </span>
                <select
                  id="userId"
                  name="userId"
                  value={formData.userId}
                  onChange={handleInputChange}
                  onBlur={handleBlur}
                  className={`w-full p-2 pl-10 border ${shouldShowError('userId') ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-primary`}
                >
                  <option value="">Select a donor</option>
                  {users.map(user => (
                    <option key={user.id} value={user.id}>
                      {user.firstName} {user.lastName}
                    </option>
                  ))}
                </select>
              </div>
              {shouldShowError('userId') && <p className="text-red-500 text-xs mt-1">{errors.userId}</p>}
            </div>
            
            <div className="space-y-1">
              <label htmlFor="amount" className="block text-sm font-medium text-gray-700">
                Amount*
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">
                  <DollarSign size={16} />
                </span>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  id="amount"
                  name="amount"
                  value={formData.amount}
                  onChange={handleInputChange}
                  onBlur={handleBlur}
                  className={`w-full p-2 pl-10 border ${shouldShowError('amount') ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-primary`}
                  placeholder="Enter donation amount"
                />
              </div>
              {shouldShowError('amount') && <p className="text-red-500 text-xs mt-1">{errors.amount}</p>}
            </div>
            
            <div className="space-y-1">
              <label htmlFor="date" className="block text-sm font-medium text-gray-700">
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
                  className={`w-full p-2 pl-10 border ${shouldShowError('date') ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-primary`}
                />
              </div>
              {shouldShowError('date') && <p className="text-red-500 text-xs mt-1">{errors.date}</p>}
            </div>
            
            <div className="space-y-1">
              <label htmlFor="paymentMethod" className="block text-sm font-medium text-gray-700">
                Payment Method*
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">
                  <CreditCard size={16} />
                </span>
                <select
                  id="paymentMethod"
                  name="paymentMethod"
                  value={formData.paymentMethod}
                  onChange={handleInputChange}
                  onBlur={handleBlur}
                  className={`w-full p-2 pl-10 border ${shouldShowError('paymentMethod') ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-primary`}
                >
                  <option value="cash">Cash</option>
                  <option value="gcash">GCash</option>
                  <option value="maya">Maya</option>
                  <option value="bank_transfer">Bank Transfer</option>
                </select>
              </div>
              {shouldShowError('paymentMethod') && <p className="text-red-500 text-xs mt-1">{errors.paymentMethod}</p>}
            </div>
            
            {formData.paymentMethod !== 'cash' && (
              <div className="space-y-1 md:col-span-2">
                <label htmlFor="referenceNumber" className="block text-sm font-medium text-gray-700">
                  Reference Number*
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">
                    <Hash size={16} />
                  </span>
                  <input
                    type="text"
                    id="referenceNumber"
                    name="referenceNumber"
                    value={formData.referenceNumber}
                    onChange={handleInputChange}
                    onBlur={handleBlur}
                    className={`w-full p-2 pl-10 border ${shouldShowError('referenceNumber') ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-primary`}
                    placeholder="Enter payment reference number"
                  />
                </div>
                {shouldShowError('referenceNumber') && <p className="text-red-500 text-xs mt-1">{errors.referenceNumber}</p>}
              </div>
            )}
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
              {currentDonation ? 'Update Donation' : 'Record Donation'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminDonationFormModal;