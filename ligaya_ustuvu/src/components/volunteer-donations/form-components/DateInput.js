import React from 'react';

const DateInput = ({ value, onChange }) => {
  const handleChange = (e) => {
    onChange(e.target.value);
  };

  return (
    <div className="form-control w-full">
      <label className="label">
        <span className="label-text font-medium">Date</span>
        <span className="label-text-alt text-red-500">*</span>
      </label>
      <input
        type="date"
        className="input input-bordered w-full"
        value={value}
        onChange={handleChange}
        max={new Date().toISOString().split('T')[0]} // Can't select future dates
        required
      />
    </div>
  );
};

export default DateInput;