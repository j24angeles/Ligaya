// src/components/user-donation/DonationForm.js
import React, { useState } from 'react';
import { createDonation } from '../../api/donationService';
import AmountInput from '../../components/volunteer-donations/form-components/AmountInput';
import DateInput from '../../components/volunteer-donations/form-components/DateInput';
import PaymentMethodSelect from '../../components/volunteer-donations/form-components/PaymentMethodSelector';
import ReferenceNumberInput from '../../components/volunteer-donations/form-components/ReferenceNumberInput';

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

  const handleChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear error when field changes
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    setSubmitError('');
    
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
    } catch (error) {
      setSubmitError(error.message || 'Failed to submit donation. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <AmountInput
        value={formData.amount}
        onChange={(value) => handleChange('amount', value)}
        error={errors.amount}
      />
      
      <DateInput
        value={formData.date}
        onChange={(value) => handleChange('date', value)}
        error={errors.date}
      />
      
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
      />
      
      {submitError && (
        <div className="mb-4 text-red-500 text-sm">{submitError}</div>
      )}
      
      <button
        type="submit"
        disabled={isSubmitting}
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline disabled:opacity-50"
      >
        {isSubmitting ? 'Submitting...' : 'Submit Donation'}
      </button>
    </form>
  );
};

export default DonationForm;