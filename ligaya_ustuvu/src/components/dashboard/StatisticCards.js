// src/components/dashboard/StatisticsCards.js
import React, { useMemo } from 'react';

const StatisticsCards = ({ donations, events }) => {
  const statistics = useMemo(() => {
    // Calculate current month and previous month dates
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth();
    const currentYear = currentDate.getFullYear();
    const prevMonth = currentMonth === 0 ? 11 : currentMonth - 1;
    const prevYear = currentMonth === 0 ? currentYear - 1 : currentYear;

    // Filter events and donations by month
    const filterByMonth = (items, month, year) => 
      items.filter(item => {
        const date = new Date(item.date || item.createdAt);
        return date.getMonth() === month && date.getFullYear() === year;
      });

    // Current month data
    const currentMonthEvents = filterByMonth(events, currentMonth, currentYear);
    const currentMonthDonations = filterByMonth(donations, currentMonth, currentYear);
    const currentVerifiedDonations = currentMonthDonations.filter(d => d.isValidated);
    const currentPendingDonations = currentMonthDonations.filter(d => !d.isValidated);

    // Previous month data
    const prevMonthEvents = filterByMonth(events, prevMonth, prevYear);
    const prevMonthDonations = filterByMonth(donations, prevMonth, prevYear);
    const prevVerifiedDonations = prevMonthDonations.filter(d => d.isValidated);
    const prevPendingDonations = prevMonthDonations.filter(d => !d.isValidated);

    // Calculate unique volunteers (current month only)
    const uniqueVolunteers = new Set();
    currentMonthEvents.forEach(event => {
      if (event.volunteers?.length) {
        event.volunteers.forEach(v => uniqueVolunteers.add(v.id));
      }
    });

    // Calculate percentage changes
    const calculateChange = (current, previous) => {
      if (previous === 0) return current === 0 ? '0%' : '∞%';
      const change = ((current - previous) / previous) * 100;
      return `${change > 0 ? '+' : ''}${change.toFixed(2)}%`;
    };

    return {
      volunteers: {
        count: uniqueVolunteers.size,
        change: calculateChange(uniqueVolunteers.size, 
          new Set(prevMonthEvents.flatMap(e => e.volunteers?.map(v => v.id) || [])).size)
      },
      events: {
        count: currentMonthEvents.length,
        change: calculateChange(currentMonthEvents.length, prevMonthEvents.length)
      },
      verifiedDonations: {
        count: currentVerifiedDonations.length,
        change: calculateChange(currentVerifiedDonations.length, prevVerifiedDonations.length)
      },
      pendingDonations: {
        count: currentPendingDonations.length,
        change: calculateChange(currentPendingDonations.length, prevPendingDonations.length)
      }
    };
  }, [donations, events]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
      {/* Volunteers Card */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-medium text-gray-700 mb-2">Volunteers</h3>
        <div className="flex flex-col">
          <span className="text-3xl font-bold text-primary mb-1">
            {statistics.volunteers.count.toLocaleString()}
          </span>
          <span className={`text-sm font-medium ${statistics.volunteers.change.startsWith('+') ? 'text-green-600' : statistics.volunteers.change.startsWith('-') ? 'text-red-600' : 'text-gray-600'}`}>
            {statistics.volunteers.change} from last month
          </span>
        </div>
      </div>

      {/* Events Card */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-medium text-gray-700 mb-2">Events</h3>
        <div className="flex flex-col">
          <span className="text-3xl font-bold text-primary mb-1">
            {statistics.events.count.toLocaleString()}
          </span>
          <span className={`text-sm font-medium ${statistics.events.change.startsWith('+') ? 'text-green-600' : statistics.events.change.startsWith('-') ? 'text-red-600' : 'text-gray-600'}`}>
            {statistics.events.change} from last month
          </span>
        </div>
      </div>

      {/* Verified Donations Card */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-medium text-gray-700 mb-2">Verified Donations</h3>
        <div className="flex flex-col">
          <span className="text-3xl font-bold text-primary mb-1">
            {statistics.verifiedDonations.count.toLocaleString()}
          </span>
          <span className={`text-sm font-medium ${statistics.verifiedDonations.change.startsWith('+') ? 'text-green-600' : statistics.verifiedDonations.change.startsWith('-') ? 'text-red-600' : 'text-gray-600'}`}>
            {statistics.verifiedDonations.change} from last month
          </span>
        </div>
      </div>

      {/* Pending Donations Card */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-medium text-gray-700 mb-2">Pending Donations</h3>
        <div className="flex flex-col">
          <span className="text-3xl font-bold text-primary mb-1">
            {statistics.pendingDonations.count.toLocaleString()}
          </span>
          <span className={`text-sm font-medium ${statistics.pendingDonations.change.startsWith('+') ? 'text-green-600' : statistics.pendingDonations.change.startsWith('-') ? 'text-red-600' : 'text-gray-600'}`}>
            {statistics.pendingDonations.change} from last month
          </span>
        </div>
      </div>
    </div>
  );
};

export default StatisticsCards;