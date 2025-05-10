import React, { useState, useEffect } from 'react';
import { PenSquare, Save, X } from 'lucide-react';

const PersonalDetailsTab = ({
  formData,
  errors,
  handleChange,
  handleSaveChanges
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [localFormData, setLocalFormData] = useState({ ...formData });
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    setLocalFormData({ ...formData });
  }, [formData]);

  const toggleEdit = () => {
    if (isEditing) {
      // Cancel changes
      setLocalFormData({ ...formData });
      setHasChanges(false);
    }
    setIsEditing(!isEditing);
  };

  const handleLocalChange = (e) => {
    const { name, value } = e.target;
    setLocalFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setHasChanges(true);
  };

  const handleSave = () => {
    if (!hasChanges) return;
    
    // Pass changes up to parent component
    const updatedFormData = { ...localFormData };
    handleSaveChanges(updatedFormData);
    setIsEditing(false);
    setHasChanges(false);
  };

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-medium">Personal Details</h3>
        <div className="flex gap-2">
          {isEditing ? (
            <>
              <button
                onClick={toggleEdit}
                className="p-2 text-white bg-red-500 rounded-full hover:bg-red-600"
                title="Cancel"
              >
                <X size={18} />
              </button>
              <button
                onClick={handleSave}
                className="p-2 text-white bg-blue-500 rounded-full hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={!hasChanges}
                title="Save"
              >
                <Save size={18} />
              </button>
            </>
          ) : (
            <button
              onClick={toggleEdit}
              className="p-2 text-white bg-primary rounded-full hover:bg-accent"
              title="Edit"
            >
              <PenSquare size={18} />
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
          <input
            type="text"
            name="firstName"
            value={localFormData.firstName}
            onChange={handleLocalChange}
            className={`w-full p-2 border ${
              errors.firstName ? 'border-red-500' : 'border-gray-300'
            } rounded-md focus:outline-none focus:ring-2 focus:ring-primary ${
              !isEditing ? 'bg-gray-100' : ''
            }`}
            disabled={!isEditing}
          />
          {errors.firstName && (
            <p className="text-red-500 text-xs mt-1">{errors.firstName}</p>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
          <input
            type="text"
            name="lastName"
            value={localFormData.lastName}
            onChange={handleLocalChange}
            className={`w-full p-2 border ${
              errors.lastName ? 'border-red-500' : 'border-gray-300'
            } rounded-md focus:outline-none focus:ring-2 focus:ring-primary ${
              !isEditing ? 'bg-gray-100' : ''
            }`}
            disabled={!isEditing}
          />
          {errors.lastName && (
            <p className="text-red-500 text-xs mt-1">{errors.lastName}</p>
          )}
        </div>
      </div>
      
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
        <input
          type="email"
          name="email"
          value={localFormData.email}
          onChange={handleLocalChange}
          className={`w-full p-2 border ${
            errors.email ? 'border-red-500' : 'border-gray-300'
          } rounded-md focus:outline-none focus:ring-2 focus:ring-primary ${
            !isEditing ? 'bg-gray-100' : ''
          }`}
          disabled={!isEditing}
        />
        {errors.email && (
          <p className="text-red-500 text-xs mt-1">{errors.email}</p>
        )}
      </div>
      
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">Birthdate</label>
        <input
          type="date"
          name="birthdate"
          value={localFormData.birthdate}
          onChange={handleLocalChange}
          className={`w-full p-2 border ${
            errors.birthdate ? 'border-red-500' : 'border-gray-300'
          } rounded-md focus:outline-none focus:ring-2 focus:ring-primary ${
            !isEditing ? 'bg-gray-100' : ''
          }`}
          disabled={!isEditing}
        />
        {errors.birthdate && (
          <p className="text-red-500 text-xs mt-1">{errors.birthdate}</p>
        )}
      </div>
    </div>
  );
};

export default PersonalDetailsTab;