import React from 'react';

const ReferenceNumberInput = ({ value, onChange }) => {
  const handleChange = (e) => {
    onChange(e.target.value);
  };

  return (
    <div className="form-control w-full">
      <label className="label">
        <span className="label-text font-medium">Reference Number</span>
        <span className="label-text-alt text-red-500">*</span>
      </label>
      <input
        type="text"
        placeholder="Enter transaction reference number"
        className="input input-bordered w-full"
        value={value}
        onChange={handleChange}
        required
      />
      <label className="label">
        <span className="label-text-alt text-gray-500">
          Please enter the reference/transaction number from your payment receipt
        </span>
      </label>
    </div>
  );
};

export default ReferenceNumberInput;