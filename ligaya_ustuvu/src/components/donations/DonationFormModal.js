import React, { useState, useEffect } from 'react';
import { Search, DollarSign, Calendar, CreditCard, Image, Check, X } from 'lucide-react';

const DonationFormModal = ({ isOpen, onClose, onSubmit, currentDonation = null, volunteers = [] }) => {
  const [formData, setFormData] = useState({
    volunteerId: '',
    amount: '',
    date: new Date().toISOString().split('T')[0],
    paymentMethod: 'GCash',
    receiptImage: '',
    status: 'Pending'
  });

  const [searchTerm, setSearchTerm] = useState('');
  const [showVolunteerDropdown, setShowVolunteerDropdown] = useState(false);
  const [filteredVolunteers, setFilteredVolunteers] = useState([]);
  const [touched, setTouched] = useState({
    volunteerId: false,
    amount: false,
    date: false
  });
  const [errors, setErrors] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [selectedVolunteerName, setSelectedVolunteerName] = useState('');

  // Initialize form with current donation data if editing
  useEffect(() => {
    if (currentDonation) {
      setFormData({
        volunteerId: currentDonation.volunteerId || '',
        amount: currentDonation.amount || '',
        date: currentDonation.date || new Date().toISOString().split('T')[0],
        paymentMethod: currentDonation.paymentMethod || 'GCash',
        receiptImage: currentDonation.receiptImage || '',
        status: currentDonation.status || 'Pending'
      });
      
      // Find the volunteer name if we have a volunteerId
      if (currentDonation.volunteerId && volunteers.length > 0) {
        const volunteer = volunteers.find(v => v.id === currentDonation.volunteerId);
        if (volunteer) {
          setSelectedVolunteerName(`${volunteer.firstName} ${volunteer.lastName}`);
          setSearchTerm(`${volunteer.firstName} ${volunteer.lastName}`);
        }
      }
    } else {
      setFormData({
        volunteerId: '',
        amount: '',
        date: new Date().toISOString().split('T')[0],
        paymentMethod: 'GCash',
        receiptImage: '',
        status: 'Pending'
      });
      setSelectedVolunteerName('');
      setSearchTerm('');
    }
    
    setTouched({
      volunteerId: false,
      amount: false,
      date: false
    });
    setErrors({});
    setIsSubmitted(false);
  }, [currentDonation, isOpen, volunteers]);

  // Filter volunteers based on search term
  useEffect(() => {
    if (!Array.isArray(volunteers) || volunteers.length === 0) {
      setFilteredVolunteers([]);
      return;
    }

    if (searchTerm.trim() === '') {
      setFilteredVolunteers(volunteers.slice(0, 5));
    } else {
      const filtered = volunteers.filter(volunteer => {
        const fullName = `${volunteer.firstName} ${volunteer.lastName}`.toLowerCase();
        const email = volunteer.email.toLowerCase();
        return fullName.includes(searchTerm.toLowerCase()) || email.includes(searchTerm.toLowerCase());
      }).slice(0, 5);
      setFilteredVolunteers(filtered);
    }
  }, [searchTerm, volunteers]);

  // Validate a single field
  const validateField = (name, value) => {
    switch (name) {
      case 'volunteerId':
        return value === '' ? 'Volunteer is required' : '';
      case 'amount':
        if (value === '') return 'Amount is required';
        if (isNaN(value)) return 'Amount must be a number';
        if (parseFloat(value) <= 0) return 'Amount must be positive';
        return '';
      case 'date':
        return value === '' ? 'Date is required' : '';
      default:
        return '';
    }
  };

  // Validate all fields
  const validateForm = () => {
    const newErrors = {};
    let isValid = true;
    
    Object.entries(formData).forEach(([key, value]) => {
      if (['volunteerId', 'amount', 'date'].includes(key)) {
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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    if (touched[name] || isSubmitted) {
      setErrors(prev => ({
        ...prev,
        [name]: validateField(name, value)
      }));
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    
    setTouched(prev => ({
      ...prev,
      [name]: true
    }));
    
    setErrors(prev => ({
      ...prev,
      [name]: validateField(name, value)
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({
          ...prev,
          receiptImage: reader.result
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const selectVolunteer = (volunteer) => {
    setFormData(prev => ({
      ...prev,
      volunteerId: volunteer.id
    }));
    setSelectedVolunteerName(`${volunteer.firstName} ${volunteer.lastName}`);
    setSearchTerm(`${volunteer.firstName} ${volunteer.lastName}`);
    setShowVolunteerDropdown(false);
    setErrors(prev => ({
      ...prev,
      volunteerId: ''
    }));
  };

  const shouldShowError = (fieldName) => {
    return (touched[fieldName] || isSubmitted) && errors[fieldName];
  };

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
            {currentDonation ? 'Edit Donation' : 'Add New Donation'}
          </h2>
          <button
            onClick={onClose}
            className="p-1 rounded-full hover:bg-gray-200 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <div className="grid grid-cols-1 gap-4">
            {/* Volunteer Search */}
            <div className="space-y-1">
              <label htmlFor="volunteerSearch" className="block text-sm font-medium text-gray-700">
                Volunteer*
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">
                  <Search size={16} />
                </span>
                <input
                  type="text"
                  id="volunteerSearch"
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setShowVolunteerDropdown(true);
                  }}
                  onFocus={() => setShowVolunteerDropdown(true)}
                  onBlur={() => setTimeout(() => setShowVolunteerDropdown(false), 200)}
                  className={`w-full p-2 pl-10 border ${shouldShowError('volunteerId') ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-primary`}
                  placeholder="Search volunteer by name or email"
                />
                {showVolunteerDropdown && filteredVolunteers.length > 0 && (
                  <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto">
                    {filteredVolunteers.map(volunteer => (
                      <div
                        key={volunteer.id}
                        className="p-2 hover:bg-gray-100 cursor-pointer"
                        onClick={() => selectVolunteer(volunteer)}
                      >
                        <div className="font-medium">{`${volunteer.firstName} ${volunteer.lastName}`}</div>
                        <div className="text-sm text-gray-500">{volunteer.email}</div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              {shouldShowError('volunteerId') && (
                <p className="text-red-500 text-xs mt-1">{errors.volunteerId}</p>
              )}
              {formData.volunteerId && !errors.volunteerId && (
                <p className="text-green-600 text-xs mt-1">Volunteer selected: {selectedVolunteerName}</p>
              )}
            </div>

            {/* Amount */}
            <div className="space-y-1">
              <label htmlFor="amount" className="block text-sm font-medium text-gray-700">
                Amount (₱)*
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">
                  <DollarSign size={16} />
                </span>
                <input
                  type="text"
                  id="amount"
                  name="amount"
                  value={formData.amount}
                  onChange={handleInputChange}
                  onBlur={handleBlur}
                  className={`w-full p-2 pl-10 border ${shouldShowError('amount') ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-primary`}
                  placeholder="Enter amount in pesos"
                />
              </div>
              {shouldShowError('amount') && (
                <p className="text-red-500 text-xs mt-1">{errors.amount}</p>
              )}
            </div>

            {/* Date */}
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
              {shouldShowError('date') && (
                <p className="text-red-500 text-xs mt-1">{errors.date}</p>
              )}
            </div>

            {/* Payment Method */}
            <div className="space-y-1">
              <label htmlFor="paymentMethod" className="block text-sm font-medium text-gray-700">
                Payment Method
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
                  className="w-full p-2 pl-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="GCash">GCash</option>
                  <option value="Maya">Maya</option>
                  <option value="Bank Transfer">Bank Transfer</option>
                </select>
              </div>
            </div>

            {/* Status */}
            <div className="space-y-1">
              <label htmlFor="status" className="block text-sm font-medium text-gray-700">
                Status
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">
                  <Check size={16} />
                </span>
                <select
                  id="status"
                  name="status"
                  value={formData.status}
                  onChange={handleInputChange}
                  className="w-full p-2 pl-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="Pending">Pending</option>
                  <option value="Verified">Verified</option>
                </select>
              </div>
            </div>

            {/* Receipt Image */}
            <div className="space-y-1">
              <label htmlFor="receiptImage" className="block text-sm font-medium text-gray-700">
                Proof of Receipt
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">
                  <Image size={16} />
                </span>
                <input
                  type="file"
                  id="receiptImage"
                  name="receiptImage"
                  onChange={handleFileChange}
                  accept="image/*"
                  className="w-full p-2 pl-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary file:mr-4 file:py-1 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20"
                />
              </div>
              {formData.receiptImage && (
                <div className="mt-2">
                  <p className="text-sm text-gray-500">Image preview:</p>
                  <img 
                    src={formData.receiptImage} 
                    alt="Receipt preview" 
                    className="mt-1 max-w-xs max-h-32 object-contain border border-gray-300 rounded"
                  />
                </div>
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
              {currentDonation ? 'Update Donation' : 'Add Donation'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default DonationFormModal;