// src/components/dashboard/VolunteerDashboardComponent.js
import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import DashboardCards from './DashboardCards';
import Calendar from './Calendar';
import EventsCarousel from './EventsCarousel';
import RecentDonationsTable from './RecentDonationsTable';
import UpcomingEventsTable from './UpcomingEventsTable'; // Import the new component
import { getAllEvents } from '../../api/eventService';
import { getAllDonations } from '../../api/donationService';

const VolunteerDashboardComponent = () => {
  const { user } = useAuth();
  const [events, setEvents] = useState([]);
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [eventsData, donationsData] = await Promise.all([
          getAllEvents(),
          getAllDonations(),
        ]);
        setEvents(eventsData);
        setDonations(donationsData);
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

  // Filter to show only upcoming published events
  const upcomingEvents = events.filter(event => {
    const eventDate = new Date(event.date);
    const today = new Date();
    return eventDate >= today && event.isPublished;
  });

  return ( 
    <div className="p-6 max-w-7xl mx-auto"> 
      <div className="flex justify-between items-center mb-2">
        <h1 className="text-3xl font-bold text-primary">
          Hello, {user?.firstName || 'Volunteer'}!
        </h1>
      </div>

      <div className="mb-3">
        <DashboardCards 
          events={events} 
          donations={donations.filter(d => d.userId === user?.id)} 
          showUserStats={true} 
        />
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 mb-3">
        <Calendar events={events} className="col-span-1 h-24" />
        <div className="col-span-3">
          <EventsCarousel events={upcomingEvents} />
        </div>
      </div>

      {/* Updated section with two-column layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <UpcomingEventsTable />
          <RecentDonationsTable />
      </div>
    </div>
  );
};

export default VolunteerDashboardComponent;