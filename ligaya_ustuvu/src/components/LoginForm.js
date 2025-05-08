import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { loginUser } from '../api/auth';
import { useAuth } from '../context/AuthContext';

export default function LoginForm() {
  const navigate = useNavigate();
  const { updateUser } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    if (!formData.password) newErrors.password = 'Password is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setLoading(true);
    setApiError('');
    
    try {
      // Login user
      const user = await loginUser(formData.email, formData.password);
      
      // Update auth context with logged in user
      updateUser(user);
      
      // Redirect to dashboard or home page
      navigate('/dashboard');
    } catch (error) {
      setApiError(error.message || 'Failed to login. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  // Required field marker
  const RequiredMark = () => <span className="text-error ml-1">*</span>;
  
  return (
    <div className="w-full max-w-md bg-base-100 shadow-xl rounded-lg">
      <div className="px-6 pt-6">
        <h2 className="text-2xl font-bold text-secondary text-shadow mb-4">Sign In</h2>
        
        {apiError && (
          <div className="alert alert-error mb-4 text-xs p-2">
            <span>{apiError}</span>
          </div>
        )}
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
            className={`input input-bordered input-sm text-xs w-full ${errors.email ? 'input-error' : ''}`}
            value={formData.email}
            onChange={handleChange}
          />
          {errors.email && (
            <div className="text-error text-xs mt-1">{errors.email}</div>
          )}
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
            className={`input input-bordered input-sm text-xs w-full ${errors.password ? 'input-error' : ''}`}
            value={formData.password}
            onChange={handleChange}
          />
          {errors.password && (
            <div className="text-error text-xs mt-1">{errors.password}</div>
          )}
          <label className="label">
            <Link to="/forgot-password" className="label-text-alt text-xs text-primary hover:underline">Forgot password?</Link>
          </label>
        </div>
        
        {/* Submit Button */}
        <div className="form-control mt-4">
          <button 
            type="submit"
            className="btn btn-secondary btn-sm rounded-lg shadow-md" 
            disabled={loading}
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </div>
        
        {/* Sign Up Link */}
        <div className="text-center mt-2">
          <p className="text-xs text-shadow">Don't have an account? {' '}
            <Link to="/signup" className="text-primary font-semibold hover:underline">
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