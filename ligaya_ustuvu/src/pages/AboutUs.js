import React from 'react';
import { Link } from 'react-router-dom';
import Footer from '../common/Footer';
import Navbar from '../common/Navbar';


const AboutUs = () => {
  return (
    <div className="font-poppins">
      <Navbar />

      {/* Hero Section with Background Image */}
      <section className="relative h-screen">
        {/* Background Image */}
        <div 
          className="absolute inset-0 bg-cover bg-center" 
          style={{ backgroundImage: 'url("/assets/aboutus_hero.png")' }}
        >
          <div className="absolute inset-0 bg-black opacity-50"></div>
        </div>

       {/* Hero Content (centered) */}
<div className="relative z-10 container mx-auto px-4 h-full flex flex-col justify-center items-center text-center">
  <div className="max-w-2xl text-white">
    <h1 className="text-secondary text-4xl md:text-5xl lg:text-6xl font-bold mb-4 [text-shadow:_0.5px_0.5px_1px_rgba(0,0,0,0.1)]">
      Nice to meet you!
    </h1>
    <p className="text-xl mb-8 text-white/90">
    We are Ligaya, a heartfelt collaboration with UST UVU, born from a shared desire to bring joy and support to every child in need.
    We believe in empowering youth and fostering hope through volunteerism and community action.
    </p>
   
  </div>
</div>

      </section>

      {/* Benefits Banner */}
      <div className="w-full bg-[#00539B] text-white py-4 flex flex-wrap justify-center">
        {[
          "Free shipping",
          "Members-only perks",
          "20% off every order",
          "Custom plans"
        ].map((text, index) => (
          <div key={index} className="flex items-center mx-4 my-2">
            <svg className="w-5 h-5 mr-2 text-[#1CABE2]" viewBox="0 0 24 24" fill="currentColor">
              <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" />
            </svg>
            <span>{text}</span>
          </div>
        ))}
      </div>

      {/* Mission Section */}
      <div className="bg-white py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-4xl font-bold mb-6 text-[#00539B]">Our Mission</h2>
            <p className="text-lg text-gray-700 mb-8">
              We believe hydration should be accessible, effective, and enjoyable for everyone.
              Through science-backed formulas and sustainable practices, we're redefining how the world stays hydrated.
            </p>
            <div className="inline-block bg-[#1CABE2] text-white font-bold py-3 px-6 rounded-full">
              Learn more about our story
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default AboutUs;
