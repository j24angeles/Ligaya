import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginUser } from '../api/auth';
import { useAuth } from '../context/AuthContext'; // Import AuthContext hook

export default function Login() {
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { updateUser } = useAuth(); // Get the updateUser function from context

  const handleLogin = async (credentials) => {
    setLoading(true);
    setError('');
    try {
      const user = await loginUser(credentials.email, credentials.password);
      
      // Update the auth context
      updateUser(user);
      
      // Navigate based on user role
      navigate(user.role === 'admin' ? '/admin' : '/volunteer');
    } catch (err) {
      setError(err.message);
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
          </div>
        </div>
      </div>
    </div>
  );
}

// Import this component directly in the same file since it's tightly coupled with Login
function LoginForm({ onSubmit, loading }) {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [errors, setErrors] = useState({});

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
    
    // Call the onSubmit function passed from parent
    onSubmit(formData);
  };

  // Required field marker
  const RequiredMark = () => <span className="text-error ml-1">*</span>;
  
  return (
    <form onSubmit={handleSubmit}>
      {/* Email */}
      <div className="form-control">
        <label className="label py-0.5">
          <span className="label-text text-xs">Email<RequiredMark /></span>
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
          <span className="label-text text-xs">Password<RequiredMark /></span>
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
          <a href="/forgot-password" className="label-text-alt text-xs text-primary hover:underline">Forgot password?</a>
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
        <p className="text-xs">Don't have an account? {' '}
          <a href="/signup" className="text-primary font-semibold hover:underline">
            Sign Up
          </a>
        </p>
      </div>
    </form>
  );
}