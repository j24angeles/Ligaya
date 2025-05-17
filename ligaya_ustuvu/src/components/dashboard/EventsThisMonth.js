// src/components/dashboard/EventsThisMonth.js
import React, { useMemo } from 'react';

const EventsThisMonth = ({ events }) => {
  const upcomingEvents = useMemo(() => {
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth();
    const currentYear = currentDate.getFullYear();
    
    // Filter events for the current month
    return events
      .filter(event => {
        // Check if event has a date field and is published if applicable
        if (!event.date) return false;
        
        const eventDate = new Date(event.date);
        return (
          eventDate.getMonth() === currentMonth && 
          eventDate.getFullYear() === currentYear &&
          (event.isPublished === undefined || event.isPublished === true)
        );
      })
      // Sort by date ascending
      .sort((a, b) => {
        return new Date(a.date) - new Date(b.date);
      })
      // Limit to 5 events
      .slice(0, 5);
  }, [events]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      month: '2-digit',
      day: '2-digit',
      year: 'numeric'
    }).format(date);
  };

  return (
    <div className="bg-white rounded-lg shadow p-6 h-full">
      <h3 className="text-lg font-medium text-gray-700 mb-4">Events this Month</h3>
      
      {upcomingEvents.length > 0 ? (
        <div className="space-y-4">
          {upcomingEvents.map((event) => (
            <div key={event.id} className="border-b border-gray-200 pb-4 last:border-b-0 last:pb-0">
              <div className="flex justify-between items-center">
                <h4 className="font-medium text-primary">{event.title || 'Outreach Program'}</h4>
                <span className="text-gray-600 text-sm">{formatDate(event.date)}</span>
              </div>
              {event.location && (
                <p className="text-sm text-gray-600 mt-1">{event.location}</p>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-6 text-gray-500">
          <p>No events scheduled for this month</p>
        </div>
      )}
      
      <div className="mt-4 text-center">
        <button className="text-accent hover:text-primary transition-colors font-medium text-sm">
          View All Events
        </button>
      </div>
    </div>
  );
};

export default EventsThisMonth;