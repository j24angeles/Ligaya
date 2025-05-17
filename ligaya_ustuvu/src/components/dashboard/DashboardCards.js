import React, { useEffect, useState } from 'react';
import { MdEvent, MdPeople, MdPayments, MdMoreVert } from 'react-icons/md';
import { useNavigate } from 'react-router-dom';

const DashboardCards = ({ events, donations, users }) => {
  const [stats, setStats] = useState({
    upcomingEvents: 0,
    totalVolunteers: 0,
    totalDonations: 0
  });

  const navigate = useNavigate();

  useEffect(() => {
    if (events && donations && users) {
      const now = new Date();
      const upcomingEventsCount = events.filter(event => {
        const eventDate = new Date(event.date);
        return eventDate >= now && event.isPublished;
      }).length;

      const volunteerCount = users.filter(user => user.role === 'volunteer').length;

      const totalDonationsAmount = donations.reduce((sum, donation) => {
        return sum + (parseFloat(donation.amount) || 0);
      }, 0);

      setStats({
        upcomingEvents: upcomingEventsCount,
        totalVolunteers: volunteerCount,
        totalDonations: totalDonationsAmount
      });
    }
  }, [events, donations, users]);

  const heroBackground = '/assets/dashboard_hero.png';

  return (
    <div className="space-y-4">
      {/* Hero Section */}
      <div
        className="rounded-2xl p-6 md:p-8 text-white relative overflow-hidden bg-cover bg-center"
        style={{
          backgroundImage: `url(${heroBackground})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="absolute inset-0 bg-primary/70 rounded-2xl z-0" />
        <div className="flex flex-col z-10 relative">
          <span className="text-lg text-secondary font-medium mb-2">LIGAYA</span>
          <h2 className="text-2xl md:text-3xl font-bold mb-2">Powering Child Advocacy</h2>
          <h3 className="text-xl md:text-2xl font-medium">Behind the Scenes</h3>
        </div>
      </div>

      {/* Dashboard Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Card 1: Upcoming Events */}
        <div className="bg-white rounded-xl shadow-sm p-4 relative overflow-hidden">
          <div className="flex justify-between items-start">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-secondary/20 flex items-center justify-center">
                <MdEvent className="text-secondary" size={24} />
              </div>
              <div>
                <p className="text-sm text-gray-500">Upcoming Events</p>
                <h3 className="text-lg font-semibold">{stats.upcomingEvents} Upcoming Events</h3>
              </div>
            </div>
            <button
              className="text-gray-400"
              onClick={() => navigate('/event-management')}
              aria-label="Go to event management"
            >
              <MdMoreVert size={24} />
            </button>
          </div>
        </div>

        {/* Card 2: Volunteer Count */}
        <div className="bg-white rounded-xl shadow-sm p-4 relative overflow-hidden">
          <div className="flex justify-between items-start">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-secondary/20 flex items-center justify-center">
                <MdPeople className="text-secondary" size={24} />
              </div>
              <div>
                <p className="text-sm text-gray-500">Volunteer Count</p>
                <h3 className="text-lg font-semibold">{stats.totalVolunteers} Volunteers</h3>
              </div>
            </div>
            <button
              className="text-gray-400"
              onClick={() => navigate('/user-management')}
              aria-label="Go to user management"
            >
              <MdMoreVert size={24} />
            </button>
          </div>
        </div>

        {/* Card 3: Total Donations */}
        <div className="bg-white rounded-xl shadow-sm p-4 relative overflow-hidden">
          <div className="flex justify-between items-start">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-secondary/20 flex items-center justify-center">
                <MdPayments className="text-secondary" size={24} />
              </div>
              <div>
                <p className="text-sm text-gray-500">Total Donations this Month</p>
                <h3 className="text-lg font-semibold">PHP {stats.totalDonations.toLocaleString()}</h3>
              </div>
            </div>
            <button
              className="text-gray-400"
              onClick={() => navigate('/donation-management')}
              aria-label="Go to donation management"
            >
              <MdMoreVert size={24} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardCards;
