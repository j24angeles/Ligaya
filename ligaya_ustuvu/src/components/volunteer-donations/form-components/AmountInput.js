import React from 'react';

const AmountInput = ({ value, onChange }) => {
  const handleChange = (e) => {
    // Allow only numbers
    const amount = e.target.value.replace(/[^0-9]/g, '');
    onChange(amount);
  };

  return (
    <div className="form-control w-full">
      <label className="label">
        <span className="label-text font-medium">Amount (PHP)</span>
        <span className="label-text-alt text-red-500">*</span>
      </label>
      <div className="relative">
        <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">₱</span>
        <input
          type="text"
          placeholder="Enter donation amount"
          className="input input-bordered w-full pl-8"
          value={value}
          onChange={handleChange}
          required
        />
      </div>
    </div>
  );
};

export default AmountInput;