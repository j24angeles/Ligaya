import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../common/Navbar';
import Footer from '../common/Footer';

const AboutUs = () => {
  const [activeSlide, setActiveSlide] = useState(0);
  const [isVisible, setIsVisible] = useState({});
  
  const galleryImages = [
    '/assets/aboutus-pics/1.jpg',
    '/assets/aboutus-pics/2.jpg',
    '/assets/aboutus-pics/3.jpg', 
    '/assets/aboutus-pics/4.jpg',
    '/assets/aboutus-pics/5.jpg',
    '/assets/aboutus-pics/6.jpg', 
    '/assets/aboutus-pics/7.jpg',
    '/assets/aboutus-pics/8.jpg',
    '/assets/aboutus-pics/9.jpg',
    '/assets/aboutus-pics/10.jpg',
    '/assets/aboutus-pics/11.jpg',
    '/assets/aboutus-pics/12.jpg',
  ];
  
  const achievements = [
    { number: 19, text: 'Years of Service' },
    { number: 8, text: 'Award and Achievements' },
    { number: 200, text: 'Children Helped' },
    { number: 5, text: 'Major Programs' },
  ];
  
  useEffect(() => {
    const observerOptions = {
      root: null,
      rootMargin: '0px',
      threshold: 0.2,
    };
    
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        setIsVisible(prev => ({
          ...prev,
          [entry.target.id]: entry.isIntersecting
        }));
      });
    }, observerOptions);
    
    // Observe elements that should trigger animations
    const sections = document.querySelectorAll('.animate-on-scroll');
    sections.forEach(section => observer.observe(section));
    
    // Auto-advance gallery
    const interval = setInterval(() => {
      setActiveSlide(prev => (prev + 1) % galleryImages.length);
    }, 5000);
    
    return () => {
      sections.forEach(section => observer.unobserve(section));
      clearInterval(interval);
    };
  }, [galleryImages.length]);
  
  return (
    <div className="font-poppins min-h-screen flex flex-col">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative h-screen w-full flex items-center justify-center">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: "url('/assets/aboutus_hero.png')" }}
        >
          <div className="absolute inset-0 bg-black/60"></div>
        </div>
        
        <div className="container mx-auto px-4 relative z-10 text-center">
          <h1 className="text-5xl md:text-7xl font-bold text-secondary mb-6 tracking-tight">
            About Us
          </h1>
          
          <div className="max-w-3xl mx-auto mb-8 opacity-90">
            <p className="text-xl md:text-2xl italic text-white leading-relaxed">
              "You Are Braver Than You Believe, Stronger Than You Seem, And Smarter Than You Think"
            </p>
            <p className="text-lg text-white/80 mt-2">- A.A. Milne</p>
          </div>
        </div>
        
      </section>
      
      {/* Our Story Section */}
      <section className="py-20 bg-white relative overflow-hidden">
        <div 
          className="absolute inset-0 bg-fixed bg-cover bg-center opacity-5"
        ></div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="flex flex-col md:flex-row items-center gap-12">
            <div className="md:w-1/2">
              <div className="relative">
                <img 
                  src="/assets/aboutus-pics/mission-pic.jpg" 
                  alt="UST Volunteers for UNICEF" 
                  className="rounded-lg shadow-xl w-full"
                />
                <div className="absolute -bottom-6 -right-6 bg-primary text-white p-4 rounded-lg shadow-lg">
                  <p className="text-4xl font-bold">19</p>
                  <p className="text-sm uppercase tracking-wider">Years of Service</p>
                </div>
              </div>
            </div>
            
            <div className="md:w-1/2">
              <h2 className="text-3xl md:text-4xl font-bold text-primary mb-6">Our Story</h2>
              
              <p className="text-lg text-gray-700 leading-relaxed mb-6">
                For entirely 19 consecutive years, UST Volunteers for UNICEF, whose prime advocacy is upholding children's rights, 
                commits itself in instilling a heart of service to the Thomasian community and lead them to be a champion of children's rights.
              </p>
              
              <div className="bg-blue-50 border-l-4 border-primary p-4 rounded-r-lg mb-8">
                <p className="text-xl italic text-gray-700">
                  "The True Character of a Society is Revealed in How it treats its Children"
                </p>
                <p className="text-right text-gray-500 mt-2">-Nelson Mandela</p>
              </div>
              
              <div className="flex items-center gap-4">
                <div className="h-0.5 flex-grow bg-gradient-to-r from-primary to-transparent"></div>
                <Link 
                  to="/events" 
                  className="inline-block px-6 py-2 bg-primary text-white font-medium rounded-full hover:bg-primary/80 transition"
                >
                  See Our Events
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Vision & Mission Section */}
<section id="mission" className="py-16 bg-white relative">
  <div className="container mx-auto px-4 relative z-10">
    <div className="text-center max-w-3xl mx-auto mb-12">
      <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4">
        <span className="relative inline-block pb-2">
          Vision & Mission
          <span className="absolute bottom-0 left-0 w-full h-1 bg-primary/30"></span>
        </span>
      </h2>
    </div>
    
    <div className="grid md:grid-cols-2 gap-8">
      {/* Vision Card */}
      <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all border-l-4 border-primary">
        <div className="p-8">
          <div className="flex items-center mb-6">
            <div className="bg-primary/10 p-3 rounded-lg mr-4 text-primary">
              <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z"/>
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-gray-800">Our Vision</h3>
          </div>
          <p className="text-gray-600 pl-16">
            The UST Volunteers for UNICEF envisions to be the primary partner of the University of Santo Tomas in promoting 
            and upholding children's rights.
          </p>
        </div>
      </div>
      
      {/* Mission Card */}
      <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all border-l-4 border-secondary">
        <div className="p-8">
          <div className="flex items-center mb-6">
            <div className="bg-secondary/10 p-3 rounded-lg mr-4 text-secondary">
              <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"/>
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-gray-800">Our Mission</h3>
          </div>
          <p className="text-gray-600 pl-16">
            The UST Volunteers for UNICEF commits itself in providing programs that develop the whole Thomasian 
            community in uplifting the conditions of the children in the Philippines under the principles of UNICEF.
          </p>
        </div>
      </div>
    </div>
  </div>
</section>
      
      
      {/* Impact Numbers */}
      <section className="py-16 bg-primary text-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Our Impact</h2>
            <div className="w-20 h-1 bg-secondary mx-auto"></div>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {achievements.map((achievement, index) => (
              <div key={index} className="p-4">
                <div className="text-4xl md:text-5xl font-bold mb-2">{achievement.number}+</div>
                <p className="text-lg text-white/80">{achievement.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Gallery Section */}
      <section id="gallery" className="py-20 bg-white animate-on-scroll">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4">Our Memories</h2>
            <p className="text-lg text-gray-600">
              A glimpse into our journey of making a difference in children's lives through various programs and initiatives.
            </p>
          </div>
          
          {/* Gallery Carousel */}
          <div className="relative overflow-hidden rounded-xl shadow-xl">
            {/* Main Featured Image */}
            <div className="relative h-96 md:h-[32rem]">
              {galleryImages.map((img, index) => (
                <div 
                  key={index} 
                  className={`absolute inset-0 transition-opacity duration-1000 ${
                    activeSlide === index ? 'opacity-100' : 'opacity-0'
                  }`}
                >
                  <img 
                    src={img} 
                    alt={`Gallery image ${index + 1}`} 
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
              
              {/* Navigation Arrows */}
              <button 
                className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition"
                onClick={() => setActiveSlide(prev => (prev === 0 ? galleryImages.length - 1 : prev - 1))}
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              
              <button 
                className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition"
                onClick={() => setActiveSlide(prev => (prev + 1) % galleryImages.length)}
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
            
            {/* Thumbnail Navigation */}
            <div className="flex overflow-x-auto gap-2 p-4 bg-gray-900">
              {galleryImages.map((img, index) => (
                <button 
                  key={index} 
                  className={`flex-shrink-0 w-20 h-20 md:w-24 md:h-24 transition transform hover:scale-105 ${
                    activeSlide === index ? 'ring-2 ring-secondary scale-105' : 'opacity-70'
                  }`}
                  onClick={() => setActiveSlide(index)}
                >
                  <img 
                    src={img} 
                    alt={`Thumbnail ${index + 1}`} 
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          </div>
          
          {/* Interactive Gallery Grid */}
          <div className="hidden md:grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-12">
            {galleryImages.map((img, index) => (
              <div 
                key={index} 
                className="relative overflow-hidden rounded-lg group cursor-pointer h-64"
                onClick={() => setActiveSlide(index)}
              >
                <img 
                  src={img} 
                  alt={`Gallery image ${index + 1}`} 
                  className="w-full h-full object-cover transition duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                  <button className="bg-white/90 text-primary p-3 rounded-full transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Achievements Section */}
      <section className="py-20 bg-gray-50 animate-on-scroll" id="achievements-section">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4">Our Achievements</h2>
            <p className="text-lg text-gray-600">
              Recognition of our commitment to upholding children's rights and community service.
            </p>
          </div>
          
          <div className="relative max-w-4xl mx-auto">
\            <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-primary"></div>
            
            {/* Timeline Items */}
            <div className="space-y-12">
              <div className="relative pl-8 md:pl-0">
                <div className="md:flex md:items-center">
                  <div className="md:w-1/2 md:pr-8 md:text-right hidden md:block"></div>
                  
                  <div className="absolute left-0 md:left-1/2 top-0 md:-translate-x-1/2 bg-primary rounded-full w-4 h-4 mt-2"></div>
                  
                  <div className="md:w-1/2 md:pl-8">
                    <div className="bg-white p-6 rounded-lg shadow-lg border-l-4 border-primary">
                      <h3 className="text-xl font-bold text-primary mb-2">Recognition by National Youth Commission</h3>
                      <p className="text-gray-600">
                        Officially recognized by the National Youth Commission for outstanding youth-led initiatives.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="relative pl-8 md:pl-0">
                <div className="md:flex md:items-center">
                  <div className="md:w-1/2 md:pr-8 md:text-right">
                    <div className="bg-white p-6 rounded-lg shadow-lg border-r-4 border-primary">
                      <h3 className="text-xl font-bold text-primary mb-2">Pope Leo XIII Awards</h3>
                      <p className="text-gray-600">
                        Received Pope Leo XIII for Community Development Award by UST Office of the Secretary General for 9 consecutive years.
                      </p>
                    </div>
                  </div>
                  
                  <div className="absolute left-0 md:left-1/2 top-0 md:-translate-x-1/2 bg-primary rounded-full w-4 h-4 mt-2"></div>
                  
                  <div className="md:w-1/2 md:pl-8 hidden md:block"></div>
                </div>
              </div>
              
              <div className="relative pl-8 md:pl-0">
                <div className="md:flex md:items-center">
                  <div className="md:w-1/2 md:pr-8 md:text-right hidden md:block"></div>
                  
                  <div className="absolute left-0 md:left-1/2 top-0 md:-translate-x-1/2 bg-primary rounded-full w-4 h-4 mt-2"></div>
                  
                  <div className="md:w-1/2 md:pl-8">
                    <div className="bg-white p-6 rounded-lg shadow-lg border-l-4 border-primary">
                      <h3 className="text-xl font-bold text-primary mb-2">Tradition of Excellence Award</h3>
                      <p className="text-gray-600">
                        Received the Tradition of Excellence Award for A.Y. 2017-2018 by University of Santo Tomas.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="relative pl-8 md:pl-0">
                <div className="md:flex md:items-center">
                  <div className="md:w-1/2 md:pr-8 md:text-right">
                    <div className="bg-white p-6 rounded-lg shadow-lg border-r-4 border-primary">
                      <h3 className="text-xl font-bold text-primary mb-2">St. Dominic De Guzman Award</h3>
                      <p className="text-gray-600">
                        Awarded the St. Dominic De Guzman Award for A.Y. 2016-2017 by University of Santo Tomas.
                      </p>
                    </div>
                  </div>
                  
                  <div className="absolute left-0 md:left-1/2 top-0 md:-translate-x-1/2 bg-primary rounded-full w-4 h-4 mt-2"></div>
                  
                  <div className="md:w-1/2 md:pl-8 hidden md:block"></div>
                </div>
              </div>
              
              <div className="relative pl-8 md:pl-0">
                <div className="md:flex md:items-center">
                  <div className="md:w-1/2 md:pr-8 md:text-right hidden md:block"></div>
                  
                  <div className="absolute left-0 md:left-1/2 top-0 md:-translate-x-1/2 bg-primary rounded-full w-4 h-4 mt-2"></div>
                  
                  <div className="md:w-1/2 md:pl-8">
                    <div className="bg-white p-6 rounded-lg shadow-lg border-l-4 border-primary">
                      <h3 className="text-xl font-bold text-primary mb-2">Organization of the Year Award</h3>
                      <p className="text-gray-600">
                        Organization of the Year Award for A.Y. 2016-2017 by the UST Student Organizations Coordinating Council.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="relative pl-8 md:pl-0">
                <div className="md:flex md:items-center">
                  <div className="md:w-1/2 md:pr-8 md:text-right">
                    <div className="bg-white p-6 rounded-lg shadow-lg border-r-4 border-primary">
                      <h3 className="text-xl font-bold text-primary mb-2">Top 5 Most Outstanding Youth Organizations</h3>
                      <p className="text-gray-600">
                        One of the Top 5 Most Outstanding Youth Organizations in the Philippines conducted by AISEC Youth Leadership Awards 2015.
                      </p>
                    </div>
                  </div>
                  
                  <div className="absolute left-0 md:left-1/2 top-0 md:-translate-x-1/2 bg-primary rounded-full w-4 h-4 mt-2"></div>
                  
                  <div className="md:w-1/2 md:pl-8 hidden md:block"></div>
                </div>
              </div>
              
              <div className="relative pl-8 md:pl-0">
                <div className="md:flex md:items-center">
                  <div className="md:w-1/2 md:pr-8 md:text-right hidden md:block"></div>
                  
                  <div className="absolute left-0 md:left-1/2 top-0 md:-translate-x-1/2 bg-primary rounded-full w-4 h-4 mt-2"></div>
                  
                  <div className="md:w-1/2 md:pl-8">
                    <div className="bg-white p-6 rounded-lg shadow-lg border-l-4 border-primary">
                      <h3 className="text-xl font-bold text-primary mb-2">Most Number of Recruits Award</h3>
                      <p className="text-gray-600">
                        Most Number of Recruits Award for A.Y. 2013-2014, A.Y. 2015-2016 and A.Y. 2016-2017 by the UST Student Organizations Coordinating Council.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="relative pl-8 md:pl-0">
                <div className="md:flex md:items-center">
                  <div className="md:w-1/2 md:pr-8 md:text-right">
                    <div className="bg-white p-6 rounded-lg shadow-lg border-r-4 border-primary">
                      <h3 className="text-xl font-bold text-primary mb-2">Most Outstanding University-Wide Student Organization</h3>
                      <p className="text-gray-600">
                        Most Outstanding University-Wide Student Organization for A.Y. 2011-2012 by UST Office for Student Affairs.
                      </p>
                    </div>
                  </div>
                  
                  <div className="absolute left-0 md:left-1/2 top-0 md:-translate-x-1/2 bg-primary rounded-full w-4 h-4 mt-2"></div>
                  
                  <div className="md:w-1/2 md:pl-8 hidden md:block"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
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
      
      <Footer />
    </div>
  );
};

export default AboutUs;