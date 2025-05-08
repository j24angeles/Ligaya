import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../common/Sidebar';
import { getCurrentUser, logoutUser } from '../api/auth';

const Dashboard = () => {
  const navigate = useNavigate();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get user data when component mounts
    const userData = getCurrentUser();
    if (!userData) {
      // If no user data, redirect to login
      navigate('/login');
    } else {
      setUser(userData);
    }
    setLoading(false);
  }, [navigate]);

  // Handle the sidebar toggle state
  const handleSidebarToggle = (collapsed) => {
    setSidebarCollapsed(collapsed);
  };

  // Handle logout
  const handleLogout = () => {
    logoutUser();
    navigate('/login');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-secondary"></div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar component with role and logout handler */}
      <Sidebar 
        role={user?.role || 'volunteer'} 
        onToggle={handleSidebarToggle}
        onLogout={handleLogout}
      />
      
      {/* Main content area - adjusts based on sidebar state */}
      <main 
        className={`flex-1 transition-all duration-300 ${
          sidebarCollapsed ? 'ml-16' : 'ml-64'
        } overflow-x-hidden`}
      >
        {/* Header section */}
        <header className="bg-white shadow-sm">
          <div className="px-4 py-4 sm:px-6 lg:px-8 flex justify-between items-center">
            <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>
            <div className="flex items-center space-x-4">
              {user && (
                <div className="text-sm text-gray-700">
                  Welcome, <span className="font-medium">{user.name}</span>
                </div>
              )}
            </div>
          </div>
        </header>
        
        {/* Main content */}
        <div className="px-4 py-6 sm:px-6 lg:px-8">
          {/* Dashboard content goes here */}
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {/* Example card */}
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <h3 className="text-lg font-medium text-gray-900">Upcoming Events</h3>
                <div className="mt-4">
                  <p className="text-gray-500">No upcoming events</p>
                </div>
              </div>
            </div>
            
            {/* Example card */}
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <h3 className="text-lg font-medium text-gray-900">Recent Donations</h3>
                <div className="mt-4">
                  <p className="text-gray-500">No recent donations</p>
                </div>
              </div>
            </div>

            {/* Example card */}
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <h3 className="text-lg font-medium text-gray-900">Your Activities</h3>
                <div className="mt-4">
                  <p className="text-gray-500">No recent activities</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;