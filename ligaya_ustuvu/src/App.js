import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Home from './pages/Home';
import Devs from './pages/Devs';
import Privacy from './pages/PrivacyPolicy';
import Terms from './pages/Terms';
import AdminEvent from './pages/admin/AdminEventPage';
import ProtectedRoute from './components/ProtectedRoute';
import Unauthorized from './pages/Unauthorized';
import VolunteerDb from './pages/VolunteerDb'; // Import your volunteer dashboard
import AdminDb from './pages/admin/AdminDb'; // Import your admin dashboard

export default function App() {
  return (
    <div className="font-poppins">
      <Router>
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<Navigate to="/home" />} />
          <Route path="/home" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/devs" element={<Devs />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/unauthorized" element={<Unauthorized />} />
          
          {/* Protected routes - Admin */}
          <Route 
            path="/admin/*" 
            element={
              <ProtectedRoute requiredRole="admin">
                <AdminDb />
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/event-management" 
            element={
              <ProtectedRoute requiredRole="admin">
                <AdminEvent />
              </ProtectedRoute>
            }
          />
          
          {/* Protected routes - Volunteer */}
          <Route 
            path="/volunteer/*" 
            element={
              <ProtectedRoute>
                <VolunteerDb />
              </ProtectedRoute>
            } 
          />
          
          {/* If no routes match, redirect to home */}
          <Route path="*" element={<Navigate to="/home" replace />} />
        </Routes>
      </Router>
    </div>
  );
}