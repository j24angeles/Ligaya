import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { registerUser } from '../api/auth'; // Ensure this path matches your project structure

export default function SignupForm() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    birthdate: ''
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState('');
  const [attemptedSubmit, setAttemptedSubmit] = useState(false);

  // Calculate dates
  const today = new Date().toISOString().split('T')[0];
  
  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear errors when user types
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };
  
  // Validate form inputs
  const validateForm = () => {
    const newErrors = {};
    
    // Required fields
    if (!formData.firstName.trim()) newErrors.firstName = 'First name is required';
    if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    if (!formData.birthdate) newErrors.birthdate = 'Birthdate is required';
    if (!formData.password) newErrors.password = 'Password is required';
    
    // Email format
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    
    // Password requirements
    if (formData.password && !/^(?=.*[A-Z])(?=.*\d).{6,}$/.test(formData.password)) {
      newErrors.password = 'Password must have at least 6 characters, 1 number, and 1 capital letter';
    }
    
    // Password match
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    // Age validation
    if (formData.birthdate) {
      const birthDate = new Date(formData.birthdate);
      const today = new Date();
      const minAge = new Date();
      minAge.setFullYear(today.getFullYear() - 13);
      
      if (birthDate > today) {
        newErrors.birthdate = 'Birthdate cannot be in the future';
      } else if (birthDate > minAge) {
        newErrors.birthdate = 'You must be at least 13 years old to register';
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setAttemptedSubmit(true);
    
    // Validate form
    if (!validateForm()) return;
    
    setLoading(true);
    setApiError('');
    
    try {
      // Register user with your API
      await registerUser({
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        password: formData.password,
        birthdate: formData.birthdate
      });
      
      // Redirect to login page after successful registration
      navigate('/login', { 
        state: { message: 'Account created successfully! Please log in.' } 
      });
    } catch (error) {
      setApiError(error.message || 'Failed to create account. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Required field marker
  const RequiredMark = () => <span className="text-error ml-1">*</span>;
  
  return (
    <div className="w-full max-w-md bg-base-100 shadow-xl rounded-lg">
      <div className="px-6 pt-6">
        <h2 className="text-2xl font-bold text-secondary text-shadow mb-4">Create an Account</h2>
        
        {apiError && (
          <div className="alert alert-error mb-4 text-xs p-2">
            <span>{apiError}</span>
          </div>
        )}
      </div>
      
      <form onSubmit={handleSubmit} className="card-body pt-0">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          {/* First Name */}
          <div className="form-control">
            <label className="label py-0.5">
              <span className="label-text text-xs text-shadow">First Name<RequiredMark /></span>
            </label>
            <input 
              type="text"
              name="firstName"
              placeholder="First Name"
              className={`input input-bordered input-sm text-xs w-full ${errors.firstName && attemptedSubmit ? 'input-error' : ''}`}
              value={formData.firstName}
              onChange={handleChange}
            />
            {errors.firstName && attemptedSubmit && (
              <div className="text-error text-xs mt-1">{errors.firstName}</div>
            )}
          </div>
          
          {/* Last Name */}
          <div className="form-control">
            <label className="label py-0.5">
              <span className="label-text text-xs text-shadow">Last Name<RequiredMark /></span>
            </label>
            <input 
              type="text"
              name="lastName"
              placeholder="Last Name"
              className={`input input-bordered input-sm text-xs w-full ${errors.lastName && attemptedSubmit ? 'input-error' : ''}`}
              value={formData.lastName}
              onChange={handleChange}
            />
            {errors.lastName && attemptedSubmit && (
              <div className="text-error text-xs mt-1">{errors.lastName}</div>
            )}
          </div>
        </div>
        
        {/* Email */}
        <div className="form-control">
          <label className="label py-0.5">
            <span className="label-text text-xs text-shadow">Email<RequiredMark /></span>
          </label>
          <input 
            type="email"
            name="email"
            placeholder="email@example.com"
            className={`input input-bordered input-sm text-xs w-full ${errors.email && attemptedSubmit ? 'input-error' : ''}`}
            value={formData.email}
            onChange={handleChange}
          />
          {errors.email && attemptedSubmit && (
            <div className="text-error text-xs mt-1">{errors.email}</div>
          )}
        </div>
        
        {/* Birthdate */}
        <div className="form-control">
          <label className="label py-0.5">
            <span className="label-text text-xs text-shadow">Birthdate<RequiredMark /></span>
          </label>
          <input 
            type="date"
            name="birthdate"
            className={`input input-bordered input-sm text-xs w-full ${errors.birthdate && attemptedSubmit ? 'input-error' : ''}`}
            value={formData.birthdate}
            onChange={handleChange}
            max={today}
          />
          {errors.birthdate && attemptedSubmit && (
            <div className="text-error text-xs mt-1">{errors.birthdate}</div>
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
            className={`input input-bordered input-sm text-xs w-full ${errors.password && attemptedSubmit ? 'input-error' : ''}`}
            value={formData.password}
            onChange={handleChange}
          />
          {errors.password && attemptedSubmit && (
            <div className="text-error text-xs mt-1">{errors.password}</div>
          )}
        </div>
        
        {/* Confirm Password */}
        <div className="form-control">
          <label className="label py-0.5">
            <span className="label-text text-xs text-shadow">Confirm Password<RequiredMark /></span>
          </label>
          <input 
            type="password"
            name="confirmPassword"
            placeholder="Confirm password"
            className={`input input-bordered input-sm text-xs w-full ${errors.confirmPassword && attemptedSubmit ? 'input-error' : ''}`}
            value={formData.confirmPassword}
            onChange={handleChange}
          />
          {errors.confirmPassword && attemptedSubmit && (
            <div className="text-error text-xs mt-1">{errors.confirmPassword}</div>
          )}
        </div>
        
        {/* Terms and Conditions Checkbox */}
        <div className="form-control mt-2">
          <label className="flex items-center gap-2 cursor-pointer">
            <input 
              type="checkbox" 
              className="checkbox checkbox-primary checkbox-xs rounded-sm" 
              required
            />
            <span className="label-text text-xs text-shadow">I agree to the Terms & Conditions<RequiredMark /></span>
          </label>
        </div>
        
        {/* Submit Button */}
        <div className="form-control mt-4">
          <button 
            type="submit"
            className="btn btn-secondary btn-sm rounded-lg shadow-md" 
            disabled={loading}
          >
            {loading ? 'Creating account...' : 'Sign Up'}
          </button>
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