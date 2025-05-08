import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { logoutUser } from '../api/auth'; // Update path to point to api folder

const Sidebar = ({ role = 'volunteer' }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);
  
  // Handle logout using the imported logoutUser function
  const handleLogout = () => {
    logoutUser(); // Call the logoutUser function from auth.js
    console.log('Logging out...');
    // Redirect to login page
    navigate('/login');
  };

  // Define navigation items based on role
  const navItems = {
    admin: [
      { path: '/admin', label: 'Home', icon: 'home' },
      { path: '/admin/volunteers', label: 'Volunteer Management', icon: 'users' },
      { path: '/admin/events', label: 'Event Management', icon: 'calendar' },
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
  // Get the correct items based on role
  const items = navItems[role] || navItems.volunteer;
  // Icon mapping
  const getIcon = (iconName) => {
    switch (iconName) {
      case 'home':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
        );
      case 'users':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
          </svg>
        );
      case 'calendar':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        );
      case 'heart':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
        );
      case 'settings':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        );
      default:
        return null;
    }
  };
  return (
    <aside 
      className={`bg-primary text-neutral font-garet h-screen transition-all duration-300 ${
        collapsed ? 'w-16' : 'w-64'
      } fixed left-0 top-0 z-50 shadow-lg`}
    >
      {/* Logo section */}
      <div className={`flex ${collapsed ? 'justify-center' : 'justify-between'} items-center p-4 border-b border-accent/30`}>
        {!collapsed && (
          <div className="flex items-center">
            <img src="/assets/logo_notext.png" alt="Ligaya Logo" className="w-8 h-8" />
            <h3 className="font-bold text-xl text-secondary ml-2">Ligaya</h3>
          </div>
        )}
        
        {/* Toggle button */}
        <button 
          onClick={() => setCollapsed(!collapsed)} 
          className="p-1 rounded-full bg-secondary/20 text-secondary hover:bg-secondary hover:text-primary transition-colors"
        >
          {collapsed ? (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
            </svg>
          )}
        </button>
      </div>
      {/* Role indicator */}
      <div className={`py-3 ${collapsed ? 'px-2 text-center' : 'px-4'} bg-primary/90 border-b border-accent/30`}>
        {collapsed ? (
          <div className="bg-secondary/20 text-secondary uppercase font-bold rounded-full w-8 h-8 flex items-center justify-center mx-auto">
            {role.charAt(0)}
          </div>
        ) : (
          <div className="flex items-center">
            <div className="bg-secondary/20 text-secondary uppercase font-bold rounded-full w-8 h-8 flex items-center justify-center">
              {role.charAt(0)}
            </div>
            <span className="ml-2 font-semibold capitalize">{role}</span>
          </div>
        )}
      </div>
      {/* Navigation Items */}
      <nav className="mt-4">
        <ul className="space-y-1 px-2">
          {items.map((item, index) => {
            const isActive = location.pathname === item.path;
            return (
              <li key={index}>
                <Link
                  to={item.path}
                  className={`flex items-center ${
                    collapsed ? 'justify-center' : ''
                  } py-3 ${
                    collapsed ? 'px-2' : 'px-4'
                  } rounded-lg transition-all duration-200 ${
                    isActive
                      ? 'bg-secondary text-primary font-medium'
                      : 'hover:bg-secondary/10'
                  }`}
                >
                  <span className={`${isActive ? 'text-primary' : 'text-secondary'}`}>
                    {getIcon(item.icon)}
                  </span>
                  {!collapsed && <span className="ml-3">{item.label}</span>}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
      {/* Bottom section with #AllForTheKids and Logout button */}
      <div className={`absolute bottom-4 ${collapsed ? 'w-16' : 'w-64'}`}>
        {/* Logout button */}
        <div className={`mb-3 ${collapsed ? 'text-center' : 'px-4'}`}>
          <button 
            className={`flex items-center ${collapsed ? 'justify-center mx-auto' : ''} py-2 ${collapsed ? 'px-2' : 'px-3'} rounded-lg bg-secondary/10 hover:bg-secondary/20 text-secondary transition-all duration-200 w-full`}
            onClick={handleLogout}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            {!collapsed && <span className="ml-2">Logout</span>}
          </button>
        </div>
        
        {/* #AllForTheKids tag - only shown when not collapsed */}
        {!collapsed && (
          <div className="text-center">
            <span className="inline-block bg-secondary text-primary px-3 py-1 rounded-full font-bold text-xs">
              #AllForTheKids
            </span>
          </div>
        )}
      </div>
    </aside>
  );
};
export default Sidebar;