import React from 'react';

const ReferenceNumberInput = ({ value, onChange, error, show }) => {
  if (!show) return null;

  return (
    <div className="mb-3">
      <label className="block text-gray-700 text-sm font-medium mb-1" htmlFor="referenceNumber">
        Reference Number
      </label>
      <input
        type="text"
        id="referenceNumber"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`block w-full rounded border text-sm px-3 py-1.5 text-gray-900 border-gray-300 focus:outline-none focus:ring-1 ${
          error ? 'focus:ring-red-500 border-red-300' : 'focus:ring-blue-500'
        }`}
        placeholder="Enter reference number"
        required
      />
      {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
    </div>
  );
};

export default ReferenceNumberInput;
