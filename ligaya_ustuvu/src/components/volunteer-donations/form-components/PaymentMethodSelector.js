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
    <div className="mb-4">
      <label className="block text-gray-700 text-xs font-medium mb-1">
        Payment Method <span className="text-red-500">*</span>
      </label>
      <div className="grid grid-cols-2 gap-2">
        {paymentMethods.map((method) => (
          <label
            key={method.id}
            className={`flex items-center justify-between px-3 py-2 border rounded-md text-sm cursor-pointer transition-colors ${
              value === method.id
                ? 'border-blue-500 bg-blue-50 text-blue-700'
                : 'border-gray-300 hover:bg-gray-50'
            }`}
          >
            <span>{method.label}</span>
            <input
              type="radio"
              name="paymentMethod"
              value={method.id}
              checked={value === method.id}
              onChange={handleChange}
              className="hidden"
            />
            {value === method.id && (
              <svg className="h-4 w-4 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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
