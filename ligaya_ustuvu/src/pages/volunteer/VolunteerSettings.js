// src/pages/Settings.js
import React from 'react';
import Sidebar from '../../common/Sidebar';
import SettingsComponent from '../../components/volunteer-settings/SettingsComponent';
import { useAuth } from '../../context/AuthContext';

const VolunteerSettings = () => {
  const { user } = useAuth();

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar role={user?.role || 'volunteer'} />

      {/* Main Content */}
      <main className="flex-1 overflow-auto lg:ml-64 pt-16 lg:pt-4 px-4">
        <div className="container mx-auto">
          <SettingsComponent />
        </div>
      </main>
    </div>
  );
};

export default VolunteerSettings;