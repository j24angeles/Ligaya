import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, MapPin, Clock, AlertCircle } from 'lucide-react';

const VisitorEventDetailContent = ({ event }) => {
  const formatDate = (dateString) => {
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Check if event is in the past
  const isEventInPast = (eventDate) => {
    if (!eventDate) return false;
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Reset time to start of day for accurate date comparison
    const eventDay = new Date(eventDate);
    return eventDay < today;
  };

  const isPastEvent = isEventInPast(event.date);

  return (
    <>
      {/* Hero Section with Event Image */}
      <section className="relative pt-16 pb-24">
        {/* Background Image with Overlay */}
        <div 
          className="absolute inset-0 bg-cover bg-center" 
          style={{ 
            backgroundImage: event.imageUrl ? `url("${event.imageUrl}")` : 'url("/assets/event_default.jpg")',
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-black/50"></div>
        </div>
        
        {/* Content */}
        <div className="container mx-auto px-4 relative z-10">
          <Link 
            to="/events" 
            className="inline-flex items-center text-white mb-6 hover:text-secondary transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
            </svg>
            Back to Events
          </Link>
          
          {/* Event Title and Basic Info */}
          <div className="max-w-4xl">
            {/* Event status badge */}
            {isPastEvent ? (
              <span className="inline-block px-4 py-1 text-sm font-semibold text-white bg-gray-600 rounded-full mb-4">
                Past Event
              </span>
            ) : (
              event.category && (
                <span className="inline-block px-4 py-1 text-sm font-semibold text-white bg-secondary rounded-full mb-4">
                  {event.category.charAt(0).toUpperCase() + event.category.slice(1)}
                </span>
              )
            )}
            
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">{event.title}</h1>
            
            <div className="flex flex-wrap gap-6 text-white/90 mb-8">
              <div className="flex items-center">
                <Calendar size={20} className="mr-2" />
                <span>{event.date ? formatDate(event.date) : 'Date TBA'}</span>
              </div>
              
              {event.time && (
                <div className="flex items-center">
                  <Clock size={20} className="mr-2" />
                  <span>{event.time}</span>
                </div>
              )}
              
              <div className="flex items-center">
                <MapPin size={20} className="mr-2" />
                <span>{event.location || 'Location TBA'}</span>
              </div>
            </div>
            
            {isPastEvent ? (
              <div className="inline-flex items-center px-6 py-3 bg-gray-600 text-white font-medium rounded-full">
                <AlertCircle size={20} className="mr-2" />
                This event has already taken place
              </div>
            ) : (
              <div className="inline-flex items-center px-6 py-3 bg-green-600 text-white font-medium rounded-full">
                <Calendar size={20} className="mr-2" />
                Upcoming Event
              </div>
            )}
          </div>
        </div>
      </section>
      
      {/* Event Details Content */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Main Content */}
            <div className="lg:w-2/3">
              <div className="bg-white rounded-lg shadow-md p-8 mb-8">
                <h2 className="text-2xl font-bold text-primary mb-4">Event Details</h2>
                <div className="prose max-w-none text-gray-700">
                  <p className="text-lg mb-6">{event.description || 'Join us for this special event that aims to make a positive impact in children\'s lives.'}</p>
                  
                  {event.detailedDescription && (
                    <div className="mt-6">
                      <p>{event.detailedDescription}</p>
                    </div>
                  )}
                  
                  {/* Additional content sections */}
                  {event.agenda && event.agenda.length > 0 && (
                    <div className="mt-8">
                      <h3 className="text-xl font-semibold text-primary mb-4">Event Agenda</h3>
                      <ul className="list-disc pl-5 space-y-2">
                        {event.agenda.map((item, index) => (
                          <li key={index}>{item}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                  
                  {event.requirements && (
                    <div className="mt-8">
                      <h3 className="text-xl font-semibold text-primary mb-4">Requirements</h3>
                      <p>{event.requirements}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
            
            {/* Sidebar */}
            <div className="lg:w-1/3">
              {/* Event Information Card */}
              <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                <h3 className="text-xl font-bold text-primary mb-4">Event Information</h3>
                
                <ul className="space-y-4">
                  <li className="flex items-start">
                    <Calendar size={20} className="text-secondary mr-3 mt-0.5" />
                    <div>
                      <span className="block text-gray-500 text-sm">Date</span>
                      <span className="block text-gray-800 font-medium">{event.date ? formatDate(event.date) : 'Date TBA'}</span>
                    </div>
                  </li>
                  
                  {event.time && (
                    <li className="flex items-start">
                      <Clock size={20} className="text-secondary mr-3 mt-0.5" />
                      <div>
                        <span className="block text-gray-500 text-sm">Time</span>
                        <span className="block text-gray-800 font-medium">{event.time}</span>
                      </div>
                    </li>
                  )}
                  
                  <li className="flex items-start">
                    <MapPin size={20} className="text-secondary mr-3 mt-0.5" />
                    <div>
                      <span className="block text-gray-500 text-sm">Location</span>
                      <span className="block text-gray-800 font-medium">{event.location || 'Location TBA'}</span>
                    </div>
                  </li>
                  
                  {event.organizer && (
                    <li className="flex items-start">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-secondary mr-3 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                      <div>
                        <span className="block text-gray-500 text-sm">Organizer</span>
                        <span className="block text-gray-800 font-medium">{event.organizer}</span>
                      </div>
                    </li>
                  )}
                  
                  {event.contacts && (
                    <li className="flex items-start">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-secondary mr-3 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                      <div>
                        <span className="block text-gray-500 text-sm">Contact</span>
                        <span className="block text-gray-800 font-medium">{event.contacts}</span>
                      </div>
                    </li>
                  )}
                </ul>
                
                {isPastEvent && (
                  <div className="mt-6 pt-6 border-t border-gray-200">
                    <div className="flex items-center justify-center p-3 bg-gray-100 text-gray-700 rounded-md">
                      <AlertCircle size={18} className="mr-2" />
                      This event has already taken place
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Information Section - Replaced CTA */}
      <section className="bg-blue-50 py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-primary mb-4">Learn More About Our Events</h2>
          <p className="text-lg text-gray-700 mb-8 max-w-2xl mx-auto">
            This is an example of our event showcase. We host various events throughout the year
            to support children in need and create positive community impact.
          </p>
          <Link 
            to="/events"
            className="inline-block px-8 py-3 bg-secondary text-white font-bold rounded-full text-lg hover:bg-secondary/80 transition-all duration-300"
          >
            View All Events
          </Link>
        </div>
      </section>
    </>
  );
};

export default VisitorEventDetailContent;