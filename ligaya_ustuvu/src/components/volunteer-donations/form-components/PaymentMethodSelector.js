import React from 'react';

const PaymentMethodSelector = ({ value, onChange }) => {
  const paymentMethods = [
    { id: 'cash', label: 'Cash' },
    { id: 'gcash', label: 'GCash' },
    { id: 'maya', label: 'Maya' },
    { id: 'bank_transfer', label: 'Bank Transfer' },
  ];

  const handleChange = (e) => {
    onChange(e.target.value);
  };

  return (
    <div className="form-control w-full">
      <label className="label">
        <span className="label-text font-medium">Payment Method</span>
        <span className="label-text-alt text-red-500">*</span>
      </label>
      
      <div className="grid grid-cols-2 gap-3">
        {paymentMethods.map((method) => (
          <label 
            key={method.id}
            className={`flex items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50 transition-colors ${
              value === method.id ? 'border-primary bg-primary bg-opacity-10' : 'border-gray-300'
            }`}
          >
            <input
              type="radio"
              name="paymentMethod"
              value={method.id}
              checked={value === method.id}
              onChange={handleChange}
              className="radio radio-primary hidden"
            />
            <div className="flex flex-col">
              <span className="text-sm font-medium">{method.label}</span>
            </div>
            {value === method.id && (
              <svg className="ml-auto h-5 w-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            )}
          </label>
        ))}
      </div>
    </div>
  );
};

export default PaymentMethodSelector;