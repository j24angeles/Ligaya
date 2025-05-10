import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import Sidebar from '../../common/Sidebar';
import AdminUserManagement from '../../components/AdminUserManagement';

const AdminUserPage = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
      } catch (error) {
        console.error('Error parsing current user:', error);
        localStorage.removeItem('currentUser');
      }
    }
    setLoading(false);
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user || user.role !== 'admin') {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar component with responsive behavior built-in */}
      <Sidebar role={user.role} />
      
      {/* Main Content - with proper padding to avoid overlap */}
      <main className="flex-1 overflow-auto lg:ml-64 pt-16 lg:pt-4 px-4">
        <div className="container mx-auto">
          <AdminUserManagement />
        </div>
      </main>
    </div>
  );
};

export default AdminUserPage;