import React, { useState } from 'react';

const AdminProfileTab = ({ user, onUpdate, loading }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [isEditingPassword, setIsEditingPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [passwordStrength, setPasswordStrength] = useState(0);

  // Calculate password strength
  const calculatePasswordStrength = (password) => {
    if (!password) return 0;
    
    let strength = 0;
    
    // Length check
    if (password.length >= 6) strength += 1;
    if (password.length >= 10) strength += 1;
    
    // Character variety checks
    if (/[A-Z]/.test(password)) strength += 1;
    if (/[0-9]/.test(password)) strength += 1;
    if (/[^A-Za-z0-9]/.test(password)) strength += 1;
    
    return Math.min(strength, 5); // Max score of 5
  };

  // Get strength label and color
  const getStrengthInfo = (strength) => {
    const labels = ['Very Weak', 'Weak', 'Fair', 'Good', 'Strong', 'Very Strong'];
    const colors = ['#ff4d4d', '#ff9933', '#ffcc00', '#99cc33', '#70cc33', '#33cc33'];
    
    return {
      label: labels[strength],
      color: colors[strength]
    };
  };

  const handlePasswordChange = (field, value) => {
    setPasswordData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Update password strength when new password changes
    if (field === 'newPassword') {
      setPasswordStrength(calculatePasswordStrength(value));
    }
    
    // Clear errors when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: null
      }));
    }
  };

  const validatePasswordForm = () => {
    const newErrors = {};
    
    // Validate current password is not empty
    if (!passwordData.currentPassword.trim()) {
      newErrors.currentPassword = 'Current password is required';
    }
    
    // Validate new password
    if (!passwordData.newPassword.trim()) {
      newErrors.newPassword = 'New password is required';
    } else {
      if (passwordData.newPassword.length < 6) {
        newErrors.newPassword = 'Password must be at least 6 characters';
      } else if (passwordData.newPassword.length > 50) {
        newErrors.newPassword = 'Password must be 50 characters or less';
      } else if (!/(?=.*[A-Z])(?=.*\d)/.test(passwordData.newPassword)) {
        newErrors.newPassword = 'Password must contain at least 1 number and 1 capital letter';
      }
    }
    
    // Validate password confirmation
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handlePasswordUpdate = async () => {
    if (!validatePasswordForm()) {
      return;
    }
    
    try {
      await onUpdate({
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword
      });
      
      // Reset form on success
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
      setIsEditingPassword(false);
      setPasswordStrength(0);
    } catch (error) {
      // Handle errors from the API call
      if (error.message && error.message.includes('Current password is incorrect')) {
        setErrors({ currentPassword: 'Current password is incorrect' });
      } else {
        setErrors({ general: 'Failed to update password. Please try again.' });
      }
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

  return (
    <div className="p-6 font-poppins">
      <div className="mb-8">
        <div className="flex items-center mb-6">
          <div className="w-2 h-8 bg-secondary rounded-full mr-4"></div>
          <h2 className="text-xl font-bold text-primary">Security</h2>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Admin Information Section - Read Only */}
          <div className="space-y-5">
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-primary">Email</label>
              <div className="relative group">
                <div className="w-full px-3 py-2.5 border-2 border-gray-200 rounded-lg bg-gray-50 text-sm">
                  {user?.email || 'admin@example.com'}
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-semibold text-primary">Role</label>
              <div className="relative group">
                <div className="w-full px-3 py-2.5 border-2 border-gray-200 rounded-lg bg-gray-50 text-sm">
                  Administrator
                </div>
              </div>
            </div>
          </div>

          {/* Password Change Section */}
          <div className="space-y-5">
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-primary">Password Settings</label>
              
              {!isEditingPassword ? (
                <div className="relative">
                  <div className="px-3 py-2.5 bg-gray-50 border-2 border-gray-200 rounded-lg text-sm">
                    <span className="text-gray-600">••••••••••••</span>
                  </div>
                  <div className="absolute right-0 top-full mt-1 text-xs text-gray-500 text-right">
                    Last changed: {formatDisplayDate(user?.lastPasswordChange)}
                  </div>
                  <button
                    onClick={() => setIsEditingPassword(true)}
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 p-1.5 text-accent hover:text-primary transition-colors duration-200"
                    title="Edit"
                  >
                    <EditIcon />
                  </button>
                </div>
              ) : (
                <div className="space-y-3 p-4 bg-gray-50 rounded-lg border-2 border-gray-200">
                  {errors.general && (
                    <div className="p-2 bg-red-50 text-red-700 text-xs rounded border border-red-200">
                      {errors.general}
                    </div>
                  )}
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Current Password"
                      value={passwordData.currentPassword}
                      onChange={(e) => handlePasswordChange('currentPassword', e.target.value)}
                      className={`w-full px-3 py-2 pr-10 border ${errors.currentPassword ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:border-accent text-sm`}
                    />
                    {errors.currentPassword && (
                      <div className="text-red-500 text-xs mt-1">{errors.currentPassword}</div>
                    )}
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
                      className={`w-full px-3 py-2 pr-10 border ${errors.newPassword ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:border-accent text-sm`}
                    />
                    {errors.newPassword && (
                      <div className="text-red-500 text-xs mt-1">{errors.newPassword}</div>
                    )}
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-accent transition-colors duration-200"
                      title={showPassword ? 'Hide password' : 'Show password'}
                    >
                      {showPassword ? <EyeOffIcon /> : <EyeIcon />}
                    </button>
                    {/* Password strength indicator */}
                    {passwordData.newPassword && (
                      <div className="flex items-center gap-2 mt-1">
                        <div className="flex-1 h-1 bg-gray-200 rounded-full">
                          <div 
                            className="h-1 rounded-full transition-all duration-300"
                            style={{ 
                              width: `${(passwordStrength / 5) * 100}%`,
                              backgroundColor: getStrengthInfo(passwordStrength).color
                            }}
                          />
                        </div>
                        <span 
                          className="text-xs leading-none whitespace-nowrap"
                          style={{ color: getStrengthInfo(passwordStrength).color }}
                        >
                          {getStrengthInfo(passwordStrength).label}
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Confirm New Password"
                      value={passwordData.confirmPassword}
                      onChange={(e) => handlePasswordChange('confirmPassword', e.target.value)}
                      className={`w-full px-3 py-2 pr-10 border ${errors.confirmPassword ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:border-accent text-sm`}
                    />
                    {errors.confirmPassword && (
                      <div className="text-red-500 text-xs mt-1">{errors.confirmPassword}</div>
                    )}
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-accent transition-colors duration-200"
                      title={showPassword ? 'Hide password' : 'Show password'}
                    >
                      {showPassword ? <EyeOffIcon /> : <EyeIcon />}
                    </button>
                  </div>
                  <div className="flex items-center justify-end space-x-1">
                    <button
                      onClick={handlePasswordUpdate}
                      disabled={loading}
                      className="p-1.5 bg-secondary text-white rounded hover:bg-secondary-dark transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                      title="Save"
                    >
                      <SaveIcon />
                    </button> 
                    <button
                      onClick={() => {
                        setIsEditingPassword(false);
                        setPasswordData({
                          currentPassword: '',
                          newPassword: '',
                          confirmPassword: ''
                        });
                        setErrors({});
                        setPasswordStrength(0);
                      }}
                      className="p-1.5 bg-red-500 text-white rounded hover:bg-red-600 transition-colors duration-200"
                      title="Cancel"
                    >
                      <CancelIcon />
                    </button>
                  </div>
                </div>
              )}
            </div>
            
            {/* Security Recommendations */}
            <div className="mt-6 space-y-2">
              <h3 className="text-sm font-semibold text-primary">Security Recommendations</h3>
              <ul className="text-xs space-y-2 text-gray-600">
                <li className="flex items-start">
                  <svg className="w-4 h-4 mr-2 text-secondary flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  Use at least 12 characters with a mix of letters, numbers, and symbols
                </li>
                <li className="flex items-start">
                  <svg className="w-4 h-4 mr-2 text-secondary flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  Include at least one uppercase letter and one number
                </li>
                <li className="flex items-start">
                  <svg className="w-4 h-4 mr-2 text-secondary flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  Avoid using personal information or common words
                </li>
                <li className="flex items-start">
                  <svg className="w-4 h-4 mr-2 text-secondary flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  Change your password regularly (every 60-90 days)
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      
      {/* Admin Security Alert */}
      <div className="mt-6">
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-md">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-yellow-700">
                <strong>Administrator Security Notice:</strong> As an admin user, your account has elevated privileges. 
                Please ensure your password is strong and not shared with others.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminProfileTab;