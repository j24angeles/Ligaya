// components/ProtectedRoute.js
import { Navigate, useLocation } from 'react-router-dom';
import { isAuthenticated, hasRole } from '../api/auth';

/**
 * A wrapper component for routes that require authentication
 * @param {Object} props - Component properties
 * @param {React.ReactNode} props.children - Child components to render if authenticated
 * @param {string} [props.requiredRole] - Optional role requirement (e.g., "admin")
 */
export default function ProtectedRoute({ children, requiredRole }) {
  const location = useLocation();
  const authenticated = isAuthenticated();
  
  // Check if user is authenticated
  if (!authenticated) {
    // Redirect to login page, but save the attempted location
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // If a specific role is required, check that too
  if (requiredRole && !hasRole(requiredRole)) {
    // Redirect to unauthorized page
    return <Navigate to="/unauthorized" replace />;
  }

  // User is authenticated and authorized - render the protected content
  return children;
}