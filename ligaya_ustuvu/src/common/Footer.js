import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-primary text-neutral font-garet py-8">
      <div className="container mx-auto px-4">
        {/* Main Footer */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {/* Logo and Social */}
          <div className="flex flex-col items-center text-center">
          <div className="flex items-center mb-2">
  <img src="/assets/logo_notext.png" alt="Ligaya Logo" className="w-12 h-12 mr-2" />
  <h3 className="font-bold text-xl text-secondary">Ligaya</h3>
</div>
            <p className="text-neutral/80 text-sm mb-2">
              Connecting passionate volunteers with impactful child advocacy initiatives since 2019.
            </p>
            <div className="flex space-x-3 mt-2">
              {['facebook', 'twitter', 'instagram', 'linkedin'].map(platform => (
                <a key={platform} href={`https://${platform}.com`} className="btn btn-circle btn-xs bg-secondary/90 hover:bg-secondary text-primary border-0">
                  <span className="sr-only">{platform}</span>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="currentColor" viewBox="0 0 24 24">
                    {platform === 'facebook' && <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z" />}
                    {platform === 'twitter' && <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z" />}
                    {platform === 'instagram' && <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />}
                    {platform === 'linkedin' && <path d="M4.98 3.5c0 1.381-1.11 2.5-2.48 2.5s-2.48-1.119-2.48-2.5c0-1.38 1.11-2.5 2.48-2.5s2.48 1.12 2.48 2.5zm.02 4.5h-5v16h5v-16zm7.982 0h-4.968v16h4.969v-8.399c0-4.67 6.029-5.052 6.029 0v8.399h4.988v-10.131c0-7.88-8.922-7.593-11.018-3.714v-2.155z" />}
                  </svg>
                </a>
              ))}
            </div>
          </div>
          
          {/* Quick Links */}
          <div className="flex flex-col items-center">
            <h3 className="font-bold text-lg mb-3 flex items-center">
              <span className="w-6 h-1 bg-secondary rounded-full block mr-2"></span>
              Quick Links
            </h3>
            <ul className="space-y-1">
  <li className="transition-transform duration-300 hover:translate-x-1">
    <Link 
      to="/home" 
      className="hover:text-secondary transition-colors flex items-center"
    >
      <svg xmlns="http://www.w3.org/2000/svg" className="h-2 w-2 mr-1 text-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
      </svg>
      Home
    </Link>
  </li>
  <li className="transition-transform duration-300 hover:translate-x-1">
    <Link 
      to="/about-us" 
      className="hover:text-secondary transition-colors flex items-center"
    >
      <svg xmlns="http://www.w3.org/2000/svg" className="h-2 w-2 mr-1 text-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
      </svg>
      About Us
    </Link>
  </li>
  <li className="transition-transform duration-300 hover:translate-x-1">
    <Link 
      to="/devs" 
      className="hover:text-secondary transition-colors flex items-center"
    >
      <svg xmlns="http://www.w3.org/2000/svg" className="h-2 w-2 mr-1 text-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
      </svg>
      Our Team
    </Link>
  </li>
  <li className="transition-transform duration-300 hover:translate-x-1">
    <Link 
      to="/signup" 
      className="hover:text-secondary transition-colors flex items-center"
    >
      <svg xmlns="http://www.w3.org/2000/svg" className="h-2 w-2 mr-1 text-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
      </svg>
      Register
    </Link>
  </li>
  <li className="transition-transform duration-300 hover:translate-x-1">
    <Link 
      to="/login" 
      className="hover:text-secondary transition-colors flex items-center"
    >
      <svg xmlns="http://www.w3.org/2000/svg" className="h-2 w-2 mr-1 text-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
      </svg>
      Login
    </Link>
  </li>
</ul>

          </div>
          
          {/* Contact Info */}
          <div className="flex flex-col items-center">
            <h3 className="font-bold text-lg mb-3 flex items-center">
              <span className="w-6 h-1 bg-secondary rounded-full block mr-2"></span>
              Contact Us
            </h3>
            <ul className="space-y-2">
              <li className="flex items-center justify-center">
                <div className="bg-secondary/20 p-1 rounded mr-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <span className="text-sm">España Blvd, Manila, Philippines</span>
              </li>
              <li className="flex items-center justify-center">
                <div className="bg-secondary/20 p-1 rounded mr-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <span className="text-sm text-secondary font-semibold">contact@ligaya.org</span>
              </li>
              <li className="flex items-center justify-center">
                <div className="bg-secondary/20 p-1 rounded mr-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                </div>
                <span className="text-sm text-secondary font-semibold">(+63) 2-123-4567</span>
              </li>
            </ul>
          </div>
        </div>
        
        {/* #AllForTheKids Banner */}
        <div className="py-4 text-center">
          <span className="inline-block bg-secondary text-primary px-3 py-1 rounded-full font-bold text-sm">
            #AllForTheKids
          </span>
        </div>
        
        {/* Copyright */}
        <div className="border-t border-accent/30 mt-2 pt-4 text-center">
          <p className="text-xs text-neutral/70">
            © {new Date().getFullYear()} Ligaya. All rights reserved.
          </p>
          <ul className="flex justify-center gap-x-4 mt-1 text-xs text-neutral/70">
            <li><Link to="/privacy" className="hover:text-secondary">Privacy Policy</Link></li>
            <li><Link to="/terms" className="hover:text-secondary">Terms of Service</Link></li>
          </ul>
        </div>
      </div>
    </footer>
  );
};

export default Footer;