import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Home from './pages/Home';
import Devs from './pages/Devs';
import Privacy from './pages/PrivacyPolicy';
import Terms from './pages/Terms';
import AdminEvent from './pages/admin/AdminEventPage';
import { isLoggedIn, getCurrentUser } from './api/auth';

// ✅ Move ProtectedRoute OUTSIDE the App component
const ProtectedRoute = ({ children }) => {
  const location = useLocation();
  const currentUser = getCurrentUser();

  if (!isLoggedIn() || !currentUser) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  if (currentUser.role !== 'admin') {
    return <Navigate to="/home" replace />;
  }

  return children;
};

export default function App() {
  return (
    <div className="font-poppins">
      <Router>
        <Routes>
          <Route path="/" element={<Navigate to="/home" />} />
          <Route path="/home" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/devs" element={<Devs />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/terms" element={<Terms />} />
          <Route
            path="/event-management"
            element={
              <ProtectedRoute>
                <AdminEvent />
              </ProtectedRoute>
            }
          />
        </Routes>
      </Router>
    </div>
  );
}
