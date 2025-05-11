// src/components/user-donation/AmountInput.js
import React from 'react';

const AmountInput = ({ value, onChange, error }) => {
  return (
    <div className="mb-4">
      <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="amount">
        Amount (₱)
      </label>
      <input
        type="number"
        id="amount"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${error ? 'border-red-500' : ''}`}
        placeholder="0.00"
        min="1"
        step="0.01"
        required
      />
      {error && <p className="text-red-500 text-xs italic">{error}</p>}
    </div>
  );
};

export default AmountInput;