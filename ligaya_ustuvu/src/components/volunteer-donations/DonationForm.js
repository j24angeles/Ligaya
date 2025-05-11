import React, { useState } from 'react';
import AmountInput from './form-components/AmountInput';
import DateInput from './form-components/DateInput';
import PaymentMethodSelector from './form-components/PaymentMethodSelector';
import ReferenceNumberInput from './form-components/ReferenceNumberInput';
import { createDonation } from '../../api/donationService';
import { useAuth } from '../../context/AuthContext';

const DonationForm = ({ onSuccess }) => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  
  const [formData, setFormData] = useState({
    amount: '',
    date: new Date().toISOString().split('T')[0], // Today's date as default
    paymentMethod: 'cash',
    referenceNumber: '',
  });

  const handleChange = (name, value) => {
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.amount || !formData.date || !formData.paymentMethod) {
      setError('Please fill in all required fields.');
      return;
    }

    if (formData.paymentMethod !== 'cash' && !formData.referenceNumber) {
      setError('Reference number is required for the selected payment method.');
      return;
    }

    try {
      setLoading(true);
      setError('');
      
      await createDonation({
        userId: user.id.toString(),
        ...formData,
      });
      
      setSuccess(true);
      setFormData({
        amount: '',
        date: new Date().toISOString().split('T')[0],
        paymentMethod: 'cash',
        referenceNumber: '',
      });
      
      if (onSuccess) {
        onSuccess();
      }
      
      // Reset success message after 3 seconds
      setTimeout(() => {
        setSuccess(false);
      }, 3000);
      
    } catch (err) {
      setError(err.message || 'An error occurred while processing your donation.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto">
      <h2 className="text-xl font-semibold text-primary mb-6 text-center">Make a Donation</h2>
      
      {success && (
        <div className="alert alert-success mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>Thank you! Your donation has been submitted successfully.</span>
        </div>
      )}
      
      {error && (
        <div className="alert alert-error mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>{error}</span>
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <AmountInput 
          value={formData.amount} 
          onChange={(value) => handleChange('amount', value)} 
        />
        
        <DateInput 
          value={formData.date} 
          onChange={(value) => handleChange('date', value)} 
        />
        
        <PaymentMethodSelector 
          value={formData.paymentMethod} 
          onChange={(value) => handleChange('paymentMethod', value)} 
        />
        
        {formData.paymentMethod !== 'cash' && (
          <ReferenceNumberInput 
            value={formData.referenceNumber} 
            onChange={(value) => handleChange('referenceNumber', value)} 
          />
        )}
        
        <div className="flex justify-center mt-6">
          <button 
            type="submit" 
            className="btn btn-primary w-full max-w-xs"
            disabled={loading}
          >
            {loading ? (
              <>
                <span className="loading loading-spinner"></span>
                Processing...
              </>
            ) : (
              'Submit Donation'
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default DonationForm;