import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { registerUser } from '../api/auth'; // Ensure this path matches your project structure
import TermsCondi from './TermsCondi'; // Import the Terms and Conditions component
import { useToast } from '../hooks/ToastProvider'; // Adjust the import path based on your file structure

export default function SignupForm() {
  const navigate = useNavigate();
  const { showError, showSuccess } = useToast(); // Use our toast hook
  
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
  
  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Update password strength when password changes
    if (name === 'password') {
      setPasswordStrength(calculatePasswordStrength(value));
    }
    
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
    
    // Check for empty required fields
    const requiredFields = ['firstName', 'lastName', 'email', 'birthdate', 'password', 'confirmPassword'];
    const hasEmptyFields = requiredFields.some(field => !formData[field] || formData[field].trim() === '');
    
    if (hasEmptyFields) {
      // Single error message for all required fields
      showError('All fields are required.');
      newErrors.requiredFields = 'All fields are required.';
    }
    
    // Email format (only if email is not empty)
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
      showError('Please enter a valid email address');
    }
    
    // Password requirements (only if password is not empty)
    if (formData.password && !/^(?=.*[A-Z])(?=.*\d).{6,}$/.test(formData.password)) {
      newErrors.password = 'Password must have at least 6 characters, 1 number, and 1 capital letter';
      showError('Password must have at least 6 characters, 1 number, and 1 capital letter');
    }
    
    // Password match
    if (formData.password && formData.confirmPassword && formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
      showError('Passwords do not match');
    }
    
    // Age validation (only if birthdate is not empty)
    if (formData.birthdate) {
      const birthDate = new Date(formData.birthdate);
      const today = new Date();
      const minAge = new Date();
      minAge.setFullYear(today.getFullYear() - 13);
      
      if (birthDate > today) {
        newErrors.birthdate = 'Birthdate cannot be in the future';
        showError('Birthdate cannot be in the future');
      } else if (birthDate > minAge) {
        newErrors.birthdate = 'You must be at least 13 years old to register.';
        showError('You must be at least 13 years old to register.');
      }
    }
    
    // Terms and conditions validation
    if (!termsAccepted) {
      newErrors.terms = 'You must accept the Terms and Conditions.';
      showError('You must accept the Terms and Conditions.');
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
    
    try {
      // Register user with your API
      await registerUser({
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        password: formData.password,
        birthdate: formData.birthdate
      });
      
      // Show success toast
      showSuccess('Account created successfully!');
      
      // Redirect to login page after successful registration
      navigate('/login', { 
        state: { message: 'Account created successfully! Please log in.' } 
      });
    } catch (error) {
      // Show error toast
      showError(error.message || 'Failed to create account. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  // Open terms modal
  const openTermsModal = (e) => {
    e.preventDefault();
    setShowTermsModal(true);
  };
  
  // Accept terms
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
  
  // Required field marker
  const RequiredMark = () => <span className="text-error ml-1">*</span>;
  
  // Check if there's a required fields error to highlight all inputs
  const hasRequiredFieldsError = errors.requiredFields && attemptedSubmit;
  
  return (
    <div className="w-full max-w-md bg-base-100 shadow-xl rounded-lg p-4 mt-8">
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
              className={`input input-bordered input-sm text-xs w-full ${hasRequiredFieldsError ? 'input-error' : ''}`}
              value={formData.firstName}
              onChange={handleChange}
            />
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
              className={`input input-bordered input-sm text-xs w-full ${hasRequiredFieldsError ? 'input-error' : ''}`}
              value={formData.lastName}
              onChange={handleChange}
            />
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
            className={`input input-bordered input-sm text-xs w-full ${hasRequiredFieldsError || (errors.email && attemptedSubmit) ? 'input-error' : ''}`}
            value={formData.email}
            onChange={handleChange}
          />
        </div>
        
        {/* Birthdate */}
        <div className="form-control">
          <label className="label py-0.5">
            <span className="label-text text-xs text-shadow">Birthdate<RequiredMark /></span>
          </label>
          <input 
            type="date"
            name="birthdate"
            className={`input input-bordered input-sm text-xs w-full ${hasRequiredFieldsError || (errors.birthdate && attemptedSubmit) ? 'input-error' : ''}`}
            value={formData.birthdate}
            onChange={handleChange}
            max={today}
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
    className={`input input-bordered input-sm text-xs w-full ${hasRequiredFieldsError || (errors.password && attemptedSubmit) ? 'input-error' : ''}`}
    value={formData.password}
    onChange={handleChange}
  />
  {/* Compact line-style password strength meter */}
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
      {passwordStrength === 0 && 'Very weak'}
      {passwordStrength === 1 && 'Weak'}
      {passwordStrength === 2 && 'So-so'}
      {passwordStrength === 3 && 'Good'}
      {passwordStrength === 4 && 'Great!'}
      {passwordStrength === 5 && 'Excellent!'}
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
            className={`input input-bordered input-sm text-xs w-full ${hasRequiredFieldsError || (errors.confirmPassword && attemptedSubmit) ? 'input-error' : ''}`}
            value={formData.confirmPassword}
            onChange={handleChange}
          />
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
        </div>
        
        {/* Submit Button */}
        <div className="form-control mt-4">
          <button 
            type="submit"
            className="font-bold btn btn-secondary btn-sm rounded-lg shadow-md" 
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
        <style jsx>{`
          .text-shadow {
            text-shadow: 0 1px 2px rgba(0,0,0,0.1);
          }
        `}</style>
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