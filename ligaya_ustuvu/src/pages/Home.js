import React from 'react';
import { Link } from 'react-router-dom';
import Footer from '../common/Footer';

const Home = () => {
  return (
<div className="font-poppins">
{/* Hero Section */}
      <section className="bg-primary text-neutral min-h-screen pt-16 shadow-lg">
        <div className="container mx-auto px-4 flex flex-col justify-center min-h-[calc(100vh-4rem)] lg:flex-row items-center">
          <div className="lg:w-1/2 mb-10 lg:mb-0 lg:pr-10">
          <h1
  className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6"
  style={{ textShadow: '2px 2px 4px rgba(0, 0, 0, 1)' }}>
  Make a <span className="text-secondary">Difference</span> in Children's Lives
</h1>

            <p className="text-lg mb-8">
              Join Ligaya and UST UVU to advocate for children's rights, education, and well-being.
              Together, we can create lasting positive change.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link to="/signup" className="btn btn-secondary text-primary font-bold">
                Volunteer Now
              </Link>
            </div>
          </div>
          <div className="lg:w-1/2">
            <div className="relative">
              {/* Placeholder for hero image - you'll add the real one */}
              <div className="w-full h-96 lg:h-[28rem] bg-accent rounded-lg overflow-hidden shadow-xl">
                <img src="/assets/home_hero.jpg" alt="Children volunteers" className="w-full h-full object-cover" />
              </div>
              <div className="absolute -bottom-6 -right-6 bg-secondary p-4 rounded-lg shadow-lg">
                <p className="text-primary font-bold">500+ Children Helped</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission Statement */}
      <section className="py-16 bg-neutral">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-primary mb-4"  style={{ textShadow: '2px 2px 4px rgba(0, 0, 0, 0.2)' }}>Our Mission</h2>
          <p className="text-lg max-w-3xl mx-auto mb-10 text-gray-700">
            Ligaya works with UST Volunteers for UNICEF to create meaningful connections between volunteers and children in need. 
            We support Sustainable Development Goal 4 (Quality Education) and Goal 3 (Good Health and Well-being).
          </p>
          <div className="flex flex-wrap justify-center gap-8">
            <div className="stats shadow">
              <div className="stat bg-primary text-neutral">
                <div className="stat-figure text-secondary">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="inline-block w-8 h-8 stroke-current">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                </div>
                <div className="stat-title">Programs</div>
                <div className="stat-value">20+</div>
                <div className="stat-desc">Active initiatives</div>
              </div>
              
              <div className="stat bg-primary text-neutral">
                <div className="stat-figure text-secondary">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="inline-block w-8 h-8 stroke-current">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"></path>
                  </svg>
                </div>
                <div className="stat-title">Volunteers</div>
                <div className="stat-value">700+</div>
                <div className="stat-desc">And growing every day</div>
              </div>
              
              <div className="stat bg-primary text-neutral">
                <div className="stat-figure text-secondary">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="inline-block w-8 h-8 stroke-current">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"></path>
                  </svg>
                </div>
                <div className="stat-title">Events</div>
                <div className="stat-value">50+</div>
                <div className="stat-desc">Annual activities</div>
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
                <div className="card-actions justify-end mt-4">
                  <button className="btn btn-primary btn-sm">Learn More</button>
                </div>
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
                <div className="card-actions justify-end mt-4">
                  <button className="btn btn-primary btn-sm">Learn More</button>
                </div>
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
                <div className="card-actions justify-end mt-4">
                  <button className="btn btn-primary btn-sm">Learn More</button>
                </div>
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
              <Link to="/volunteer" className="btn btn-secondary text-primary btn-lg">
                Become a Volunteer
              </Link>
              <Link to="/donate" className="btn btn-outline border-2 border-neutral text-neutral btn-lg hover:bg-accent">
                Support Our Cause
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