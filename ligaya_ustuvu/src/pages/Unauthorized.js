// pages/Unauthorized.js
import { Link } from 'react-router-dom';
import { getCurrentUser, logoutUser } from '../api/auth';

export default function Unauthorized() {
  const user = getCurrentUser();
  
  const handleLogout = () => {
    logoutUser();
  };

  return (
    <div className="hero min-h-screen bg-base-200">
      <div className="hero-content text-center">
        <div className="max-w-md">
          <h1 className="text-5xl font-bold">Access Denied</h1>
          <p className="py-6">
            Sorry, you don't have permission to access this area.
            {user && (
              <span> You are logged in as <strong>{user.name}</strong> with role <strong>{user.role}</strong>.</span>
            )}
          </p>
          <div className="flex justify-center gap-4">
            {user && user.role === 'volunteer' && (
              <Link to="/volunteer" className="btn btn-primary">
                Go to Volunteer Dashboard
              </Link>
            )}
            <Link to="/login" onClick={handleLogout} className="btn btn-outline">
              Logout
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}