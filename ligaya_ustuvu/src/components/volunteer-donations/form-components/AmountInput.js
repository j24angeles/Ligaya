import React from 'react';

const AmountInput = ({ value, onChange, error }) => {
  return (
    <div className="mb-0">
      <label className="block text-gray-700 text-xs font-medium mb-1" htmlFor="amount">
        Amount (₱)
      </label>
      <div className="relative">
        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-2">
          <span className="text-gray-500 text-sm">₱</span>
        </div>
        <input
          type="number"
          id="amount"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={`block w-full rounded border border-gray-300 text-sm pl-6 pr-2 py-1.5 text-gray-900 focus:outline-none focus:ring-1 ${
            error ? 'focus:ring-red-500 border-red-300 placeholder:text-red-400' : 'focus:ring-blue-500 placeholder:text-gray-400'
          }`}
          placeholder="0.00"
          min="1"
          step="0.01"
          required
        />
      </div>
      {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
    </div>
  );
};

export default AmountInput;
