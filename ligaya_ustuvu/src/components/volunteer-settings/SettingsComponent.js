// src/components/settings/SettingsComponent.js
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
      
      // Update the auth context with new user data
      updateAuthUser(updatedUser);
      
      // Update local state
      setUserProfile(updatedData);
      
      // Show success toast
      showSuccess('Profile updated successfully!');
      
    } catch (err) {
      console.error('Error updating profile:', err);
      showError(err.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const tabStyle = (tabName) => `
    px-4 py-2 font-medium text-sm rounded-lg cursor-pointer transition-all duration-200
    ${activeTab === tabName 
      ? 'bg-primary text-white shadow-sm' 
      : 'text-gray-600 hover:text-primary hover:bg-primary/10'
    }
  `;

  return (
    <div className="p-6 max-w-7xl mx-auto transition-all duration-300">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-primary">Account & Settings</h1>
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
      <div className="rounded-lg border border-gray-200 bg-white shadow-sm">
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
      </div>
    </div>
  );
};

export default SettingsComponent;