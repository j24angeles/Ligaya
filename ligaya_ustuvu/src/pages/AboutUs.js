import React from 'react';
import Navbar from '../common/Navbar';
import Footer from '../common/Footer';

const AboutUs = () => {
  return (
    <div className="font-sans">
      <Navbar />

      {/* Fullscreen Hero Section */}
      <div className="relative min-h-screen flex flex-col md:flex-row">
        {/* Left Content - reduced white space */}
        <div className="w-full md:w-5/12 bg-white p-6 md:p-12 flex items-center">
          <div className="text-white">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Nice to meet you</h1>
            <p className="text-lg">
              Ligaya is a heartfelt collaboration with UST UVU, born from a shared desire to bring joy and support to every child in need.
              We believe in empowering youth, creating impact, and fostering hope through volunteerism and community action.
            </p>
          </div>
        </div>

        {/* Right Image - increased width and coverage */}
        <div className="w-full md:w-7/12 relative">
          <div className="h-full w-full">
            <img
              src="../assets/login_bg.png"
              alt="Ligaya Banner"
              className="w-full h-full object-cover"
            />
            {/* Optional gradient overlay */}
            <div
              className="absolute inset-0"
              style={{
                background: 'linear-gradient(to right, rgba(255,255,255,0.7), rgba(255,255,255,0))',
              }}
            />
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default AboutUs;
