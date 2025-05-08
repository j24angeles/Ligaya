// pages/admin/AdminDb.js
import { useState, useEffect } from 'react';
import { Routes, Route, Link, useNavigate, Navigate } from 'react-router-dom';
import { getCurrentUser, logoutUser } from '../../api/auth';

// Import admin dashboard components here
// Example: import AdminProfile from './AdminProfile';
// Example: import ManageUsers from './ManageUsers';

export default function AdminDb() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Get current user on component mount 
    const currentUser = getCurrentUser();
    if (!currentUser) {
      // If no user found, redirect to login
      navigate('/login');
      return;
    }
    
    // Verify that user is an admin
    if (currentUser.role !== 'admin') {
      navigate('/unauthorized');
      return;
    }
    
    setUser(currentUser);
    
    // Optional: Check session validity periodically
    const sessionCheckInterval = setInterval(() => {
      const sessionStart = localStorage.getItem('sessionStart');
      const MAX_SESSION_TIME = 24 * 60 * 60 * 1000; // 24 hours in milliseconds
      
      if (sessionStart && Date.now() - parseInt(sessionStart) > MAX_SESSION_TIME) {
        // Session expired
        logoutUser();
        navigate('/login', { 
          state: { message: 'Your session has expired. Please log in again.' } 
        });
      }
    }, 60000); // Check every minute
    
    return () => clearInterval(sessionCheckInterval);
  }, [navigate]);

  // If user data is still loading
  if (!user) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  return (
    <div>
  
      
      <div className="container mx-auto p-4">
        <header className="mb-8">
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <p className="text-gray-600">Welcome back, {user.name}!</p>
        </header>
        
        <div className="mb-6">
          <nav className="flex space-x-4">
            <Link to="/admin" className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600">
              Dashboard
            </Link>
            <Link to="/event-management" className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600">
              Event Management
            </Link>
            <Link to="/admin/users" className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600">
              User Management
            </Link>
          </nav>
        </div>
        
        <main>
          <Routes>
            {/* Define nested routes for admin dashboard here */}
            <Route path="/" element={
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Dashboard cards go here */}
                <div className="bg-white p-6 rounded-lg shadow-md">
                  <h2 className="text-xl font-semibold mb-4">System Overview</h2>
                  <p>Admin dashboard overview goes here</p>
                </div>
                
                <div className="bg-white p-6 rounded-lg shadow-md">
                  <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
                  <p>Recent system activity goes here</p>
                </div>
                
                <div className="bg-white p-6 rounded-lg shadow-md">
                  <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
                  <div className="flex flex-col gap-2">
                    <Link to="/event-management" className="btn btn-sm btn-primary">
                      Manage Events
                    </Link>
                    <Link to="/admin/users" className="btn btn-sm btn-secondary">
                      Manage Users
                    </Link>
                  </div>
                </div>
              </div>
            } />
            
            {/* Add more admin routes as needed */}
            {/* Example: <Route path="/users" element={<ManageUsers />} /> */}
            
            {/* Default fallback route */}
            <Route path="*" element={<Navigate to="/admin" replace />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}