import React from 'react';
import { Link } from 'react-router-dom';
import Footer from '../common/Footer';
import Navbar from '../common/Navbar';

const Home = () => {
  return (
    <div className="font-poppins">
      <Navbar />
      {/* Hero Section with Background Image */}
      <section className="relative h-screen">
        {/* Background Image with Overlay */}
        <div 
          className="absolute inset-0 bg-cover bg-center" 
          style={{ 
            backgroundImage: 'url("/assets/home_hero.jpg")',
            backgroundPosition: 'center',
          }}
        >
          <div className="absolute inset-0 bg-black opacity-50"></div>
        </div>

        {/* Hero Content */}
        <div className="relative z-10 container mx-auto px-4 h-full flex flex-col justify-center">
          <div className="max-w-2xl text-white">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4">
              Your small help makes the world <span className="text-secondary">better</span>
            </h1>
            <p className="text-xl mb-8 text-white/90">
              Join Ligaya and UST UVU to advocate for children's rights, education, and well-being.
              Together, we can create lasting positive change.
            </p>
            <Link to="/signup" className="inline-block px-8 py-3 bg-secondary text-white font-bold rounded-full text-lg hover:bg-secondary/80 transition-all duration-300">
              Volunteer Now
            </Link>
          </div>
        </div>
      </section>

     {/* How You Could Take Part Section */}
     <section className="py-20 bg-gradient-to-b from-white to-gray-50">
      <div className="container mx-auto px-4">
        {/* Quote Section */}
        <div className="text-center mb-16 max-w-3xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold text-primary mb-3 leading-tight italic">"Nothing You Do For Children Is Ever Wasted"</h2>
          <p className="text-2xl text-primary mb-8 italic">- Garrison Keillor</p>
          <div className="w-24 h-1 bg-yellow-400 mx-auto mb-8"></div>
          <p className="text-xl text-gray-700">Be part of our advocacy and help us make a difference.</p>
        </div>    
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Option 1 */}
          <div className="bg-white rounded-lg p-6 text-center shadow-lg hover:shadow-xl transition-all duration-300 border-t-4 border-primary transform hover:-translate-y-1 flex flex-col h-full">
            <div className="w-20 h-20 mx-auto mb-6 bg-primary/10 rounded-full flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-primary mb-3">Be one of us</h3>
            <p className="text-gray-600 mb-6 flex-grow">Help us to promote and uphold children's rights. Be part of our growing family!</p>
            <div className="mt-auto">
              <Link to="/register" className="inline-block px-8 py-3 bg-secondary text-white font-semibold uppercase tracking-wider rounded-full hover:bg-secondary/80 transition-all duration-300 text-sm">
                Register Now
              </Link>
            </div>
          </div>
          
          {/* Option 2 */}
          <div className="bg-white rounded-lg p-6 text-center shadow-lg hover:shadow-xl transition-all duration-300 border-t-4 border-primary transform hover:-translate-y-1 flex flex-col h-full">
            <div className="w-20 h-20 mx-auto mb-6 bg-primary/10 rounded-full flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-primary mb-3">Be our Ally</h3>
            <p className="text-gray-600 mb-6 flex-grow">Collaborate with us and help each other fulfill the advocacies of our organizations!</p>
            <div className="mt-auto">
              <Link to="/events" className="inline-block px-8 py-3 bg-secondary text-white font-semibold uppercase tracking-wider rounded-full hover:bg-secondary/80 transition-all duration-300 text-sm">
                Find Events
              </Link>
            </div>
          </div>
          
          {/* Option 3 */}
          <div className="bg-white rounded-lg p-6 text-center shadow-lg hover:shadow-xl transition-all duration-300 border-t-4 border-primary transform hover:-translate-y-1 flex flex-col h-full">
            <div className="w-20 h-20 mx-auto mb-6 bg-primary/10 rounded-full flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-primary mb-3">Support our Advocacy</h3>
            <p className="text-gray-600 mb-6 flex-grow">Together, we will make a difference in children's lives. Support our advocacies and programs!</p>
            <div className="mt-auto">
              <Link to="/collaborate" className="inline-block px-8 py-3 bg-secondary text-white font-semibold uppercase tracking-wider rounded-full hover:bg-secondary/80 transition-all duration-300 text-sm">
                Start Now
              </Link>
            </div>
          </div>
          
          {/* Option 4 */}
          <div className="bg-white rounded-lg p-6 text-center shadow-lg hover:shadow-xl transition-all duration-300 border-t-4 border-primary transform hover:-translate-y-1 flex flex-col h-full">
            <div className="w-20 h-20 mx-auto mb-6 bg-primary/10 rounded-full flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-primary mb-3">Be a Blessing</h3>
            <p className="text-gray-600 mb-6 flex-grow">As a volunteer, your gift brings hope—support our programs and brighten a child's future.</p>
            <div className="mt-auto">
              <Link to="/donate" className="inline-block px-8 py-3 bg-secondary text-white font-semibold uppercase tracking-wider rounded-full hover:bg-secondary/80 transition-all duration-300 text-sm">
                Lend a Hand
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>

      {/* Mission Statement with Improved Layout */}
      <section className="py-16 bg-blue-50">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <div className="flex flex-col md:flex-row items-center">
              <div className="md:w-1/2 mb-8 md:mb-0 md:pr-8">
                <h2 className="text-3xl font-bold text-primary mb-4">Our Mission</h2>
                <p className="text-lg text-gray-700 mb-6">
                  Ligaya works with UST Volunteers for UNICEF to create meaningful connections between volunteers and children in need. 
                  We support Sustainable Development Goal 4 (Quality Education) and Goal 3 (Good Health and Well-being).
                </p>
                <Link to="/about" className="inline-block px-8 py-3 bg-primary text-white font-semibold rounded-full hover:bg-primary/80 transition-all duration-300">
                  Learn More
                </Link>
              </div>
              
              <div className="md:w-1/2 grid grid-cols-2 gap-4">
                {/* Stat Box 1 */}
                <div className="bg-white p-6 rounded-lg shadow-md text-center">
                  <div className="text-4xl font-bold text-primary mb-2">20+</div>
                  <div className="text-secondary font-semibold">Programs</div>
                  <p className="text-gray-600 text-sm">Active initiatives</p>
                </div>
                
                {/* Stat Box 2 */}
                <div className="bg-white p-6 rounded-lg shadow-md text-center">
                  <div className="text-4xl font-bold text-primary mb-2">700+</div>
                  <div className="text-secondary font-semibold">Volunteers</div>
                  <p className="text-gray-600 text-sm">And growing every day</p>
                </div>
                
                {/* Stat Box 3 */}
                <div className="bg-white p-6 rounded-lg shadow-md text-center">
                  <div className="text-4xl font-bold text-primary mb-2">50+</div>
                  <div className="text-secondary font-semibold">Events</div>
                  <p className="text-gray-600 text-sm">Annual activities</p>
                </div>
                
                {/* Stat Box 4 */}
                <div className="bg-white p-6 rounded-lg shadow-md text-center">
                  <div className="text-4xl font-bold text-primary mb-2">500+</div>
                  <div className="text-secondary font-semibold">Children</div>
                  <p className="text-gray-600 text-sm">Helped so far</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Programs */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-primary mb-4 text-center">Featured Programs</h2>
          <p className="text-lg max-w-3xl mx-auto mb-12 text-center text-gray-700">
            Discover our impactful initiatives dedicated to improving children's welfare
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Program Card 1 */}
            <div className="card bg-base-100 shadow-xl hover:shadow-2xl transition-shadow duration-300">
              <figure className="h-48">
                <img src="/assets/educ.jpg" alt="Education program" className="w-full h-full object-cover" />
              </figure>
              <div className="card-body">
                <h3 className="card-title text-primary">
                  Educational Support
                  <div className="badge badge-secondary">SDG 4</div>
                </h3>
                <p>Providing learning materials, tutoring, and educational activities to underprivileged children.</p>
              </div>
            </div>
            
            {/* Program Card 2 */}
            <div className="card bg-base-100 shadow-xl hover:shadow-2xl transition-shadow duration-300">
              <figure className="h-48">
                <img src="/assets/food and nutri.jpg" alt="Health program" className="w-full h-full object-cover" />
              </figure>
              <div className="card-body">
                <h3 className="card-title text-primary">
                  Health & Nutrition
                  <div className="badge badge-secondary">SDG 3</div>
                </h3>
                <p>Providing healthcare awareness, nutrition programs, and wellness activities for children.</p>
              </div>
            </div>
            
            {/* Program Card 3 */}
            <div className="card bg-base-100 shadow-xl hover:shadow-2xl transition-shadow duration-300">
              <figure className="h-48">
                <img src="/assets/advocacy.jpg" alt="Advocacy program" className="w-full h-full object-cover" />
              </figure>
              <div className="card-body">
                <h3 className="card-title text-primary">
                  Child Advocacy
                  <div className="badge badge-secondary">SDG 3 & 4</div>
                </h3>
                <p>Raising awareness about children's rights and advocating for policies that protect their welfare.</p>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Call to Action */}
      <section className="py-20 bg-neutral relative overflow-hidden">
        <div className="container mx-auto px-4 relative z-10">
          <div className="bg-primary/95 rounded-xl p-8 md:p-12 shadow-2xl max-w-5xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-neutral mb-6">Ready to Make a Difference?</h2>
            <p className="text-lg text-neutral/90 mb-8 max-w-3xl mx-auto">
              Join our community of passionate volunteers and help us create positive change in children's lives. 
              Whether you have a few hours or a few days to spare, your contribution matters.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link to="/volunteer" className="inline-block px-8 py-3 bg-secondary text-white font-semibold rounded-full hover:bg-secondary/80 transition-all duration-300">
                Become a Volunteer
              </Link>
            </div>
          </div>
        </div>
        
        {/* Background decoration */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-secondary/20 rounded-full -mr-32 -mt-16"></div>
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-primary/10 rounded-full -ml-40 -mb-40"></div>
      </section>
      <Footer />
    </div>
  );
};

export default Home;