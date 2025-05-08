// Login.js
import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { loginUser, isAuthenticated, getCurrentUser } from '../api/auth';
import LoginForm from '../components/LoginForm';

export default function Login() {
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  
  // Redirect if already logged in
  useEffect(() => {
    // Check if user is already logged in
    if (isAuthenticated()) {
      const user = getCurrentUser();
      redirectBasedOnRole(user.role);
    }
  }, []);
  
  // Handle redirection based on user role
  const redirectBasedOnRole = (role) => {
    // Get the intended destination from the location state or use default
    const from = location.state?.from?.pathname || (role === 'admin' ? '/admin' : '/volunteer');
    navigate(from, { replace: true });
  };

  const handleLogin = async (credentials) => {
    setLoading(true);
    setError('');
    try {
      const user = await loginUser(credentials.email, credentials.password);
      
      // Store user in localStorage but without sensitive info
      localStorage.setItem('user', JSON.stringify(user));
      
      // Set session timestamp (optional, for session expiry)
      localStorage.setItem('sessionStart', Date.now());
      
      // Redirect based on role
      redirectBasedOnRole(user.role);
    } catch (err) {
      setError(err.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="hero min-h-screen bg-base-200">
      <div className="hero-content flex-col lg:flex-row-reverse">
        <div className="text-center lg:text-left">
          <h1 className="text-5xl font-bold">Ligaya</h1>
          <p className="py-6">Volunteer for child advocacy initiatives with UST UVU</p>
        </div>
        <div className="card flex-shrink-0 w-full max-w-sm shadow-2xl bg-base-100">
          <div className="card-body">
            <h2 className="text-2xl font-bold text-center">Login</h2>
            {error && <div className="alert alert-error">{error}</div>}
            <LoginForm onSubmit={handleLogin} loading={loading} />
            <div className="text-center mt-4">
              <p>Don't have an account? <a href="/signup" className="link">Sign up</a></p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}