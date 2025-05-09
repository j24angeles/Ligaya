import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Home from './pages/Home';
import Devs from './pages/Devs';
import Privacy from './pages/PrivacyPolicy';
import Terms from './pages/Terms';
import AdminEvent from './pages/admin/AdminEventPage';
import AdminUserMgmt from './pages/admin/AdminUserPage';
import { isLoggedIn, getCurrentUser } from './api/auth';
import { ToastProvider } from './hooks/ToastProvider'; 
import AboutUs from './pages/AboutUs';


// ProtectedRoute must be declared as a separate component that can use hooks
const ProtectedRoute = ({ children }) => {
  const location = useLocation();
  const currentUser = getCurrentUser();

  if (!isLoggedIn() || !currentUser) {
    // Redirect to login, preserving attempted route
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  if (currentUser.role !== 'admin') {
    // Redirect non-admins to home
    return <Navigate to="/home" replace />;
  }

  return children;
};

export default function App() {
  return (
    <div className="font-poppins">
      {/* Wrap the Router with ToastProvider so toasts are available throughout the app */}
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

            <Route
              path="/event-management"
              element={
                <ProtectedRoute>
                  <AdminEvent />
                </ProtectedRoute>
              }
            />
             <Route
              path="/user-management"
              element={
                <ProtectedRoute>
                  <AdminUserMgmt />
                </ProtectedRoute>
              }
            />
          </Routes>
        </Router>
      </ToastProvider>
    </div>
  );
}