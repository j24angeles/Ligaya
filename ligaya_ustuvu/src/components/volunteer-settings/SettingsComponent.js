// SettingsComponent.js
import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../hooks/ToastProvider';
import ProfileTab from './ProfileTab';
import HelpTab from './HelpTab';
import { updateUser } from '../../api/userService';

const SettingsComponent = () => {
  const { user, updateUser: updateAuthUser } = useAuth();
  const { showSuccess, showError } = useToast();
  const [activeTab, setActiveTab] = useState('profile');
  const [userProfile, setUserProfile] = useState({
    firstName: '',
    lastName: '',
    email: '',
    birthdate: ''
  });
  const [loading, setLoading] = useState(false);

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

  const handleProfileUpdate = async (updatedData) => {
    setLoading(true);
    
    try {
      const updatedUser = await updateUser(user.id, updatedData);
      
      updateAuthUser(updatedUser);
      
      setUserProfile(updatedData);
      
      showSuccess('Profile updated successfully!');
      
    } catch (err) {
      console.error('Error updating profile:', err);
      showError(err.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  // Volunteer Badge Component with admin styling
  const VolunteerBadge = () => (
    <div className="flex items-center bg-secondary text-primary px-3 py-1 rounded-full text-sm font-semibold shadow-sm">
      <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
      </svg>
      Volunteer
    </div>
  );

  return (
    <div className="p-6 max-w-7xl mx-auto transition-all duration-300 font-poppins">
      {/* Header with Role Badge */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center">
          <h1 className="text-3xl font-bold text-primary mr-4">Account & Settings</h1>
          <VolunteerBadge />
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="mb-6 border-b border-gray-300">
        <div className="flex space-x-0">
          <button
            className={`px-5 py-2 border-t border-l border-r text-sm font-medium rounded-t-md 
              ${activeTab === 'profile' 
                ? 'bg-white text-black border-gray-300' 
                : 'bg-gray-100 text-gray-500 border-gray-200'
              }`}
            onClick={() => setActiveTab('profile')}
          >
            Profile
          </button>
          <button
            className={`px-5 py-2 border-t border-l border-r text-sm font-medium rounded-t-md 
              ${activeTab === 'help' 
                ? 'bg-white text-black border-gray-300' 
                : 'bg-gray-100 text-gray-500 border-gray-200'
              }`}
            onClick={() => setActiveTab('help')}
          >
            Help
          </button>
        </div>
      </div>

      {/* Tab Content */}
      <div className="rounded-lg border border-gray-200 bg-white shadow-lg overflow-hidden">
      
        
        {activeTab === 'profile' && (
          <ProfileTab
            user={user}
            userProfile={userProfile}
            setUserProfile={setUserProfile}
            onUpdate={handleProfileUpdate}
            loading={loading}
          />
        )}
        {activeTab === 'help' && <HelpTab />}

        {/* Security Note (if on profile tab) */}
        {activeTab === 'profile' && (
          <div className="p-6 border-t border-gray-200">
            <div className="bg-blue-50 border-l-4 border-blue-400 p-4 rounded-md">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-blue-700">
                    Keep your profile information up to date to ensure you receive important notifications and communications.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Footer - Removed last login and "User Settings" label */}
        <div className="bg-gray-50 py-4 px-6 border-t border-gray-200">
          {/* Empty footer div to maintain spacing */}
        </div>
      </div>
    </div>
  );
};

export default SettingsComponent;