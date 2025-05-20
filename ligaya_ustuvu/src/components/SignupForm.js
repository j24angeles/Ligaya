import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { registerUser } from '../api/auth';
import TermsCondi from './TermsCondi';
import { useToast } from '../hooks/ToastProvider';

export default function SignupForm() {
  const navigate = useNavigate();
  const { showError, showSuccess } = useToast();
  
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
  const [attemptedSubmit, setAttemptedSubmit] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [showTermsModal, setShowTermsModal] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);
  
  // Calculate dates
  const today = new Date().toISOString().split('T')[0];
  
  // Calculate password strength
  const calculatePasswordStrength = (password) => {
    if (!password) return 0;
    
    let strength = 0;
    
    // Length check
    if (password.length >= 6) strength += 1;
    if (password.length >= 10) strength += 1;
    
    // Character variety checks
    if (/[A-Z]/.test(password)) strength += 1;
    if (/[0-9]/.test(password)) strength += 1;
    if (/[^A-Za-z0-9]/.test(password)) strength += 1;
    
    return Math.min(strength, 5); // Max score of 5
  };
  
  // Get strength label and color
  const getStrengthInfo = (strength) => {
    const labels = ['Very Weak', 'Weak', 'Fair', 'Good', 'Strong', 'Very Strong'];
    const colors = ['#ff4d4d', '#ff9933', '#ffcc00', '#99cc33', '#70cc33', '#33cc33'];
    
    return {
      label: labels[strength],
      color: colors[strength]
    };
  };

  // Calculate age from birthdate
  const calculateAge = (birthdate) => {
    const birthDate = new Date(birthdate);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    
    return age;
  };
  
  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Enforce max lengths
    let processedValue = value;
    if (name === 'firstName' || name === 'lastName') {
      processedValue = value.slice(0, 50);
    } else if (name === 'email') {
      processedValue = value.slice(0, 100);
    } else if (name === 'password') {
      processedValue = value.slice(0, 50);
    }
    
    setFormData(prev => ({
      ...prev,
      [name]: processedValue
    }));
    
    if (name === 'password') {
      setPasswordStrength(calculatePasswordStrength(processedValue));
    }
    
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };
  
  const validateForm = () => {
    const newErrors = {};
    let isValid = true;
    
    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First name is required';
      isValid = false;
    } else if (formData.firstName.length > 50) {
      newErrors.firstName = 'First name must be 50 characters or less';
      isValid = false;
    }
    
    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Last name is required';
      isValid = false;
    } else if (formData.lastName.length > 50) {
      newErrors.lastName = 'Last name must be 50 characters or less';
      isValid = false;
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
      isValid = false;
    } else if (formData.email.length > 100) {
      newErrors.email = 'Email must be 100 characters or less';
      isValid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
      isValid = false;
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
      isValid = false;
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must have at least 6 characters';
      isValid = false;
    } else if (formData.password.length > 50) {
      newErrors.password = 'Password must be 50 characters or less';
      isValid = false;
    } else if (!/(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
      newErrors.password = 'Password must contain at least 1 number and 1 capital letter';
      isValid = false;
    }
    
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
      isValid = false;
    }
    
    if (!formData.birthdate) {
      newErrors.birthdate = 'Birthdate is required';
      isValid = false;
    } else {
      const birthDate = new Date(formData.birthdate);
      const today = new Date();
      
      if (birthDate > today) {
        newErrors.birthdate = 'Birthdate cannot be in the future';
        isValid = false;
      } else if (calculateAge(formData.birthdate) < 13) {
        newErrors.birthdate = 'You must be at least 13 years old to register';
        isValid = false;
      }
    }
    
    if (!termsAccepted) {
      newErrors.terms = 'You must accept the Terms and Conditions';
      isValid = false;
    }
    
    setErrors(newErrors);
    
    const firstError = Object.values(newErrors)[0];
    if (firstError) {
      showError(firstError);
    }
    
    return isValid;
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setAttemptedSubmit(true);
    
    if (!validateForm()) return;
    
    setLoading(true);
    
    try {
      await registerUser({
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        password: formData.password,
        birthdate: formData.birthdate
      });
      
      showSuccess('Account created successfully!');
      navigate('/login', { 
        state: { message: 'Account created successfully! Please log in.' } 
      });
    } catch (error) {
      showError(error.message || 'Failed to create account. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  const openTermsModal = (e) => {
    e.preventDefault();
    setShowTermsModal(true);
  };
  
  const handleAcceptTerms = () => {
    setTermsAccepted(true);
    if (errors.terms) {
      setErrors(prev => ({
        ...prev,
        terms: ''
      }));
    }
    showSuccess('Terms & Conditions accepted!');
  };
  
  const RequiredMark = () => <span className="text-error ml-1">*</span>;
  
  return (
    <div className="w-full max-w-md bg-base-100 shadow-xl rounded-lg p-4 mt-4">
      <div className="px-6 pt-6">
        <h2 className="text-2xl font-bold text-secondary text-shadow mb-4">Create an Account</h2>
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
              className={`input input-bordered input-sm text-xs w-full ${
                (attemptedSubmit && errors.firstName) ? 'input-error' : ''
              }`}
              value={formData.firstName}
              onChange={handleChange}
            />
            {attemptedSubmit && errors.firstName && (
              <span className="text-xs text-error mt-1">{errors.firstName}</span>
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
              className={`input input-bordered input-sm text-xs w-full ${
                (attemptedSubmit && errors.lastName) ? 'input-error' : ''
              }`}
              value={formData.lastName}
              onChange={handleChange}
            />
            {attemptedSubmit && errors.lastName && (
              <span className="text-xs text-error mt-1">{errors.lastName}</span>
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
            className={`input input-bordered input-sm text-xs w-full ${
              (attemptedSubmit && errors.email) ? 'input-error' : ''
            }`}
            value={formData.email}
            onChange={handleChange}
          />
          {attemptedSubmit && errors.email && (
            <span className="text-xs text-error mt-1">{errors.email}</span>
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
            className={`input input-bordered input-sm text-xs w-full ${
              (attemptedSubmit && errors.birthdate) ? 'input-error' : ''
            }`}
            value={formData.birthdate}
            onChange={handleChange}
            max={today}
          />
          {attemptedSubmit && errors.birthdate && (
            <span className="text-xs text-error mt-1">{errors.birthdate}</span>
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
            className={`input input-bordered input-sm text-xs w-full ${
              (attemptedSubmit && errors.password) ? 'input-error' : ''
            }`}
            value={formData.password}
            onChange={handleChange}
          />
          {attemptedSubmit && errors.password && (
            <span className="text-xs text-error mt-1">{errors.password}</span>
          )}
          <div className="flex items-center gap-2 mt-1">
            <div className="flex-1 h-1 bg-gray-200 rounded-full">
              <div 
                className="h-1 rounded-full transition-all duration-300"
                style={{ 
                  width: `${(passwordStrength / 5) * 100}%`,
                  backgroundColor: getStrengthInfo(passwordStrength).color
                }}
              />
            </div>
            <span 
              className="text-[0.60rem] leading-none whitespace-nowrap"
              style={{ color: getStrengthInfo(passwordStrength).color }}
            >
              {getStrengthInfo(passwordStrength).label}
            </span>
          </div>
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
            className={`input input-bordered input-sm text-xs w-full ${
              (attemptedSubmit && errors.confirmPassword) ? 'input-error' : ''
            }`}
            value={formData.confirmPassword}
            onChange={handleChange}
          />
          {attemptedSubmit && errors.confirmPassword && (
            <span className="text-xs text-error mt-1">{errors.confirmPassword}</span>
          )}
        </div>
        
        {/* Terms and Conditions Checkbox */}
        <div className="form-control mt-2">
          <label className="flex items-center gap-2 cursor-pointer">
            <input 
              type="checkbox" 
              className="checkbox checkbox-primary checkbox-xs rounded-sm" 
              checked={termsAccepted}
              onChange={() => setTermsAccepted(!termsAccepted)}
            />
            <span className="label-text text-xs text-shadow">
              I agree to the{' '}
              <a 
                href="#"
                className="text-secondary font-bold hover:underline"
                onClick={openTermsModal}
              >
                Terms & Conditions
              </a>
              <RequiredMark />
            </span>
          </label>
          {attemptedSubmit && errors.terms && (
            <span className="text-xs text-error mt-1">{errors.terms}</span>
          )}
        </div>
        
        {/* Submit Button */}
        <div className="form-control mt-4">
          <button 
            type="submit"
            className="text-neutral font-bold btn btn-secondary btn-sm rounded-full shadow-md" 
            disabled={loading}
          >
            {loading ? 'Creating account...' : 'Sign Up'}
          </button>
        </div>
        
        {/* Sign In Link */}
        <div className="text-center mt-2">
          <p className="text-xs">
            Already have an account?{' '}
            <a 
              href="/login" 
              className="text-secondary font-semibold hover:underline"
              onClick={(e) => {
                e.preventDefault();
                navigate('/login');
              }}
            >
              Sign In
            </a>
          </p>
        </div>
      </form>
      
      {/* Terms and Conditions Modal */}
      <TermsCondi 
        isOpen={showTermsModal}
        onClose={() => setShowTermsModal(false)}
        onAccept={handleAcceptTerms}
      />
    </div>
  );
}