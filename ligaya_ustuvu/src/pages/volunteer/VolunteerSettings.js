import React, { useState, useEffect, useRef } from 'react';
import { getCurrentUser } from '../../api/auth';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../../hooks/ToastProvider';
import TermsConditions from '../../components/TermsCondi';
import PrivacyPolicy from '../../components/PrivacyPolicy';
import Sidebar from '../../common/Sidebar';
import Contact from '../../components/Contact';
import ProfileCard from '../../components/ProfileCard';
import PersonalDetailsTab from '../../components/PersonalDetailsTab';
import SecurityTab from '../../components/SecurityTab';
import SupportTab from '../../components/SupportTab';

const VolunteerSettings = () => {
  const [user, setUser] = useState(null);
  
  const navigate = useNavigate();
  const { showToast, showSuccess, showError, showInfo } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [profilePicture, setProfilePicture] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const fileInputRef = useRef(null);
  const [activeTab, setActiveTab] = useState('personal');
  const [showTermsModal, setShowTermsModal] = useState(false);
  const [showPrivacyModal, setShowPrivacyModal] = useState(false);
  const [showContactModal, setShowContactModal] = useState(false);
  
  // Password states
  const [currentPassword, setCurrentPassword] = useState('');
  const [currentPasswordError, setCurrentPasswordError] = useState('');
  const [passwordStrength, setPasswordStrength] = useState('Strong');
  const [lastPasswordChange, setLastPasswordChange] = useState('');
    
  // Form states
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    birthdate: '',
    password: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState({});
  
  useEffect(() => {
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
        
        const formatBirthdate = (dateString) => {
          if (!dateString) return '';
          const date = new Date(dateString);
          return date.toISOString().split('T')[0];
        };
        
        setFormData({
          firstName: parsedUser.firstName || '',
          lastName: parsedUser.lastName || '',
          email: parsedUser.email || '',
          birthdate: formatBirthdate(parsedUser.birthdate) || '',
          password: '',
          confirmPassword: '',
        });
        
        if (parsedUser.profilePicture) {
          setPreviewUrl(parsedUser.profilePicture);
        }
        
        if (parsedUser.lastPasswordChange) {
          const lastChange = new Date(parsedUser.lastPasswordChange);
          const today = new Date();
          const diffTime = Math.abs(today - lastChange);
          const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
          setLastPasswordChange(`${diffDays} days ago`);
        } else {
          setLastPasswordChange('Never');
        }
        
        if (parsedUser.passwordStrength) {
          setPasswordStrength(parsedUser.passwordStrength);
        }
      } catch (error) {
        console.error('Error parsing current user:', error);
        localStorage.removeItem('currentUser');
        navigate('/login');
        return;
      }
    } else {
      navigate('/login');
      return;
    }
    
    setIsLoading(false);
  }, [navigate]);
  
  const validateForm = (data) => {
    const newErrors = {};
    
    if (data.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    
    if (data.birthdate) {
      const birthDate = new Date(data.birthdate);
      const today = new Date();
      
      if (birthDate > today) {
        newErrors.birthdate = 'Birthdate cannot be in the future';
      }
      
      const age = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        if (age - 1 < 13) {
          newErrors.birthdate = 'You must be at least 13 years old';
        }
      } else if (age < 13) {
        newErrors.birthdate = 'You must be at least 13 years old';
      }
    }
    
    if (data.password) {
      if (data.password.length < 6) {
        newErrors.password = 'Password must have at least 6 characters';
      } else if (!/\d/.test(data.password)) {
        newErrors.password = 'Password must contain at least 1 number';
      } else if (!/[A-Z]/.test(data.password)) {
        newErrors.password = 'Password must contain at least 1 capital letter';
      }
      if (data.password !== data.confirmPassword) {
        newErrors.confirmPassword = 'Passwords do not match';
      }
    }
    return newErrors;
  };
  
  const handleFileSelect = (e) => {
    if (e.target.files.length > 0) {
      const file = e.target.files[0];
      
      if (!file.type.match('image.*')) {
        showToast('Please select an image file', 'error');
        return;
      }
      
      if (file.size > 5 * 1024 * 1024) {
        showToast('Image must be less than 5MB', 'error');
        return;
      }
      
      setProfilePicture(file);
      
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };
  
  const handleProfilePictureClick = () => {
    fileInputRef.current.click();
  };
  
  const handleSaveChanges = async (updatedData) => {
    try {
      // For personal details
      const validationErrors = validateForm(updatedData);
      
      if (Object.keys(validationErrors).length > 0) {
        setErrors(validationErrors);
        return;
      }
      
      setIsLoading(true);
      const user = getCurrentUser();
      
      const updatedUserData = {
        ...user,
        firstName: updatedData.firstName,
        lastName: updatedData.lastName,
        email: updatedData.email,
        birthdate: updatedData.birthdate,
        name: `${updatedData.firstName} ${updatedData.lastName}`,
      };
      
      if (profilePicture) {
        updatedUserData.profilePicture = previewUrl;
      }
      
      const response = await axios.put(`/api/users/${user.id}`, updatedUserData);
      
      if (response.status === 200 || response.status === 201) {
        localStorage.setItem('currentUser', JSON.stringify(updatedUserData));
        setFormData(updatedData);
        showSuccess('Profile updated successfully');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      showError('Failed to update profile');
    } finally {
      setIsLoading(false);
    }
  };
  
  const handlePasswordSave = async (passwordData) => {
    const validationErrors = validateForm(passwordData);
    
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    
    if (!currentPassword) {
      setCurrentPasswordError('Please enter your current password');
      return;
    }
    
    const isPasswordValid = await verifyCurrentPassword();
    if (!isPasswordValid) {
      setCurrentPasswordError('Current password is incorrect');
      return;
    }
    
    try {
      setIsLoading(true);
      const user = getCurrentUser();
      
      const updatedUserData = {
        ...user,
        password: passwordData.password,
        lastPasswordChange: new Date().toISOString(),
      };
      
      // Calculate password strength
      const hasUpperCase = /[A-Z]/.test(passwordData.password);
      const hasLowerCase = /[a-z]/.test(passwordData.password);
      const hasNumbers = /\d/.test(passwordData.password);
      const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(passwordData.password);
      const isLongEnough = passwordData.password.length >= 8;
      
      let strength = 'Weak';
      let strengthPoints = 0;
      
      if (hasUpperCase) strengthPoints++;
      if (hasLowerCase) strengthPoints++;
      if (hasNumbers) strengthPoints++;
      if (hasSpecialChar) strengthPoints++;
      if (isLongEnough) strengthPoints++;
      
      if (strengthPoints >= 4) {
        strength = 'Strong';
      } else if (strengthPoints >= 3) {
        strength = 'Medium';
      }
      
      updatedUserData.passwordStrength = strength;
      setPasswordStrength(strength);
      setLastPasswordChange('Today');
      
      const response = await axios.put(`/api/users/${user.id}`, updatedUserData);
      
      if (response.status === 200 || response.status === 201) {
        localStorage.setItem('currentUser', JSON.stringify(updatedUserData));
        showSuccess('Password updated successfully');
        setFormData(prev => ({ ...prev, password: '', confirmPassword: '' }));
        setCurrentPassword('');
        setCurrentPasswordError('');
      }
    } catch (error) {
      console.error('Error updating password:', error);
      showError('Failed to update password');
    } finally {
      setIsLoading(false);
    }
  };
  
  const verifyCurrentPassword = async () => {
    try {
      const user = getCurrentUser();
      const response = await axios.post('/api/users/verify-password', {
        userId: user.id,
        password: currentPassword
      });
      return response.data.valid;
    } catch (error) {
      console.error('Error verifying password:', error);
      setCurrentPasswordError('Failed to verify current password');
      return false;
    }
  };
  
  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
    // Clear any errors for this field when the user changes it
    if (errors[e.target.name]) {
      setErrors(prev => ({
        ...prev,
        [e.target.name]: null
      }));
    }
  };
  
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary"></div>
      </div>
    );
  }
  
  return (
    <div className="flex-1 overflow-auto lg:ml-64 pt-16 lg:pt-4 px-4">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Settings</h1>
        <p className="text-gray-600">Manage your account information and preferences.</p>
      </div>
      
      <div className="flex flex-col md:flex-row gap-6">
        <Sidebar role={user.role} />
        
        <div className="w-full md:flex-1">
          <ProfileCard 
            formData={formData}
            previewUrl={previewUrl}
            handleProfilePictureClick={handleProfilePictureClick}
            fileInputRef={fileInputRef}
            handleFileSelect={handleFileSelect}
          />
          
          <div className="bg-white rounded-lg shadow-sm">
            <div className="border-b border-gray-200">
              <nav className="flex">
                <button
                  className={`px-5 py-3 font-medium ${
                    activeTab === 'personal'
                      ? 'border-b-2 border-primary text-primary'
                      : 'text-gray-500'
                  }`}
                  onClick={() => setActiveTab('personal')}
                >
                  Personal details
                </button>
                <button
                  className={`px-5 py-3 font-medium ${
                    activeTab === 'security'
                      ? 'border-b-2 border-primary text-primary'
                      : 'text-gray-500'
                  }`}
                  onClick={() => setActiveTab('security')}
                >
                  Security
                </button>
                <button
                  className={`px-5 py-3 font-medium ${
                    activeTab === 'support'
                      ? 'border-b-2 border-primary text-primary'
                      : 'text-gray-500'
                  }`}
                  onClick={() => setActiveTab('support')}
                >
                  Support
                </button>
              </nav>
            </div>
            
            {activeTab === 'personal' && (
              <PersonalDetailsTab
                formData={formData}
                errors={errors}
                handleChange={handleChange}
                handleSaveChanges={handleSaveChanges}
              />
            )}
            
            {activeTab === 'security' && (
              <SecurityTab
                formData={formData}
                errors={errors}
                currentPassword={currentPassword}
                currentPasswordError={currentPasswordError}
                passwordStrength={passwordStrength}
                lastPasswordChange={lastPasswordChange}
                handleChange={handleChange}
                setCurrentPassword={setCurrentPassword}
                setCurrentPasswordError={setCurrentPasswordError}
                handleSaveChanges={handlePasswordSave}
              />
            )}
            
            {activeTab === 'support' && (
              <SupportTab
                setShowContactModal={setShowContactModal}
                setShowPrivacyModal={setShowPrivacyModal}
                setShowTermsModal={setShowTermsModal}
              />
            )}
          </div>
        </div>
      </div>
      
      {showTermsModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-4 max-w-2xl w-full max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium">Terms of Use</h3>
              <button
                onClick={() => setShowTermsModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="text-gray-600">
              <TermsConditions />
            </div>
            <div className="mt-4 flex justify-end">
              <button
                onClick={() => setShowTermsModal(false)}
                className="px-3 py-2 bg-primary text-white rounded-md hover:bg-accent"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
      
      {showPrivacyModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-4 max-w-2xl w-full max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium">Privacy Policy</h3>
              <button
                onClick={() => setShowPrivacyModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="text-gray-600">
              <PrivacyPolicy />
            </div>
            <div className="mt-4 flex justify-end">
              <button
                onClick={() => setShowPrivacyModal(false)}
                className="px-3 py-2 bg-primary text-white rounded-md hover:bg-accent"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
      
      {showContactModal && (
        <Contact 
          isOpen={showContactModal}
          onClose={() => setShowContactModal(false)}
        />
      )}
    </div>
  );
};

export default VolunteerSettings;