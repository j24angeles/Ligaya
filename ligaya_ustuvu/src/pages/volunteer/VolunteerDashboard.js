import React from 'react';
import Sidebar from '../../common/Sidebar';
import VolunteerDashboardComponent from '../../components/volunteer-dashboard/VolunteerDashboardComponent';

const VolunteerDashboard = () => {
  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar role="volunteer" />
      
      {/* Main Content */}
      <main className="flex-1 overflow-auto lg:ml-64 pt-16 lg:pt-4 px-4">
        <div className="container mx-auto">
          <VolunteerDashboardComponent />
        </div>
      </main>
    </div>
  );
};

export default VolunteerDashboard;
