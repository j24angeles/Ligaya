// src/pages/AdminDashboard.js
import React from 'react';
import Sidebar from '../../common/Sidebar';

const AdminDashboard = () => {
  return (
    <div>
      <h1>Admin Dashboard</h1>
      {/* Admin specific content goes here */}
      <Sidebar role="admin" />
    </div>
   
  );


};

export default AdminDashboard;
