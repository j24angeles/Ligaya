import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Home from './pages/Home';
import Devs from './pages/Devs';
import Privacy from './pages/PrivacyPolicy';
import Terms from './pages/Terms';
import AboutUs from './pages/AboutUs';
import VolunteerSettings from './pages/volunteer/VolunteerSettings';
import AdminEvent from './pages/admin/AdminEventPage';
import AdminUserMgmt from './pages/admin/AdminUserPage';
import AdminDashboard from './pages/admin/AdminDashboard';
import VolunteerEvent from './pages/volunteer/VolunteerEventPage';
import VolunteerDashboard from './pages/volunteer/VolunteerDashboard';
import { isLoggedIn, getCurrentUser } from './api/auth';
import { ToastProvider } from './hooks/ToastProvider';

// Enhanced ProtectedRoute component that accepts allowedRoles
const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const location = useLocation();
  const currentUser = getCurrentUser();
  
  if (!isLoggedIn() || !currentUser) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }
  
  if (allowedRoles.length > 0 && !allowedRoles.includes(currentUser.role)) {
    return <Navigate to="/home" replace />;
  }
  
  return children;
};

export default function App() {
  return (
    <div className="font-poppins">
      <ToastProvider>
        <Router>
          <Routes>
            <Route path="/" element={<Navigate to="/home" />} />
            <Route path="/home" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/devs" element={<Devs />} />
            <Route path="/privacy" element={<Privacy />} />
            <Route path="/terms" element={<Terms />} />
            <Route path="/about-us" element={<AboutUs />} />
            
            {/* Settings page - accessible by any logged-in user */}
            <Route
              path="/volunteersettings"
              element={
                <ProtectedRoute>
                  <VolunteerSettings />
                </ProtectedRoute>
              }
            />
            
            {/* Dashboards */}
            <Route
              path="/admin-dashboard"
              element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/volunteer-dashboard"
              element={
                <ProtectedRoute allowedRoles={['volunteer']}>
                  <VolunteerDashboard />
                </ProtectedRoute>
              }
            />
            
            {/* Admin-only routes */}
            <Route
              path="/event-management"
              element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <AdminEvent />
                </ProtectedRoute>
              }
            />
            <Route
              path="/user-management"
              element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <AdminUserMgmt />
                </ProtectedRoute>
              }
            />
            
            {/* Volunteer-only route */}
            <Route
              path="/volunteer-events"
              element={
                <ProtectedRoute allowedRoles={['volunteer']}>
                  <VolunteerEvent />
                </ProtectedRoute>
              }
            />
          </Routes>
        </Router>
      </ToastProvider>
    </div>
  );
}