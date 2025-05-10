import React from 'react';

const SecurityTab = ({
  formData,
  errors,
  editingField,
  currentPassword,
  currentPasswordError,
  passwordStrength,
  lastPasswordChange,
  handleChange,
  toggleEditField,
  handleSaveChanges,
  setCurrentPassword,
  setCurrentPasswordError
}) => {
  return (
    <div className="p-4">
      <div className="bg-white rounded-lg">
        <h3 className="text-md font-medium mb-3">Password Management</h3>

        {editingField === 'password' ? (
          <div className="bg-gray-50 rounded-lg p-4 mb-4">
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Current Password</label>
              <div className="relative">
                <input
                  type="password"
                  value={currentPassword}
                  onChange={(e) => {
                    setCurrentPassword(e.target.value);
                    setCurrentPasswordError('');
                  }}
                  className={`w-full p-2 border ${
                    currentPasswordError ? 'border-red-500' : 'border-gray-300'
                  } rounded-md focus:outline-none focus:ring-2 focus:ring-primary`}
                />
              </div>
              {currentPasswordError && (
                <p className="text-red-500 text-xs mt-1">{currentPasswordError}</p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
                <div className="relative">
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className={`w-full p-2 border ${
                      errors.password ? 'border-red-500' : 'border-gray-300'
                    } rounded-md focus:outline-none focus:ring-2 focus:ring-primary`}
                  />
                </div>
                {errors.password && (
                  <p className="text-red-500 text-xs mt-1">{errors.password}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Confirm New Password</label>
                <div className="relative">
                  <input
                    type="password"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className={`w-full p-2 border ${
                      errors.confirmPassword ? 'border-red-500' : 'border-gray-300'
                    } rounded-md focus:outline-none focus:ring-2 focus:ring-primary`}
                  />
                </div>
                {errors.confirmPassword && (
                  <p className="text-red-500 text-xs mt-1">{errors.confirmPassword}</p>
                )}
              </div>
            </div>

            <div className="flex justify-end mt-3">
              <button
                onClick={() => toggleEditField(null)}
                className="px-3 py-1 mr-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveChanges}
                className="px-3 py-1 bg-primary text-white rounded-md hover:bg-accent"
              >
                Update Password
              </button>
            </div>
          </div>
        ) : (
          <div className="bg-gray-50 rounded-lg p-4 mb-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium">Password</h4>
                <p className="text-sm text-gray-500">Update your password regularly for security</p>
              </div>
              <button
                onClick={() => toggleEditField('password')}
                className="px-3 py-1 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                Change Password
              </button>
            </div>
          </div>
        )}

        <div className="bg-gray-50 rounded-lg p-4">
          <h4 className="font-medium mb-3">Account Security Status</h4>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm">Password strength</span>
              <span className={`text-sm font-medium ${
                passwordStrength === 'Strong' ? 'text-green-600' : 
                passwordStrength === 'Medium' ? 'text-yellow-600' : 'text-red-600'
              }`}>{passwordStrength}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Last password change</span>
              <span className="text-sm text-gray-600">{lastPasswordChange}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SecurityTab;