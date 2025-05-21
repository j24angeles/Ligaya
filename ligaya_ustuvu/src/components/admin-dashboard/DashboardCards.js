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
      const currentMonth = now.getMonth();
      const currentYear = now.getFullYear();

      // Count upcoming events
      const upcomingEventsCount = events.filter(event => {
        return event.date && new Date(event.date) > now && event.isPublished !== false;
      }).length;

      // Count active volunteers
      const volunteerCount = users.filter(user => {
        return user.role === 'volunteer' && user.status !== 'archived';
      }).length;

      // Calculate total donations - ABSOLUTELY NO ARCHIVED DONATIONS
      const totalDonationsAmount = donations
        .filter(donation => {
          // First check if donation is archived - this takes priority over everything
          if (donation.status === 'archived') {
            return false; // Immediately exclude if archived
          }
          
          // Then check validation status
          if (donation.validationStatus !== 'validated') {
            return false;
          }
          
          // Finally check date
          const donationDate = new Date(donation.createdAt);
          return (
            donationDate.getMonth() === currentMonth &&
            donationDate.getFullYear() === currentYear
          );
        })
        .reduce((sum, donation) => {
          const amount = parseFloat(donation.amount) || 0;
          return sum + amount;
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
          <h3 className="text-lg md:text-xl font-medium mb-1">Empowering Child Advocacy</h3>
          <h3 className="text-lg md:text-xl font-medium">Behind the Scenes</h3>
        </div>
      </div>

      {/* Dashboard Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {/* Card 1: Upcoming Events */}
        <div className="bg-white rounded-xl shadow-sm p-3 relative overflow-hidden">
          <div className="flex justify-between items-start">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-secondary/20 flex items-center justify-center">
                <MdEvent className="text-secondary" size={20} />
              </div>
              <div>
                <p className="text-xs text-gray-500">Upcoming Events</p>
                <h3 className="text-base font-semibold">{stats.upcomingEvents} Upcoming Events</h3>
              </div>
            </div>
            <button
              className="text-gray-400"
              onClick={() => navigate('/event-management')}
              aria-label="Go to event management"
            >
              <MdMoreVert size={20} />
            </button>
          </div>
        </div>

        {/* Card 2: Volunteer Count */}
        <div className="bg-white rounded-xl shadow-sm p-3 relative overflow-hidden">
          <div className="flex justify-between items-start">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-secondary/20 flex items-center justify-center">
                <MdPeople className="text-secondary" size={20} />
              </div>
              <div>
                <p className="text-xs text-gray-500">Volunteer Count</p>
                <h3 className="text-base font-semibold">{stats.totalVolunteers} Volunteers</h3>
              </div>
            </div>
            <button
              className="text-gray-400"
              onClick={() => navigate('/user-management')}
              aria-label="Go to user management"
            >
              <MdMoreVert size={20} />
            </button>
          </div>
        </div>

        {/* Card 3: Total Donations */}
        <div className="bg-white rounded-xl shadow-sm p-3 relative overflow-hidden">
          <div className="flex justify-between items-start">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-secondary/20 flex items-center justify-center">
                <MdPayments className="text-secondary" size={20} />
              </div>
              <div>
                <p className="text-xs text-gray-500">Total Donations this Month</p>
                <h3 className="text-base font-semibold">₱{stats.totalDonations.toLocaleString()}</h3>
              </div>
            </div>
            <button
              className="text-gray-400"
              onClick={() => navigate('/donation-management')}
              aria-label="Go to donation management"
            >
              <MdMoreVert size={20} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardCards;