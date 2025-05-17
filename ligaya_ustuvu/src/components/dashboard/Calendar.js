import React, { useState } from 'react';
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

  const hasEvent = (date) => {
    if (!events || !events.length) return false;

    return events.some((event) => {
      const eventDate = new Date(event.date);
      return (
        eventDate.getFullYear() === date.getFullYear() &&
        eventDate.getMonth() === date.getMonth() &&
        eventDate.getDate() === date.getDate()
      );
    });
  };

  const getEventForDate = (date) => {
    if (!events || !events.length) return null;

    return events.find((event) => {
      const eventDate = new Date(event.date);
      return (
        eventDate.getFullYear() === date.getFullYear() &&
        eventDate.getMonth() === date.getMonth() &&
        eventDate.getDate() === date.getDate()
      );
    });
  };

  const handleDateClick = (day) => {
    setSelectedDate(day.date);
    const event = getEventForDate(day.date);
    setEventModal({
      open: true,
      event,
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
    <div className="bg-white rounded-xl shadow-sm p-4">
      <div className="flex justify-between items-center mb-4">
        <button onClick={prevMonth} className="p-2 rounded-full hover:bg-gray-100">
          <MdChevronLeft size={24} />
        </button>
        <h3 className="font-semibold">{getMonthName()}</h3>
        <button onClick={nextMonth} className="p-2 rounded-full hover:bg-gray-100">
          <MdChevronRight size={24} />
        </button>
      </div>

      <div className="grid grid-cols-7 gap-1 mb-2">
        {weekdays.map((day, index) => (
          <div key={index} className="text-center text-xs font-medium text-gray-500 py-1">
            {day}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {days.map((day, index) => (
          <button
            key={index}
            onClick={() => handleDateClick(day)}
            className={`relative h-10 flex items-center justify-center text-sm rounded-full transition-colors
              ${!day.currentMonth ? 'text-gray-400' : ''}
              ${
                day.date.getDate() === new Date().getDate() &&
                day.date.getMonth() === new Date().getMonth() &&
                day.date.getFullYear() === new Date().getFullYear()
                  ? 'bg-primary text-white'
                  : 'hover:bg-gray-100'
              }
              ${hasEvent(day.date) ? 'font-bold' : ''}
            `}
          >
            {day.date.getDate()}
            {hasEvent(day.date) && (
              <span className="absolute bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-secondary rounded-full"></span>
            )}
          </button>
        ))}
      </div>

      {eventModal.open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">
                {selectedDate?.toLocaleDateString('default', {
                  month: 'long',
                  day: 'numeric',
                  year: 'numeric',
                })}
              </h3>
              <button onClick={closeEventModal} className="text-gray-500 hover:text-gray-700">
                <MdClose size={20} />
              </button>
            </div>

            {eventModal.event ? (
              <div>
                <h4 className="font-semibold text-lg mb-2">{eventModal.event.title}</h4>
                <p className="text-gray-600 mb-2">{eventModal.event.description}</p>
                <div className="flex items-center gap-2 text-gray-600 mb-1">
                  <MdSchedule size={18} />
                  <span>{eventModal.event.time}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <MdPlace size={18} />
                  <span>{eventModal.event.location}</span>
                </div>
                {eventModal.event.volunteers && (
                  <div className="mt-4">
                    <h5 className="font-medium mb-2">
                      Registered Volunteers ({eventModal.event.volunteers.length})
                    </h5>
                    <ul className="list-disc list-inside">
                      {eventModal.event.volunteers.map((volunteer, idx) => (
                        <li key={idx} className="text-sm">
                          {volunteer.name}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ) : (
              <p className="text-gray-600">No event on this date.</p>
            )}

            <div className="mt-6 flex justify-end">
              <button
                onClick={closeEventModal}
                className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Calendar;
