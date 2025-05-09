import { useState } from 'react';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const textShadowStyle = { textShadow: '1px 1px 2px rgba(0, 0, 0, 0.2)' };

  return (
<nav className="sticky top-0 z-50 bg-white text-primary shadow-md">
<div className="max-w-full mx-auto px-6 sm:px-8 lg:px-12">
        <div className="flex items-center justify-between h-20">
          {/* Left section: Logo and nav links */}
          <div className="flex items-center">
            {/* Logo and text */}
            <a href="/home" className="flex items-center flex-shrink-0 hover:opacity-90 transition">
              <img src="../assets/logo_navbar.png" alt="Ligaya" className="h-12 w-12 mr-2" />
              <span className="text-primary font-bold text-xl" style={textShadowStyle}>Ligaya</span>
            </a>

            {/* Desktop Navigation Items */}
            <div className="hidden md:block ml-8">
              <div className="flex items-baseline space-x-8">
                {['home', 'about-us', 'devs'].map((item, i) => (
                  <a
                    key={i}
                    href={`/${item}`}
                    className="px-3 py-2 text-sm font-medium hover:text-accent transition"
                    style={textShadowStyle}
                  >
                    {item === 'devs' ? 'Team' : item === 'about-us' ? 'About Us' : item.charAt(0).toUpperCase() + item.slice(1).replace('-', ' ')}
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Right section: Auth buttons */}
          <div className="hidden md:block">
            <div className="flex items-center">
              <a
                href="/login"
                className="text-primary hover:brightness-90 text-sm font-medium mr-6 transition duration-200"
                style={textShadowStyle}
              >
                Login
              </a>
              <a
                href="/signup"
                className="bg-secondary text-primary px-8 py-2 rounded-full text-sm font-medium transition duration-200 hover:brightness-90"
                style={textShadowStyle}
              >
                Sign Up
              </a>
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={toggleMenu}
              className="inline-flex items-center justify-center p-2 rounded-md text-neutral hover:text-secondary hover:bg-accent focus:outline-none transition"
            >
              <span className="sr-only">Open main menu</span>
              <svg
                className={`${isMenuOpen ? 'hidden' : 'block'} h-6 w-6`}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
              <svg
                className={`${isMenuOpen ? 'block' : 'hidden'} h-6 w-6`}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div className={`${isMenuOpen ? 'block' : 'hidden'} md:hidden`}>
        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
          {['home', 'about-us', 'events', 'history', 'devs'].map((item, i) => (
            <a
              key={i}
              href={`/${item}`}
              className="block px-3 py-2 rounded-md text-base font-medium text-primary hover:bg-gray-100 transition"
              style={textShadowStyle}
            >
              {item === 'devs' ? 'Team' : item === 'events' ? 'Our Events' : item === 'history' ? 'The History' : item.charAt(0).toUpperCase() + item.slice(1).replace('-', ' ')}
            </a>
          ))}
        </div>
        <div className="pt-4 pb-3 border-t border-gray-200">
          <div className="flex items-center px-5">
            <a
              href="/login"
              className="text-primary hover:brightness-90 text-sm font-medium w-full text-center transition"
              style={textShadowStyle}
            >
              Login
            </a>
          </div>
          <div className="flex items-center px-5 mt-3">
            <a
              href="/signup"
              className="bg-secondary text-white px-8 py-2 rounded-full text-sm font-medium shadow transition duration-200 hover:brightness-90"
              style={textShadowStyle}
            >
              Sign Up
            </a>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
