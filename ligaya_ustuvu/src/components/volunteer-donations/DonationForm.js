// src/components/volunteer-donations/DonationForm.js
import React, { useState } from 'react';
import { createDonation } from '../../api/donationService';
import AmountInput from './form-components/AmountInput';
import DateInput from './form-components/DateInput';
import PaymentMethodSelect from './form-components/PaymentMethodSelector';
import ReferenceNumberInput from './form-components/ReferenceNumberInput';
import ConfirmationModal from '../ConfirmationModal';
import { useToast } from '../../hooks/ToastProvider';

const DonationForm = ({ userId, onSuccess }) => {
  const [formData, setFormData] = useState({
    amount: '',
    date: new Date().toISOString().split('T')[0],
    paymentMethod: '',
    referenceNumber: '',
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [showConfirmation, setShowConfirmation] = useState(false);
  const { showSuccess, showError } = useToast();

  const handleChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.amount || parseFloat(formData.amount) <= 0) {
      newErrors.amount = 'Please enter a valid amount';
    }
    
    if (!formData.date) {
      newErrors.date = 'Please select a date';
    }
    
    if (!formData.paymentMethod) {
      newErrors.paymentMethod = 'Please select a payment method';
    }
    
    if (formData.paymentMethod !== 'cash' && !formData.referenceNumber) {
      newErrors.referenceNumber = 'Reference number is required for this payment method';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => { 
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setShowConfirmation(true);
  };

const formatPaymentMethod = (method) => {
  return method
    .replace(/_/g, ' ')      
    .replace(/\b\w/g, c => c.toUpperCase());
};

  const confirmDonation = async () => {
    setIsSubmitting(true);
    setSubmitError('');
    setShowConfirmation(false);
    
    try {
      const donationData = {
        userId,
        amount: formData.amount,
        date: formData.date,
        paymentMethod: formData.paymentMethod,
        referenceNumber: formData.paymentMethod === 'cash' ? '' : formData.referenceNumber,
      };
      
      const createdDonation = await createDonation(donationData);
      onSuccess(createdDonation);
      
      // Reset form
      setFormData({
        amount: '',
        date: new Date().toISOString().split('T')[0],
        paymentMethod: '',
        referenceNumber: '',
      });
      
      showSuccess('Donation submitted successfully!');
    } catch (error) {
      const errorMsg = error.message || 'Failed to submit donation. Please try again.';
      setSubmitError(errorMsg);
      showError(errorMsg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Banner Image */}
     <div className="rounded-t-lg overflow-hidden -mx-6 -mt-6 mb-6">
  <img 
    src="../assets/donate_banner.jpg" 
    alt="Ligaya"
    className="w-full h-40 object-cover" 
  />
      </div>

      {/* Form Content */}
      <div className="px-6 pb-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex flex-col md:flex-row gap-3">
            <div className="flex-1">
              <AmountInput
                value={formData.amount}
                onChange={(value) => handleChange('amount', value)}
                error={errors.amount}
              />
            </div>
            <div className="flex-1">
              <DateInput
                value={formData.date}
                onChange={(value) => handleChange('date', value)}
                error={errors.date}
              />
            </div>
          </div>

          <PaymentMethodSelect
            value={formData.paymentMethod}
            onChange={(value) => handleChange('paymentMethod', value)}
            error={errors.paymentMethod}
          />
          
          <ReferenceNumberInput
            value={formData.referenceNumber}
            onChange={(value) => handleChange('referenceNumber', value)}
            error={errors.referenceNumber}
            show={formData.paymentMethod && formData.paymentMethod !== 'cash'}
            className="mb-2"
          />

          {submitError && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-md text-red-500 text-sm mb-2">
              {submitError}
            </div>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-primary text-white font-medium text-sm py-2 px-4 rounded-md shadow-sm transition-colors focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 hover:bg-accent-dark disabled:opacity-60 mt-1"
          >
            {isSubmitting ? 'Processing...' : 'Submit'}
          </button>
        </form>
      </div>

      {/* Confirmation Modal */}
      <ConfirmationModal
        show={showConfirmation}
        onClose={() => setShowConfirmation(false)}
        onConfirm={confirmDonation}
        title="Confirm Donation"
message={`Are you sure you want to submit a donation of ₱${formData.amount} via ${formatPaymentMethod(formData.paymentMethod)}?`}
        type="info"
        confirmText="Confirm Donation"
        cancelText="Cancel"
      />
    </div>
  );
};

export default DonationForm;