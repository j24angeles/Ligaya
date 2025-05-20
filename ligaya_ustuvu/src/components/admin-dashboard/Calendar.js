import React, { useState, useEffect } from 'react';
import {
  MdChevronLeft,
  MdChevronRight,
  MdClose,
  MdSchedule,
  MdPlace,
} from 'react-icons/md';

const Calendar = ({ events }) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  const [eventModal, setEventModal] = useState({
    open: false,
    event: null,
  });
  const [isSmallScreen, setIsSmallScreen] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsSmallScreen(window.innerWidth < 640);
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const generateCalendarDays = () => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();

    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startingDayOfWeek = firstDay.getDay();

    const prevMonthDays = [];
    if (startingDayOfWeek > 0) {
      const prevMonth = new Date(year, month, 0);
      const prevMonthLastDay = prevMonth.getDate();

      for (let i = prevMonthLastDay - startingDayOfWeek + 1; i <= prevMonthLastDay; i++) {
        prevMonthDays.push({
          date: new Date(year, month - 1, i),
          currentMonth: false,
        });
      }
    }

    const currentMonthDays = [];
    for (let i = 1; i <= lastDay.getDate(); i++) {
      currentMonthDays.push({
        date: new Date(year, month, i),
        currentMonth: true,
      });
    }

    const nextMonthDays = [];
    const totalDaysDisplayed = prevMonthDays.length + currentMonthDays.length;
    const remainingDays = 42 - totalDaysDisplayed;

    for (let i = 1; i <= remainingDays; i++) {
      nextMonthDays.push({
        date: new Date(year, month + 1, i),
        currentMonth: false,
      });
    }

    return [...prevMonthDays, ...currentMonthDays, ...nextMonthDays];
  };

  // Fixed date comparison function
  const isSameDate = (date1, date2) => {
    if (!date1 || !date2) return false;
    
    const d1 = new Date(date1);
    let d2;
    
    if (typeof date2 === 'string') {
      // Parse date string (from JSON) and create date at local timezone
      const parts = date2.split('-');
      d2 = new Date(parts[0], parts[1] - 1, parts[2]);
    } else {
      d2 = new Date(date2);
    }
    
    return (
      d1.getFullYear() === d2.getFullYear() &&
      d1.getMonth() === d2.getMonth() &&
      d1.getDate() === d2.getDate()
    );
  };

  const hasEvent = (date) => {
    if (!events || !events.length) return false;
    return events.some(event => isSameDate(date, event.date));
  };

  const getEventForDate = (date) => {
    if (!events || !events.length) return null;
    return events.find(event => isSameDate(date, event.date));
  };

  const handleDateClick = (day) => {
    setSelectedDate(day.date);
    const event = getEventForDate(day.date);
    setEventModal({
      open: true,
      event: event || null,
    });
  };

  const prevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
  };

  const nextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
  };

  const getMonthName = () => {
    return currentMonth.toLocaleString('default', { month: 'long', year: 'numeric' });
  };

  const closeEventModal = () => {
    setEventModal({
      open: false,
      event: null,
    });
  };

  const days = generateCalendarDays();
  const weekdays = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];

  return (
    <div className="bg-white rounded-xl shadow-sm p-4 h-full flex flex-col">
      <div className="flex justify-between items-center mb-4">
        <button onClick={prevMonth} className="p-1 rounded-full hover:bg-gray-100">
          <MdChevronLeft size={16} />
        </button>
        <h3 className="font-semibold text-base">
          {getMonthName()}
        </h3>
        <button onClick={nextMonth} className="p-1 rounded-full hover:bg-gray-100">
          <MdChevronRight size={16} />
        </button>
      </div>

      <div className="grid grid-cols-7 gap-[1px] mb-1">
        {weekdays.map((day, index) => (
          <div key={index} className="text-center text-xs font-medium text-gray-500 py-0.5 select-none">
            {day}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-[1px] flex-grow">
        {days.map((day, index) => (
          <button
            key={index}
            onClick={() => handleDateClick(day)}
            className={`relative h-8 flex items-center justify-center text-sm rounded-full transition-colors
              ${!day.currentMonth ? 'text-gray-400' : ''}
              ${
                isSameDate(day.date, new Date())
                  ? 'bg-primary text-white'
                  : 'hover:bg-gray-100'
              }
              ${hasEvent(day.date) ? 'font-semibold' : ''}
            `}
          >
            {day.date.getDate()}
            {hasEvent(day.date) && (
              <span className="absolute bottom-1 left-1/2 transform -translate-x-1/2 w-1.5 h-1.5 bg-secondary rounded-full"></span>
            )}
          </button>
        ))}
      </div>

     {eventModal.open && (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
        <div className={`bg-white rounded-md p-4 mx-4 ${isSmallScreen ? 'w-full' : 'max-w-lg w-full'}`}>
          <div className="flex justify-between items-center mb-2">
            <h3 className="font-semibold text-sm">
              {selectedDate?.toLocaleDateString('default', {
                month: 'long',
                day: 'numeric',
                year: 'numeric',
              })}
            </h3>
            <button onClick={closeEventModal} className="text-gray-500 hover:text-gray-700">
              <MdClose size={16} />
            </button>
          </div>

          <hr className="mb-2" />

          {eventModal.event ? (
            <>
              <table className="w-full text-sm text-left text-gray-700 mb-3">
                <tbody>
                  <tr>
                    <td className="font-medium pr-2 align-top">Event Title:</td>
                    <td>{eventModal.event.title || 'N/A'}</td>
                  </tr>
                  {eventModal.event.description && (
                    <tr>
                      <td className="font-medium pr-2 align-top">Event Details:</td>
                      <td>{eventModal.event.description}</td>
                    </tr>
                  )}
                  {eventModal.event.time && (
                    <tr>
                      <td className="font-medium pr-2 align-top">Event Time:</td>
                      <td className="flex items-center gap-1">
                        <MdSchedule size={14} />
                        {eventModal.event.time}
                      </td>
                    </tr>
                  )}
                  {eventModal.event.location && (
                    <tr>
                      <td className="font-medium pr-2 align-top">Venue:</td>
                      <td className="flex items-center gap-1">
                        <MdPlace size={14} />
                        {eventModal.event.location}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>

              {eventModal.event.volunteers && eventModal.event.volunteers.length > 0 && (
                <div className="mt-2">
                  <h5 className="font-medium mb-1">
                    Registered Volunteers ({eventModal.event.volunteers.length})
                  </h5>
                  <ul className="list-disc list-inside text-xs">
                    {eventModal.event.volunteers.map((volunteer, idx) => (
                      <li key={idx}>{volunteer.name}</li>
                    ))}
                  </ul>
                </div>
              )}
            </>
          ) : (
            <p className="text-gray-600">No event on this date.</p>
          )}

          <hr className="my-4" />

          <div className="flex justify-end">
            {/* Action buttons can go here if needed */}
          </div>
        </div>
      </div>
    )}
  </div>
  );
};

export default Calendar;