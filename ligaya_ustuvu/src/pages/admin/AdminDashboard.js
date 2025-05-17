import React from 'react';
import Sidebar from '../../common/Sidebar';
import AdminDashboardComponent from '../../components/dashboard/AdminDashboardComponent';

const AdminDashboard = () => {
  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar role="admin" />
      
      {/* Main Content */}
      <main className="flex-1 overflow-auto lg:ml-64 pt-16 lg:pt-4 px-4">
        <div className="container mx-auto">
          <AdminDashboardComponent />
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
