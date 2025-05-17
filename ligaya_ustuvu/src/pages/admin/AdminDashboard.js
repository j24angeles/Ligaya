// src/pages/AdminDashboard.js
import React, { useEffect, useState } from 'react';
import Sidebar from '../../common/Sidebar';
import StatisticsCards from '../../components/dashboard/StatisticCards';
import RecentDonorsTable from '../../components/dashboard/RecentDonorsTable';
import EventsThisMonth from '../../components/dashboard/EventsThisMonth';
import DonationsChart from '../../components/dashboard/DonationsChart';
import { getAllDonations } from '../../api/donationService';
import { getAllEvents } from '../../api/eventService';

const AdminDashboard = () => {
  const [donations, setDonations] = useState([]);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [donationsData, eventsData] = await Promise.all([
          getAllDonations(),
          getAllEvents()
        ]);
        setDonations(donationsData);
        setEvents(eventsData);
        setLoading(false);
      } catch (err) {
        setError('Failed to load dashboard data');
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex min-h-screen">
      <Sidebar role="admin" />
      <div className="flex-1 bg-neutral p-6 ml-64">
        <div className="mb-6">
          <h1 className="text-3xl font-semibold text-primary">Hello, Admin!</h1>
          <p className="text-gray-600">View the analytics of Ligaya.</p>
        </div>
        
        <StatisticsCards donations={donations} events={events} />
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          <div className="lg:col-span-2">
            <DonationsChart donations={donations} />
          </div>
          <div>
            <EventsThisMonth events={events} />
          </div>
        </div>
        
        <RecentDonorsTable donations={donations} />
      </div>
    </div>
  );
};

export default AdminDashboard;