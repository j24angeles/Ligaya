import React, { useState } from 'react';
import { useToast } from '../../hooks/ToastProvider';

const ProfileTab = ({ user, userProfile, setUserProfile, onUpdate, loading }) => {
  const { showError, showSuccess } = useToast();
  const [showPassword, setShowPassword] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [isEditingPassword, setIsEditingPassword] = useState(false);
  const [editingFields, setEditingFields] = useState({});
  const [errors, setErrors] = useState({});

  const calculateAge = (birthdate) => {
    if (!birthdate) return 0;
    const birthDate = new Date(birthdate);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    
    return age;
  };

  const calculatePasswordStrength = (password) => {
    if (!password) return 0;
    
    let strength = 0;
    
    if (password.length >= 6) strength += 1;
    if (password.length >= 10) strength += 1;
    
    if (/[A-Z]/.test(password)) strength += 1;
    if (/[0-9]/.test(password)) strength += 1;
    if (/[^A-Za-z0-9]/.test(password)) strength += 1;
    
    return Math.min(strength, 5);
  };

  const validateField = (field, value) => {
    const newErrors = { ...errors };

    if (field === 'firstName') {
      if (!value.trim()) {
        newErrors.firstName = 'First name is required';
      } else if (value.length > 50) {
        newErrors.firstName = 'First name must be 50 characters or less';
      } else {
        delete newErrors.firstName;
      }
    }

    if (field === 'lastName') {
      if (!value.trim()) {
        newErrors.lastName = 'Last name is required';
      } else if (value.length > 50) {
        newErrors.lastName = 'Last name must be 50 characters or less';
      } else {
        delete newErrors.lastName;
      }
    }

    if (field === 'email') {
      if (!value.trim()) {
        newErrors.email = 'Email is required';
      } else if (value.length > 100) {
        newErrors.email = 'Email must be 100 characters or less';
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
        newErrors.email = 'Please enter a valid email address';
      } else {
        delete newErrors.email;
      }
    }

    if (field === 'birthdate') {
      if (!value) {
        newErrors.birthdate = 'Birthdate is required';
      } else {
        const today = new Date();
        const birthDate = new Date(value);
        
        if (birthDate > today) {
          newErrors.birthdate = 'Birthdate cannot be in the future';
        } else if (calculateAge(value) < 13) {
          newErrors.birthdate = 'You must be at least 13 years old';
        } else {
          delete newErrors.birthdate;
        }
      }
    }

    if (field === 'currentPassword') {
      if (!value.trim()) {
        newErrors.currentPassword = 'Current password is required';
      } else {
        delete newErrors.currentPassword;
      }
    }

    if (field === 'newPassword') {
      if (!value.trim()) {
        newErrors.newPassword = 'New password is required';
      } else if (value.length < 6) {
        newErrors.newPassword = 'Password must have at least 6 characters';
      } else if (value.length > 50) {
        newErrors.newPassword = 'Password must be 50 characters or less';
      } else if (!/(?=.*[A-Z])(?=.*\d)/.test(value)) {
        newErrors.newPassword = 'Password must contain at least 1 number and 1 capital letter';
      } else {
        delete newErrors.newPassword;
      }
    }

    if (field === 'confirmPassword') {
      if (!value.trim()) {
        newErrors.confirmPassword = 'Please confirm your new password';
      } else if (passwordData.newPassword !== value) {
        newErrors.confirmPassword = 'Passwords do not match';
      } else {
        delete newErrors.confirmPassword;
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field, value) => {
    setUserProfile(prev => ({
      ...prev,
      [field]: value
    }));
    validateField(field, value);
  };

  const handlePasswordChange = (field, value) => {
    setPasswordData(prev => ({
      ...prev,
      [field]: value
    }));
    validateField(field, value);
  };

  const handleEditToggle = (field) => {
    setEditingFields(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const handleSave = async (field) => {
    if (validateField(field, userProfile[field])) {
      try {
        await onUpdate({ [field]: userProfile[field] });
        setEditingFields(prev => ({
          ...prev,
          [field]: false
        }));
        showSuccess(`${field.charAt(0).toUpperCase() + field.slice(1)} updated successfully!`);
      } catch (error) {
        showError(error.message || 'Failed to update profile');
      }
    } else {
      showError(errors[field]);
    }
  };

  const handleCancel = (field) => {
    setEditingFields(prev => ({
      ...prev,
      [field]: false
    }));
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const handlePasswordUpdate = async () => {
    // Validate all password fields
    const isCurrentValid = validateField('currentPassword', passwordData.currentPassword);
    const isNewValid = validateField('newPassword', passwordData.newPassword);
    const isConfirmValid = validateField('confirmPassword', passwordData.confirmPassword);
    
    if (!isCurrentValid || !isNewValid || !isConfirmValid) {
      const firstError = Object.values(errors)[0];
      if (firstError) {
        showError(firstError);
      }
      return;
    }

    try {
      await onUpdate({ 
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
        lastPasswordChange: new Date().toISOString()
      });
      
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
      setIsEditingPassword(false);
      showSuccess('Password updated successfully!');
    } catch (error) {
      showError(error.message || 'Failed to update password');
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toISOString().split('T')[0];
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
          <h2 className="text-xl font-bold text-primary">Personal Information</h2>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-5">
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-primary">First Name</label>
              <div className="relative group">
                {editingFields.firstName ? (
                  <>
                    <input
                      type="text"
                      value={userProfile.firstName}
                      onChange={(e) => handleInputChange('firstName', e.target.value)}
                      className={`w-full px-3 py-2.5 pr-20 border-2 rounded-lg focus:outline-none transition-colors duration-200 bg-white text-sm ${
                        errors.firstName ? 'border-error' : 'border-gray-200 focus:border-accent'
                      }`}
                      placeholder="Enter your first name"
                    />
                    {errors.firstName && (
                      <span className="text-xs text-error mt-1">{errors.firstName}</span>
                    )}
                    <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex space-x-1">
                      <button
                        onClick={() => handleSave('firstName')}
                        disabled={loading}
                        className="p-1.5 bg-secondary text-white rounded hover:bg-secondary-dark transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                        title="Save"
                      >
                        <SaveIcon />
                      </button>
                      <button
                        onClick={() => handleCancel('firstName')}
                        className="p-1.5 bg-red-500 text-white rounded hover:bg-red-600 transition-colors duration-200"
                        title="Cancel"
                      >
                        <CancelIcon />
                      </button>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="w-full px-3 py-2.5 border-2 border-gray-200 rounded-lg bg-gray-50 text-sm">
                      {userProfile.firstName || 'Not set'}
                    </div>
                    <button
                      onClick={() => handleEditToggle('firstName')}
                      className="absolute right-2 top-1/2 transform -translate-y-1/2 p-1.5 text-accent hover:text-primary transition-colors duration-200"
                      title="Edit"
                    >
                      <EditIcon />
                    </button>
                  </>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-semibold text-primary">Last Name</label>
              <div className="relative group">
                {editingFields.lastName ? (
                  <>
                    <input
                      type="text"
                      value={userProfile.lastName}
                      onChange={(e) => handleInputChange('lastName', e.target.value)}
                      className={`w-full px-3 py-2.5 pr-20 border-2 rounded-lg focus:outline-none transition-colors duration-200 bg-white text-sm ${
                        errors.lastName ? 'border-error' : 'border-gray-200 focus:border-accent'
                      }`}
                      placeholder="Enter your last name"
                    />
                    {errors.lastName && (
                      <span className="text-xs text-error mt-1">{errors.lastName}</span>
                    )}
                    <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex space-x-1">
                      <button
                        onClick={() => handleSave('lastName')}
                        disabled={loading}
                        className="p-1.5 bg-secondary text-white rounded hover:bg-secondary-dark transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                        title="Save"
                      >
                        <SaveIcon />
                      </button>
                      <button
                        onClick={() => handleCancel('lastName')}
                        className="p-1.5 bg-red-500 text-white rounded hover:bg-red-600 transition-colors duration-200"
                        title="Cancel"
                      >
                        <CancelIcon />
                      </button>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="w-full px-3 py-2.5 border-2 border-gray-200 rounded-lg bg-gray-50 text-sm">
                      {userProfile.lastName || 'Not set'}
                    </div>
                    <button
                      onClick={() => handleEditToggle('lastName')}
                      className="absolute right-2 top-1/2 transform -translate-y-1/2 p-1.5 text-accent hover:text-primary transition-colors duration-200"
                      title="Edit"
                    >
                      <EditIcon />
                    </button>
                  </>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-semibold text-primary">Email Address</label>
              <div className="relative group">
                {editingFields.email ? (
                  <>
                    <input
                      type="email"
                      value={userProfile.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      className={`w-full px-3 py-2.5 pr-20 border-2 rounded-lg focus:outline-none transition-colors duration-200 bg-white text-sm ${
                        errors.email ? 'border-error' : 'border-gray-200 focus:border-accent'
                      }`}
                      placeholder="Enter your email address"
                    />
                    {errors.email && (
                      <span className="text-xs text-error mt-1">{errors.email}</span>
                    )}
                    <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex space-x-1">
                      <button
                        onClick={() => handleSave('email')}
                        disabled={loading}
                        className="p-1.5 bg-secondary text-white rounded hover:bg-secondary-dark transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                        title="Save"
                      >
                        <SaveIcon />
                      </button>
                      <button
                        onClick={() => handleCancel('email')}
                        className="p-1.5 bg-red-500 text-white rounded hover:bg-red-600 transition-colors duration-200"
                        title="Cancel"
                      >
                        <CancelIcon />
                      </button>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="w-full px-3 py-2.5 border-2 border-gray-200 rounded-lg bg-gray-50 text-sm">
                      {userProfile.email || 'Not set'}
                    </div>
                    <button
                      onClick={() => handleEditToggle('email')}
                      className="absolute right-2 top-1/2 transform -translate-y-1/2 p-1.5 text-accent hover:text-primary transition-colors duration-200"
                      title="Edit"
                    >
                      <EditIcon />
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>

          <div className="space-y-5">
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-primary">Birth Date</label>
              <div className="relative group">
                {editingFields.birthdate ? (
                  <>
                    <input
                      type="date"
                      value={formatDate(userProfile.birthdate)}
                      onChange={(e) => handleInputChange('birthdate', e.target.value)}
                      className={`w-full px-3 py-2.5 pr-20 border-2 rounded-lg focus:outline-none transition-colors duration-200 bg-white text-sm ${
                        errors.birthdate ? 'border-error' : 'border-gray-200 focus:border-accent'
                      }`}
                    />
                    {errors.birthdate && (
                      <span className="text-xs text-error mt-1">{errors.birthdate}</span>
                    )}
                    <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex space-x-1">
                      <button
                        onClick={() => handleSave('birthdate')}
                        disabled={loading}
                        className="p-1.5 bg-secondary text-white rounded hover:bg-secondary-dark transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                        title="Save"
                      >
                        <SaveIcon />
                      </button>
                      <button
                        onClick={() => handleCancel('birthdate')}
                        className="p-1.5 bg-red-500 text-white rounded hover:bg-red-600 transition-colors duration-200"
                        title="Cancel"
                      >
                        <CancelIcon />
                      </button>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="w-full px-3 py-2.5 border-2 border-gray-200 rounded-lg bg-gray-50 text-sm">
                      {userProfile.birthdate 
                        ? new Date(userProfile.birthdate).toLocaleDateString('en-US', { 
                            year: 'numeric', 
                            month: 'long', 
                            day: 'numeric' 
                          })
                        : 'Not set'
                      }
                    </div>
                    <button
                      onClick={() => handleEditToggle('birthdate')}
                      className="absolute right-2 top-1/2 transform -translate-y-1/2 p-1.5 text-accent hover:text-primary transition-colors duration-200"
                      title="Edit"
                    >
                      <EditIcon />
                    </button>
                  </>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-semibold text-primary">Password</label>
              
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
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Current Password"
                      value={passwordData.currentPassword}
                      onChange={(e) => handlePasswordChange('currentPassword', e.target.value)}
                      className={`w-full px-3 py-2 pr-10 border rounded-md focus:outline-none text-sm ${
                        errors.currentPassword ? 'border-error' : 'border-gray-300 focus:border-accent'
                      }`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-accent transition-colors duration-200"
                      title={showPassword ? 'Hide password' : 'Show password'}
                    >
                      {showPassword ? <EyeOffIcon /> : <EyeIcon />}
                    </button>
                    {errors.currentPassword && (
                      <span className="text-xs text-error mt-1">{errors.currentPassword}</span>
                    )}
                  </div>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      placeholder="New Password"
                      value={passwordData.newPassword}
                      onChange={(e) => handlePasswordChange('newPassword', e.target.value)}
                      className={`w-full px-3 py-2 pr-10 border rounded-md focus:outline-none text-sm ${
                        errors.newPassword ? 'border-error' : 'border-gray-300 focus:border-accent'
                      }`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-accent transition-colors duration-200"
                      title={showPassword ? 'Hide password' : 'Show password'}
                    >
                      {showPassword ? <EyeOffIcon /> : <EyeIcon />}
                    </button>
                    {errors.newPassword && (
                      <span className="text-xs text-error mt-1">{errors.newPassword}</span>
                    )}
                  </div>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Confirm New Password"
                      value={passwordData.confirmPassword}
                      onChange={(e) => handlePasswordChange('confirmPassword', e.target.value)}
                      className={`w-full px-3 py-2 pr-10 border rounded-md focus:outline-none text-sm ${
                        errors.confirmPassword ? 'border-error' : 'border-gray-300 focus:border-accent'
                      }`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-accent transition-colors duration-200"
                      title={showPassword ? 'Hide password' : 'Show password'}
                    >
                      {showPassword ? <EyeOffIcon /> : <EyeIcon />}
                    </button>
                    {errors.confirmPassword && (
                      <span className="text-xs text-error mt-1">{errors.confirmPassword}</span>
                    )}
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
                        setErrors(prev => ({
                          ...prev,
                          currentPassword: '',
                          newPassword: '',
                          confirmPassword: ''
                        }));
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
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileTab;