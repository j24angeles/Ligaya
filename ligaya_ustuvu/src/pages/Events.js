import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getAllEvents } from '../api/eventService';
import Navbar from '../common/Navbar';
import Footer from '../common/Footer';
import { Calendar, Clock, MapPin } from 'lucide-react';
import VisitorEventCard from '../components/VisitorEventCard';

const Events = () => {
  const [events, setEvents] = useState([]);
  const [activeTab, setActiveTab] = useState('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);
        const eventsData = await getAllEvents();
        // Only filter for published events
        const publishedEvents = eventsData.filter(event => event.isPublished);
        setEvents(publishedEvents);
      } catch (err) {
        console.error('Failed to fetch events:', err);
        setError('Failed to load events. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  // Filter events based on active tab
  const filteredEvents = React.useMemo(() => {
    const currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0); // Reset time to start of day for accurate comparison
    
    // Filter by tab (all/upcoming/past)
    if (activeTab === 'all') {
      return events; // Show all events
    } else if (activeTab === 'upcoming') {
      return events.filter(event => new Date(event.date) >= currentDate);
    } else {
      return events.filter(event => new Date(event.date) < currentDate);
    }
  }, [events, activeTab]);

  const heroImages = {
  all: '/assets/all-events-hero.jpg',
  upcoming: '/assets/upcoming-events-hero.jpg',
  past: '/assets/past-events-hero.jpg'
};

  return (
    <div className="font-poppins min-h-screen flex flex-col bg-gray-50">
      <Navbar />
    
    {/* Hero Section */}
<section 
  className="relative py-40 bg-cover bg-center" 
  style={{ backgroundImage: `url(${heroImages[activeTab]})` }}
>
  <div className="absolute inset-0 bg-black/50"></div>
  <div className="container mx-auto px-4 relative z-10 text-center">
    <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
      {activeTab === 'all' ? 'Our Events' : 
       activeTab === 'upcoming' ? 'Upcoming Events' : 'Past Events'}
    </h1>
    <p className="text-xl text-white/90 max-w-2xl mx-auto">
      {activeTab === 'all'
        ? 'Discover all our events and make a difference in children\'s lives.'
        : activeTab === 'upcoming' 
          ? 'Discover opportunities to make a difference in children\'s lives.'
          : 'Explore our previous events and the impact we\'ve made together.'}
    </p>
  </div>
</section>

      {/* Container for centered content */}
      <div className="container mx-auto px-4">
        {/* Tab Navigation - Centered */}
        <div className="flex justify-center mt-8">
          <div className="bg-white rounded-lg shadow-sm p-1 inline-flex">
            <button 
              className={`px-6 py-2 rounded-md font-medium transition-colors ${
                activeTab === 'all' ? 'bg-primary text-white' : 'text-gray-700 hover:bg-gray-100'
              }`}
              onClick={() => setActiveTab('all')}
            >
              All Events
            </button>
            <button 
              className={`px-6 py-2 rounded-md font-medium transition-colors ${
                activeTab === 'upcoming' ? 'bg-primary text-white' : 'text-gray-700 hover:bg-gray-100'
              }`}
              onClick={() => setActiveTab('upcoming')}
            >
              Upcoming Events
            </button>
            <button 
              className={`px-6 py-2 rounded-md font-medium transition-colors ${
                activeTab === 'past' ? 'bg-primary text-white' : 'text-gray-700 hover:bg-gray-100'
              }`}
              onClick={() => setActiveTab('past')}
            >
              Past Events
            </button>
          </div>
        </div>

        {/* Events Listing */}
        <section className="py-8 flex-grow">
          {loading ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            </div>
          ) : error ? (
            <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 mb-8 rounded-r-lg">
              <p>{error}</p>
            </div>
          ) : filteredEvents.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-xl shadow-sm">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-gray-400 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <h3 className="text-xl font-semibold text-gray-600 mb-2">
                {activeTab === 'all' ? 'No events found' :
                activeTab === 'upcoming' ? 'No upcoming events found' : 'No past events found'}
              </h3>
              <p className="text-gray-500 mb-4">
                {activeTab === 'all' 
                  ? 'Please check back later for new events.'
                  : activeTab === 'upcoming' 
                    ? 'Please check back later for new events.' 
                    : 'We will add our past events archive soon.'}
              </p>
              {activeTab !== 'all' && (
                <button 
                  onClick={() => setActiveTab('all')}
                  className="px-4 py-2 bg-primary text-white font-medium rounded-lg hover:bg-primary/90 transition-colors"
                >
                  View All Events
                </button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredEvents.map((event) => (
                <VisitorEventCard key={event.id} event={event} />
              ))}
            </div>
          )}
        </section>
      </div>

      {/* Call to Action Section - Only show for upcoming events */}
      {activeTab === 'upcoming' && (
        <section className="bg-blue-50 py-16 mt-12">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold text-primary mb-4">Ready to Make a Difference?</h2>
            <p className="text-lg text-gray-700 mb-8 max-w-2xl mx-auto">
              Join our community of volunteers and help us create positive impact for children in need.
              Sign up today to volunteer for our events.
            </p>
            <Link
              to="/signup"
              className="inline-block px-8 py-3 bg-secondary text-white font-bold rounded-full text-lg hover:bg-secondary/80 transition-all duration-300"
            >
              Sign Up to Volunteer
            </Link>
          </div>
        </section>
      )}

      {/* Alternative CTA for Past Events Tab */}
      {activeTab === 'past' && (
        <section className="bg-gray-100 py-16 mt-12">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold text-primary mb-4">See Our Impact</h2>
            <p className="text-lg text-gray-700 mb-8 max-w-2xl mx-auto">
              Thanks to our volunteers and supporters, these past events have made a real difference.
              Join us for our upcoming events to continue this important work.
            </p>
            <button
              onClick={() => setActiveTab('upcoming')}
              className="inline-block px-8 py-3 bg-primary text-white font-bold rounded-full text-lg hover:bg-primary/90 transition-all duration-300"
            >
              View Upcoming Events
            </button>
          </div>
        </section>
      )}
      
      {/* Generic CTA for All Events Tab */}
      {activeTab === 'all' && (
        <section className="bg-blue-50 py-16 mt-12">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold text-primary mb-4">Join Our Community</h2>
            <p className="text-lg text-gray-700 mb-8 max-w-2xl mx-auto">
              Whether you're interested in our upcoming events or inspired by our past impact,
              there are many ways to get involved and make a difference.
            </p>
            <Link
              to="/signup"
              className="inline-block px-8 py-3 bg-secondary text-white font-bold rounded-full text-lg hover:bg-secondary/80 transition-all duration-300"
            >
              Sign Up to Volunteer
            </Link>
          </div>
        </section>
      )}

      <Footer />
    </div>
  );
};

export default Events;