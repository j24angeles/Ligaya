import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { loginUser } from '../api/auth';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../hooks/ToastProvider';

export default function LoginForm() {
  const navigate = useNavigate();
  const { updateUser } = useAuth();
  const { showError, showSuccess } = useToast();
  
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validateForm = () => {
    if (!formData.email.trim()) {
      showError('Email is required.');
      return false;
    }
    
    if (!formData.password) {
      showError('Password is required.');
      return false;
    }
    
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setLoading(true);
    
    try {
      // Login user
      const user = await loginUser(formData.email, formData.password);
      
      // Update auth context with logged in user
      updateUser(user);
      
      // Show success toast
      showSuccess('Login successful!');
      
      // Redirect to dashboard or home page
      navigate('/dashboard');
    } catch (error) {
      showError(error.message || 'Failed to login. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  // Required field marker
  const RequiredMark = () => <span className="text-error ml-1">*</span>;
  
  return (
    <div className="w-full max-w-sm mx-auto bg-base-100 shadow-xl rounded-lg pt-0">
      <div className="px-6 pt-10">
        <h2 className="text-2xl font-bold text-secondary text-shadow mb-4">Sign In</h2>
      </div>
      
      <form onSubmit={handleSubmit} className="card-body pt-0">
        {/* Email */}
        <div className="form-control">
          <label className="label py-0.5">
            <span className="label-text text-xs text-shadow">Email<RequiredMark /></span>
          </label>
          <input 
            type="email"
            name="email"
            placeholder="email@example.com"
            className="input input-bordered input-sm text-xs w-full"
            value={formData.email}
            onChange={handleChange}
          />
        </div>
        
        {/* Password */}
        <div className="form-control">
          <label className="label py-0.5">
            <span className="label-text text-xs text-shadow">Password<RequiredMark /></span>
          </label>
          <input 
            type="password"
            name="password"
            placeholder="Enter password"
            className="input input-bordered input-sm text-xs w-full"
            value={formData.password}
            onChange={handleChange}
          />
          <label className="text-right mt-1">
            <Link to="/forgot-password" className="label-text-alt text-xs text-primary hover:underline">
              Forgot password?
            </Link>
          </label>
        </div>
        
        {/* Submit Button */}
        <div className="form-control mt-0">
          <button 
            type="submit"
            className="font-bold btn btn-secondary btn-sm rounded-lg shadow-md" 
            disabled={loading}
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </div>
        
        {/* Sign Up Link */}
        <div className="text-center mt-2">
          <p className="text-xs text-shadow">Don't have an account? {' '}
            <Link to="/signup" className="text-secondary font-semibold hover:underline">
              Sign Up
            </Link>
          </p>
        </div>

        <style jsx>{`
          .text-shadow {
            text-shadow: 0 1px 2px rgba(0,0,0,0.1);
          }
        `}</style>
      </form>
    </div>
  );
}