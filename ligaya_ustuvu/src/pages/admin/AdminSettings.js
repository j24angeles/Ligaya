import React, { useEffect } from 'react';
import Sidebar from '../../common/Sidebar';
import AdminSettingsComponent from '../../components/AdminSettingsComponent';
import { useAuth } from '../../context/AuthContext';

const AdminSettings = () => {
  const { user } = useAuth();

  useEffect(() => {
    if (user && user.role !== 'admin') {
      window.location.href = '/dashboard';
    }
  }, [user]);

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar role="admin" />

      <main className="flex-1 overflow-auto lg:ml-64 pt-16 lg:pt-4 px-4">
        <div className="container mx-auto">
          <AdminSettingsComponent />
        </div>
      </main>
    </div>
  );
};

export default AdminSettings;