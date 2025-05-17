import React, { useState, useEffect } from 'react';
import DashboardCards from './DashboardCards';
import Calendar from './Calendar';
import StatusChart from './StatusChart';
import RecentDonorsTable from './RecentDonorsTable';
import { getAllEvents } from '../../api/eventService';
import { getAllDonations } from '../../api/donationService';
import { getAllUsers } from '../../api/userService';  // <-- import this

const AdminDashboardComponent = () => {
  const [events, setEvents] = useState([]);
  const [donations, setDonations] = useState([]);
  const [users, setUsers] = useState([]);  // <-- store users here
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [eventsData, donationsData, usersData] = await Promise.all([
          getAllEvents(),
          getAllDonations(),
          getAllUsers()   // <-- fetch users here
        ]);
        setEvents(eventsData);
        setDonations(donationsData);
        setUsers(usersData);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
        setError('Failed to load dashboard data');
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <div className="text-primary">Loading dashboard data...</div>;
  }

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4">
        <h1 className="text-2xl font-bold text-primary">Hello, Admin!</h1>
      </div>
      {/* Pass users to DashboardCards */}
      <DashboardCards events={events} donations={donations} users={users} />
     <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
  <Calendar events={events} className="col-span-1" />
  <StatusChart donations={donations} className="col-span-2" />
</div>

      <RecentDonorsTable donations={donations} />
    </div>
  );
};

export default AdminDashboardComponent;
