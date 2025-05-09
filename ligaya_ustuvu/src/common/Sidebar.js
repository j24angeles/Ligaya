
import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; // Import the auth context

const Sidebar = ({ role = 'volunteer' }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useAuth(); // Get logout function from context
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  
  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
      if (window.innerWidth >= 1024) {
        setMobileMenuOpen(false);
      }
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  const handleLogout = () => {
    logout(); // Use the context logout function
    // Replace current history entry with login page
    navigate('/login', { replace: true });
  };

  const navItems = {
    admin: [
      { path: '/admin', label: 'Home', icon: 'home' },
      { path: '/user-management', label: 'Volunteer Management', icon: 'users' },
      { path: '/event-management', label: 'Event Management', icon: 'calendar' },
      { path: '/admin/donations', label: 'Donation Management', icon: 'heart' },
      { path: '/admin/settings', label: 'Settings', icon: 'settings' }
    ],
    volunteer: [
      { path: '/dashboard', label: 'Home', icon: 'home' },
      { path: '/events', label: 'Events', icon: 'calendar' },
      { path: '/donate', label: 'Donate', icon: 'heart' },
      { path: '/settings', label: 'Settings', icon: 'settings' }
    ]
  };

  const items = navItems[role] || navItems.volunteer;

  const getIcon = (iconName) => {
    const icons = {
      home: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
      ),
      users: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
      ),
      calendar: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      ),
      heart: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
        </svg>
      ),
      settings: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      ),
      menu: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      ),
      close: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      )
    };
    return icons[iconName] || null;
  };

  return (
    <>
      {/* Mobile menu button - Fixed at the top */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-primary h-16 lg:hidden flex items-center justify-between px-4 shadow-md">
        <div className="flex items-center">
          <img src="/assets/logo_notext.png" alt="Ligaya Logo" className="w-8 h-8" />
          <h3 className="font-bold text-xl text-secondary ml-2">Ligaya</h3>
        </div>
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="p-2 rounded-md text-secondary hover:bg-primary-dark transition-colors"
          aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
        >
          {mobileMenuOpen ? getIcon('close') : getIcon('menu')}
        </button>
      </div>

      {/* Sidebar - Always visible on desktop, conditionally visible on mobile */}
      <aside 
        className={`bg-primary text-neutral font-garet fixed left-0 top-0 bottom-0 z-40 shadow-lg w-64 
          ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'} 
          lg:translate-x-0 transition-transform duration-300 ease-in-out`}
      >
        {/* Logo section - Hidden on mobile to avoid duplicate */}
        <div className="hidden lg:flex justify-between items-center p-4 border-b border-accent/30">
          <div className="flex items-center">
            <img src="/assets/logo_notext.png" alt="Ligaya Logo" className="w-8 h-8" />
            <h3 className="font-bold text-xl text-secondary ml-2">Ligaya</h3>
          </div>
        </div>

        {/* Top space on mobile to avoid overlap with header */}
        <div className="h-16 lg:hidden"></div>

        {/* Role indicator */}
        <div className="py-3 px-4 bg-primary/90 border-b border-accent/30">
          <div className="flex items-center">
            <div className="bg-secondary/20 text-secondary uppercase font-bold rounded-full w-8 h-8 flex items-center justify-center">
              {role.charAt(0)}
            </div>
            <span className="ml-2 font-semibold capitalize">{role}</span>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="mt-4 overflow-y-auto" style={{ maxHeight: 'calc(100vh - 200px)' }}>
          <ul className="space-y-1 px-2">
            {items.map((item, index) => {
              const isActive = location.pathname === item.path;
              return (
                <li key={index}>
                  <Link
                    to={item.path}
                    onClick={() => windowWidth < 1024 && setMobileMenuOpen(false)}
                    className={`flex items-center py-3 px-4 rounded-lg transition-all duration-200 ${
                      isActive
                        ? 'bg-secondary text-primary font-medium'
                        : 'hover:bg-secondary/10'
                    }`}
                  >
                    <span className={`${isActive ? 'text-primary' : 'text-secondary'}`}>
                      {getIcon(item.icon)}
                    </span>
                    <span className="ml-3">{item.label}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Bottom section */}
        <div className="absolute bottom-4 w-full px-4">
          <button 
            className="flex items-center py-2 px-3 rounded-lg bg-secondary/10 hover:bg-secondary/20 text-secondary transition-all duration-200 w-full"
            onClick={handleLogout}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            <span className="ml-2">Logout</span>
          </button>
          
          <div className="text-center mt-3">
            <span className="inline-block bg-secondary text-primary px-3 py-1 rounded-full font-bold text-xs">
              #AllForTheKids
            </span>
          </div>
        </div>
      </aside>

      {/* Overlay for mobile - closes the menu when clicked */}
      {mobileMenuOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-30"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}
    </>
  );
};

export default Sidebar;