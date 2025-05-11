// src/components/user-donation/ReferenceNumberInput.js
import React from 'react';

const ReferenceNumberInput = ({ value, onChange, error, show }) => {
  if (!show) return null;

  return (
    <div className="mb-4">
      <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="referenceNumber">
        Reference Number
      </label>
      <input
        type="text"
        id="referenceNumber"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${error ? 'border-red-500' : ''}`}
        placeholder="Enter reference number"
        required
      />
      {error && <p className="text-red-500 text-xs italic">{error}</p>}
    </div>
  );
};

export default ReferenceNumberInput;