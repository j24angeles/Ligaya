import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../hooks/ToastProvider';
import AdminProfileTab from './AdminProfileTab';
import { updateUser } from '../../api/userService';

const AdminSettingsComponent = () => {
  const { user, updateUser: updateAuthUser } = useAuth();
  const { showSuccess, showError } = useToast();
  const [activeTab, setActiveTab] = useState('profile');
  const [loading, setLoading] = useState(false);

  const handleProfileUpdate = async (updatedData) => {
    setLoading(true);
    
    try {
      const updatedUser = await updateUser(user.id, updatedData);
      
      updateAuthUser(updatedUser);
      
      showSuccess('Admin password updated successfully!');
      
    } catch (err) {
      console.error('Error updating admin password:', err);
      showError(err.message || 'Failed to update password');
    } finally {
      setLoading(false);
    }
  };

  // Admin Badge Component
  const AdminBadge = () => (
    <div className="flex items-center bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm font-semibold shadow-sm">
      <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
      </svg>
      Administrator
    </div>
  );

  return (
    <div className="p-6 max-w-7xl mx-auto transition-all duration-300 font-poppins">
      {/* Header with Admin Badge */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center">
          <h1 className="text-3xl font-bold text-primary mr-4">Settings</h1>
          <AdminBadge />
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
            Security
          </button>
    
        </div>
      </div>

      {/* Tab Content */}
      <div className="rounded-lg border border-gray-200 bg-white shadow-lg overflow-hidden">
        {activeTab === 'profile' && (
          <AdminProfileTab
            user={user}
            onUpdate={handleProfileUpdate}
            loading={loading}
          />
        )}

     

      </div>
    </div>
  );
};

export default AdminSettingsComponent;