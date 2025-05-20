// AdminSettingsComponent.js
import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../hooks/ToastProvider';
import { updateUser } from '../api/userService';

const AdminSettingsComponent = () => {
  const { user, updateUser: updateAuthUser } = useAuth();
  const { showSuccess, showError } = useToast();
  const [userProfile, setUserProfile] = useState({
    firstName: '',
    lastName: '',
    email: '',
    birthdate: ''
  });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [isEditingPassword, setIsEditingPassword] = useState(false);

  useEffect(() => {
    if (user) {
      setUserProfile({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        email: user.email || '',
        birthdate: user.birthdate || ''
      });
    }
  }, [user]);

  const handlePasswordChange = (field, value) => {
    setPasswordData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handlePasswordUpdate = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      showError('New passwords do not match');
      return;
    }
    if (passwordData.newPassword.length < 6) {
      showError('Password must be at least 6 characters');
      return;
    }
    
    setLoading(true);
    
    try {
      const updatedUser = await updateUser(user.id, { 
        password: passwordData.newPassword,
        lastPasswordChange: new Date().toISOString()
      });
      
      // Update the auth context with new user data
      updateAuthUser(updatedUser);
      
      // Show success toast
      showSuccess('Password updated successfully!');
      
      // Reset form
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
      setIsEditingPassword(false);
    } catch (err) {
      console.error('Error updating password:', err);
      showError(err.message || 'Failed to update password');
    } finally {
      setLoading(false);
    }
  };

  const formatDisplayDate = (dateString) => {
    if (!dateString) return 'Never';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  // Icons
  const EditIcon = () => (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
    </svg>
  );

  const SaveIcon = () => (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
    </svg>
  );

  const CancelIcon = () => (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
    </svg>
  );

  const EyeIcon = () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
    </svg>
  );

  const EyeOffIcon = () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
    </svg>
  );

  const AdminBadge = () => (
    <div className="flex items-center bg-secondary text-primary px-3 py-1 rounded-full text-sm font-semibold shadow-sm">
      <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-6-3a2 2 0 11-4 0 2 2 0 014 0zm-2 4a5 5 0 00-4.546 2.916A5.986 5.986 0 005 10a1 1 0 10-2 0c0 .53.084 1.027.228 1.506A7.001 7.001 0 0110 18a7.001 7.001 0 006.772-5.494A7.01 7.01 0 0017 10a1 1 0 10-2 0 5 5 0 00-.454 2.08A5 5 0 0010 11z" clipRule="evenodd" />
      </svg>
      Admin
    </div>
  );

  return (
    <div className="p-6 max-w-7xl mx-auto transition-all duration-300 font-poppins">
      {/* Header with Role Badge */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center">
          <h1 className="text-3xl font-bold text-primary mr-4">Admin Settings</h1>
          <AdminBadge />
        </div>
      </div>

      {/* Content Panel */}
      <div className="rounded-lg border border-gray-200 bg-white shadow-lg overflow-hidden">
        <div className="bg-primary text-white py-4 px-6">
          <h2 className="text-xl font-semibold">Profile Information</h2>
        </div>
        
        <div className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left Column - Personal Info */}
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium text-primary mb-4 pb-2 border-b border-gray-200">
                  Personal Details
                </h3>
                
                <div className="space-y-4">
                  {/* First Name */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                    <div className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-700">
                      {userProfile.firstName || 'Not set'}
                    </div>
                  </div>
                  
                  {/* Last Name */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                    <div className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-700">
                      {userProfile.lastName || 'Not set'}
                    </div>
                  </div>
                  
                  {/* Email */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                    <div className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-700">
                      {userProfile.email || 'Not set'}
                    </div>
                  </div>
                  
                  {/* Birth Date */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Birth Date</label>
                    <div className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-700">
                      {userProfile.birthdate 
                        ? new Date(userProfile.birthdate).toLocaleDateString('en-US', { 
                            year: 'numeric', 
                            month: 'long', 
                            day: 'numeric' 
                          })
                        : 'Not set'
                      }
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - Security */}
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium text-primary mb-4 pb-2 border-b border-gray-200">
                  Security Settings
                </h3>
                
                <div className="space-y-4">
                  {/* Password */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                    
                    {!isEditingPassword ? (
                      <div className="relative">
                        <div className="px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg text-gray-700">
                          <span>••••••••••••</span>
                        </div>
                        <div className="mt-1 text-xs text-gray-500">
                          Last changed: {formatDisplayDate(user?.lastPasswordChange)}
                        </div>
                        <button
                          onClick={() => setIsEditingPassword(true)}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1.5 text-accent hover:text-primary transition-colors duration-200 bg-white rounded-full shadow-sm border border-gray-200"
                          title="Edit Password"
                        >
                          <EditIcon />
                        </button>
                      </div>
                    ) : (
                      <div className="space-y-3 p-4 bg-gray-50 rounded-lg border border-gray-300 shadow-sm">
                        <div className="relative">
                          <input
                            type={showPassword ? 'text' : 'password'}
                            placeholder="Current Password"
                            value={passwordData.currentPassword}
                            onChange={(e) => handlePasswordChange('currentPassword', e.target.value)}
                            className="w-full px-4 py-2 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent text-gray-700"
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-accent transition-colors duration-200"
                            title={showPassword ? 'Hide password' : 'Show password'}
                          >
                            {showPassword ? <EyeOffIcon /> : <EyeIcon />}
                          </button>
                        </div>
                        <div className="relative">
                          <input
                            type={showPassword ? 'text' : 'password'}
                            placeholder="New Password"
                            value={passwordData.newPassword}
                            onChange={(e) => handlePasswordChange('newPassword', e.target.value)}
                            className="w-full px-4 py-2 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent text-gray-700"
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-accent transition-colors duration-200"
                            title={showPassword ? 'Hide password' : 'Show password'}
                          >
                            {showPassword ? <EyeOffIcon /> : <EyeIcon />}
                          </button>
                        </div>
                        <div className="relative">
                          <input
                            type={showPassword ? 'text' : 'password'}
                            placeholder="Confirm New Password"
                            value={passwordData.confirmPassword}
                            onChange={(e) => handlePasswordChange('confirmPassword', e.target.value)}
                            className="w-full px-4 py-2 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent text-gray-700"
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-accent transition-colors duration-200"
                            title={showPassword ? 'Hide password' : 'Show password'}
                          >
                            {showPassword ? <EyeOffIcon /> : <EyeIcon />}
                          </button>
                        </div>
                        <div className="flex items-center justify-end space-x-2 pt-2">
                          <button
                            onClick={() => {
                              setIsEditingPassword(false);
                              setPasswordData({
                                currentPassword: '',
                                newPassword: '',
                                confirmPassword: ''
                              });
                            }}
                            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors duration-200 flex items-center"
                          >
                            <CancelIcon /> <span className="ml-1">Cancel</span>
                          </button>
                          <button
                            onClick={handlePasswordUpdate}
                            disabled={loading}
                            className="px-4 py-2 bg-secondary text-white rounded-lg hover:bg-yellow-500 transition-colors duration-200 flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            <SaveIcon /> <span className="ml-1">Update</span>
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                  
                  {/* Account Security Note */}
                  <div className="bg-blue-50 border-l-4 border-blue-400 p-4 rounded-md mt-6">
                    <div className="flex">
                      <div className="flex-shrink-0">
                        <svg className="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <div className="ml-3">
                        <p className="text-sm text-blue-700">
                          For security reasons, as an admin user you can only change your password. Contact system support for changes to other profile information.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Footer */}
        <div className="bg-gray-50 py-4 px-6 border-t border-gray-200 text-center text-gray-500 text-sm">
          Admin Control Panel • Last login: {formatDisplayDate(new Date())}
        </div>
      </div>
    </div>
  );
};

export default AdminSettingsComponent;