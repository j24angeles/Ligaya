import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { getUserEvents } from '../../api/eventService';
import { MdEvent, MdCalendarToday, MdLocationOn } from 'react-icons/md';

const UpcomingEventsTable = () => {
  const { user } = useAuth();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserEvents = async () => {
      if (!user || !user.id) return;

      try {
        setLoading(true);
        const userEvents = await getUserEvents(user.id);

        const now = new Date();
        const upcoming = userEvents.filter((event) => {
          // Filter out archived events and make sure the date is in the future
          if (!event.date || event.status === 'archived') return false;
          const eventDate = new Date(event.date);
          return eventDate > now;
        });

        upcoming.sort((a, b) => new Date(a.date) - new Date(b.date));

        setEvents(upcoming);
        setError(null);
      } catch (err) {
        console.error('Error fetching user events:', err);
        setError('Failed to load your events. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchUserEvents();
  }, [user]);

 const formatDateTime = (dateString, timeString) => {
  if (!dateString) return 'Date not set';

  try {
    const date = new Date(dateString);
    const options = {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true, 
    };

    // Format with date and time
    let formatted = date.toLocaleString('en-US', options);

    // Replace time only if a custom time string is provided
    if (timeString) {
      formatted = formatted.replace(/\d{1,2}:\d{2}\s?(AM|PM)/i, timeString);
    }

    return formatted;
  } catch (e) {
    return 'Invalid date';
  }
};


  const TableWrapper = ({ children }) => (
    <div className="bg-white rounded-md h-full">
      <h3 className="font-semibold mb-3 text-sm flex items-center">
        <MdEvent className="mr-2" size={14} />
        Your Upcoming Events
      </h3>
      {children}
    </div>
  );

  if (!user) {
    return (
      <TableWrapper>
        <div className="text-center text-gray-500 my-4 text-xs">
          Please log in to view your events.
        </div>
      </TableWrapper>
    );
  }

  if (loading) {
    return (
      <TableWrapper>
        <div className="text-center text-gray-500 my-4 text-xs">
          Loading your events...
        </div>
      </TableWrapper>
    );
  }

  if (error) {
    return (
      <TableWrapper>
        <div className="text-center text-red-500 my-4 text-xs">{error}</div>
      </TableWrapper>
    );
  }

  if (events.length === 0) {
    return (
      <TableWrapper>
        <div className="text-center text-gray-500 my-4 text-xs">
          You don't have any upcoming events.
        </div>
      </TableWrapper>
    );
  }

  return (
    <TableWrapper>
      <div className="overflow-x-auto">
        <table className="w-full text-xs">
          <thead>
            <tr className="text-left uppercase text-gray-500">
              <th className="px-2 py-1">Event</th>
              <th className="px-2 py-1">Date & Time</th>
              <th className="px-2 py-1">Location</th>
            </tr>
          </thead>
          <tbody>
            {events.map((event, index) => (
              <tr
                key={event.id}
                className={`border-t border-gray-100 ${
                  index === events.length - 1 ? '' : ''
                }`}
              >
                <td className="px-2 py-1">
                  <div className="font-medium">{event.title || 'Untitled Event'}</div>
                  
                </td>
                <td className="px-2 py-1 text-gray-600">
                  <div className="flex items-center">
                    <MdCalendarToday className="mr-1 text-gray-400" size={14} />
                    {formatDateTime(event.date, event.time)}
                  </div>
                </td>
                <td className="px-2 py-1">
                  <div className="flex items-center text-gray-600">
                    <MdLocationOn className="mr-1 text-gray-400" size={14} />
                    {event.location || 'TBA'}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </TableWrapper>
  );
};

export default UpcomingEventsTable;