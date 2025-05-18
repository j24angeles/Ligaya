// src/components/dashboard/EventsCarousel.js
import React, { useState, useEffect } from 'react';
import { MdChevronLeft, MdChevronRight, MdCalendarToday } from 'react-icons/md';
import { useAuth } from '../../context/AuthContext';

const EventsCarousel = ({ events = [] }) => {
  const { user } = useAuth();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [filteredEvents, setFilteredEvents] = useState([]);

  useEffect(() => {
    if (!Array.isArray(events) || events.length === 0) {
      setFilteredEvents([]);
      return;
    }

    const filterEvents = () => {
      if (!user || !user.id) {
        return events.filter(event => event.isPublished !== false);
      }

      return events.filter(event => {
        if (event.isPublished === false) return false;

        if ((event.userId && String(event.userId) === String(user.id)) ||
            (event.creatorId && String(event.creatorId) === String(user.id))) {
          return false;
        }

        if (Array.isArray(event.volunteers)) {
          const isVolunteer = event.volunteers.some(volunteer => {
            const volunteerId = volunteer?.id || volunteer;
            return String(volunteerId) === String(user.id);
          });
          if (isVolunteer) return false;
        }

        if (Array.isArray(user.eventsJoined)) {
          const isJoined = user.eventsJoined.some(eventId =>
            String(eventId) === String(event.id));
          if (isJoined) return false;
        }

        return true;
      });
    };

    const result = filterEvents();
    setFilteredEvents(result);

    if (currentIndex >= result.length && result.length > 0) {
      setCurrentIndex(0);
    }
  }, [events, user, currentIndex]);

  if (!filteredEvents || filteredEvents.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-4 text-center">
        <p className="text-gray-500 text-sm">
          {user ? "No new events available" : "Log in to see available events"}
        </p>
      </div>
    );
  }

  const nextSlide = () => setCurrentIndex(prev =>
    prev >= filteredEvents.length - 1 ? 0 : prev + 1
  );

  const prevSlide = () => setCurrentIndex(prev =>
    prev === 0 ? filteredEvents.length - 1 : prev - 1
  );

  const getVisibleEvents = () => {
    if (filteredEvents.length <= 3) return [...filteredEvents];
    return Array.from({ length: 3 }, (_, i) =>
      filteredEvents[(currentIndex + i) % filteredEvents.length]
    );
  };

  const visibleEvents = getVisibleEvents();
  const showNavigation = filteredEvents.length > 3;

  const formatEventDate = (date, time) => {
    if (!date) return 'Date TBD';
    try {
      const options = { month: 'short', day: 'numeric' };
      const formatted = new Date(date).toLocaleDateString('en-US', options);
      return time ? `${formatted} • ${time}` : formatted;
    } catch {
      return 'Date TBD';
    }
  };

  const renderEventImage = (event) => {
    const imgSrc = event.bannerImage || event.image;
    return (
    <div className="h-[110px] min-h-[110px] bg-gray-100 overflow-hidden">
        {imgSrc ? (
          <img
            src={imgSrc}
            alt={event.title || 'Event'}
            className="w-full h-full object-cover"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">
            Event Image
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="relative">
      <div className="flex justify-between items-center mb-3 px-1">
        <h2 className="font-bold text-lg">Discover More Events</h2>
        {showNavigation && (
          <div className="flex space-x-2">
            <button onClick={prevSlide} className="rounded-full w-7 h-7 border border-gray-300 flex items-center justify-center hover:bg-gray-50">
              <MdChevronLeft size={16} className="text-gray-600" />
            </button>
            <button onClick={nextSlide} className="rounded-full w-7 h-7 border border-gray-300 flex items-center justify-center hover:bg-gray-50">
              <MdChevronRight size={16} className="text-gray-600" />
            </button>
          </div>
        )}
      </div>

      <div className="flex space-x-3">
        {visibleEvents.map((event, idx) => (
          <div key={event.id || idx} className="flex-1 bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden flex flex-col h-48">
            {renderEventImage(event)}
            <div className="p-2">
              <div className="mb-1">
                <span className="inline-block bg-yellow-100 text-yellow-800 text-[10px] px-1.5 py-0.5 rounded-full flex items-center">
                  <MdCalendarToday className="mr-1" size={10} />
                  {formatEventDate(event.date, event.time)}
                </span>
              </div>
              <h3 className="font-medium text-gray-900 text-xs mb-1 line-clamp-2">
                {event.title || 'Untitled Event'}
              </h3>
              <p className="text-gray-600 text-[11px] line-clamp-2">
                {event.description || 'No description available'}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default EventsCarousel;
