import React, { useEffect, useState } from 'react';
import { MdEvent, MdDoneAll, MdPayments } from 'react-icons/md';
import { useAuth } from '../../context/AuthContext';

const DashboardCards = ({ events, donations }) => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    upcomingEvents: 0,
    completedEvents: 0,
    totalDonations: 0
  });

  useEffect(() => {
    if (events && donations && user) {
      const now = new Date();
      
      // Filter events the user has joined
      const userEvents = events.filter(event => 
        event.volunteers?.some(volunteer => volunteer.id === user.id)
      );

      // Count upcoming events
      const upcomingEventsCount = userEvents.filter(event => {
        const eventDate = new Date(event.date);
        return eventDate >= now;
      }).length;

      // Count completed events
      const completedEventsCount = userEvents.filter(event => {
        const eventDate = new Date(event.date);
        return eventDate < now;
      }).length;

      // Calculate user's total donations
      const userDonations = donations.filter(donation => donation.userId === user.id);
      const totalDonationsAmount = userDonations.reduce((sum, donation) => {
        return sum + (parseFloat(donation.amount) || 0);
      }, 0);

      setStats({
        upcomingEvents: upcomingEventsCount,
        completedEvents: completedEventsCount,
        totalDonations: totalDonationsAmount
      });
    }
  }, [events, donations, user]);

  const heroBackground = '/assets/dashboard_hero.png';

  return (
    <div className="space-y-3">
      {/* Hero Section */}
      <div
        className="rounded-2xl p-4 md:p-6 text-white relative overflow-hidden bg-cover bg-center"
        style={{
          backgroundImage: `url(${heroBackground})`
        }}
      >
        <div className="absolute inset-0 bg-primary/70 rounded-2xl z-0" />
        <div className="flex flex-col z-10 relative">
          <span className="text-xs text-secondary font-normal mb-1">
            {new Date().toLocaleDateString('en-US', {
              timeZone: 'Asia/Manila',
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </span>
          <h3 className="text-lg md:text-xl font-medium mb-1">Empower Lives Through</h3>
          <h3 className="text-lg md:text-xl font-medium">Meaningful Volunteer Work</h3>
        </div>
      </div>

      {/* Dashboard Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {/* Card 1: Upcoming Events */}
        <div className="bg-white rounded-xl shadow-sm p-3 relative overflow-hidden">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-secondary/20 flex items-center justify-center">
              <MdEvent className="text-secondary" size={20} />
            </div>
            <div>
              <p className="text-xs text-gray-500">Your Upcoming Events</p>
              <h3 className="text-base font-semibold">{stats.upcomingEvents} Events Joined</h3>
            </div>
          </div>
        </div>

        {/* Card 2: Completed Events */}
        <div className="bg-white rounded-xl shadow-sm p-3 relative overflow-hidden">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-secondary/20 flex items-center justify-center">
              <MdDoneAll className="text-secondary" size={20} />
            </div>
            <div>
              <p className="text-xs text-gray-500">Completed Events</p>
              <h3 className="text-base font-semibold">{stats.completedEvents} Events Finished</h3>
            </div>
          </div>
        </div>

        {/* Card 3: Total Donations */}
        <div className="bg-white rounded-xl shadow-sm p-3 relative overflow-hidden">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-secondary/20 flex items-center justify-center">
              <MdPayments className="text-secondary" size={20} />
            </div>
            <div>
              <p className="text-xs text-gray-500">Your Total Donations</p>
              <h3 className="text-base font-semibold">₱{stats.totalDonations.toLocaleString()}</h3>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardCards;