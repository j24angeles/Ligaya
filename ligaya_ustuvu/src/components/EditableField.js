import React from 'react';

const EditableField = ({ 
  label, 
  name, 
  value, 
  onChange, 
  error, 
  isEditing, 
  toggleEdit,
  type = 'text' 
}) => {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      <div className="relative">
        <input
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          className={`w-full p-2 border ${
            error ? 'border-red-500' : 'border-gray-300'
          } rounded-md focus:outline-none focus:ring-2 focus:ring-primary`}
          disabled={!isEditing}
        />
        <button
          onClick={toggleEdit}
          className="absolute right-2 top-2 text-primary"
        >
          {isEditing ? 'Save' : 'Edit'}
        </button>
      </div>
      {error && (
        <p className="text-red-500 text-xs mt-1">{error}</p>
      )}
    </div>
  );
};

export default EditableField;