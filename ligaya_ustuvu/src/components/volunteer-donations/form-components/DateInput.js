import React from 'react';

const DateInput = ({ value, onChange, error }) => {
  return (
    <div className="mb-0">
      <label className="block text-gray-700 text-xs font-medium mb-1" htmlFor="date">
        Date <span className="text-red-500">*</span>
      </label>
      <input
        type="date"
        id="date"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`block w-full rounded border text-sm px-3 py-1.5 text-gray-900 border-gray-300 focus:outline-none focus:ring-1 ${
          error ? 'focus:ring-red-500 border-red-300' : 'focus:ring-blue-500'
        }`}
        max={new Date().toISOString().split('T')[0]} // Can't select future dates
        required
      />
      {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
    </div>
  );
};

export default DateInput;
