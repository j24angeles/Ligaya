import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import TermsAndConditionsModal from '../components/TermsCondi';
import Navbar from '../common/Navbar';
import Footer from '../common/Footer';

export default function SignupForm({ onSubmit, loading }) {
  const [formErrors, setFormErrors] = useState({});
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    birthdate: '',
    termsAgreed: false
  });
  const [formValid, setFormValid] = useState(false);
  const [termsModalOpen, setTermsModalOpen] = useState(false);
  const [termsRead, setTermsRead] = useState(false);
  const [attemptedSubmit, setAttemptedSubmit] = useState(false);

  // Calculate dates
  const today = new Date().toISOString().split('T')[0];
  const getMinAgeDate = () => {
    const date = new Date();
    date.setFullYear(date.getFullYear() - 13);
    return date.toISOString().split('T')[0];
  };

  // Form validation function
  const validateForm = () => {
    const errors = {};
    let isValid = true;

    // Simple validation helper
    const validateField = (field, value, validator, errorMsg) => {
      if (!validator(value)) {
        errors[field] = errorMsg;
        isValid = false;
      }
    };

    // First & Last Name validations
    validateField('firstName', formData.firstName.trim(), val => val.length > 0, 'Please enter your first name');
    validateField('lastName', formData.lastName.trim(), val => val.length > 0, 'Please enter your last name');

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    validateField('email', formData.email.trim(), 
      val => val.length > 0 && emailRegex.test(val), 
      'Please enter a valid email address');

    // Password validation
    const passwordRegex = /^(?=.*[A-Z])(?=.*\d).{6,}$/;
    validateField('password', formData.password,
      val => val.length >= 6 && passwordRegex.test(val),
      'Must have 6+ chars, 1 number, 1 capital letter');

    // Confirm Password validation
    validateField('confirmPassword', formData.confirmPassword,
      val => val === formData.password && val.length > 0,
      'Passwords do not match');

    // Birthdate validation
    if (!formData.birthdate) {
      errors.birthdate = 'Please select your birthdate';
      isValid = false;
    } else {
      const birthdateObj = new Date(formData.birthdate);
      const minAgeDate = new Date(getMinAgeDate());
      
      if (birthdateObj > new Date()) {
        errors.birthdate = 'Birthdate cannot be in the future';
        isValid = false;
      } else if (birthdateObj > minAgeDate) {
        errors.birthdate = 'You must be at least 13 years old';
        isValid = false;
      }
    }

    // Terms validation
    if (!formData.termsAgreed || !termsRead) {
      errors.termsAgreed = !formData.termsAgreed 
        ? 'Please agree to the Terms and Conditions' 
        : 'Please read the Terms and Conditions first';
      isValid = false;
    }

    setFormErrors(errors);
    return isValid;
  };

  // Validate form whenever data changes, but avoid excessive validations
  useEffect(() => {
    if (attemptedSubmit) {
      setFormValid(validateForm());
    }
  }, [formData, termsRead, attemptedSubmit]);

  // Handle input changes correctly
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    // Handle checkbox separately
    if (type === 'checkbox') {
      // Only allow checking terms checkbox if terms have been read
      if (name === 'termsAgreed' && checked && !termsRead) return;
      
      setFormData(prev => ({
        ...prev,
        [name]: checked
      }));
    } else {
      // Handle text inputs
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    setAttemptedSubmit(true);
    
    const isValid = validateForm();
    setFormValid(isValid);
    
    if (!isValid) return;
    
    onSubmit({
      firstName: formData.firstName,
      lastName: formData.lastName,
      email: formData.email,
      password: formData.password,
      birthdate: formData.birthdate
    });
  };

  const closeTermsModal = () => {
    setTermsModalOpen(false);
    setTermsRead(true);
  };

  // Required field marker
  const RequiredMark = () => <span className="text-error ml-1">*</span>;
  
  return (
    <>
      <Navbar />
      <div
        className="w-screen h-screen overflow-y-hidden bg-cover bg-center flex items-center justify-center"
        style={{ backgroundImage: "url('/assets/login_bg.png')" }}
      >
        <div className="card w-full max-w-md bg-base-100 shadow-2xl p-6">
          <div className="px-6 pt-2">
            <h2 className="text-3xl font-bold text-secondary text-shadow">Create an Account</h2>
          </div>
          
          <form onSubmit={handleSubmit} className="card-body pt-2 pb-2 px-6">
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
                  className={`input input-bordered input-sm text-xs w-full ${formErrors.firstName && attemptedSubmit ? 'input-error' : ''}`}
                  value={formData.firstName}
                  onChange={handleChange}
                  required
                />
                {formErrors.firstName && attemptedSubmit && (
                  <div className="text-error text-xs mt-1">{formErrors.firstName}</div>
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
                  className={`input input-bordered input-sm text-xs w-full ${formErrors.lastName && attemptedSubmit ? 'input-error' : ''}`}
                  value={formData.lastName}
                  onChange={handleChange}
                  required
                />
                {formErrors.lastName && attemptedSubmit && (
                  <div className="text-error text-xs mt-1">{formErrors.lastName}</div>
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
                className={`input input-bordered input-sm text-xs w-full ${formErrors.email && attemptedSubmit ? 'input-error' : ''}`}
                value={formData.email}
                onChange={handleChange}
                required
              />
              {formErrors.email && attemptedSubmit && (
                <div className="text-error text-xs mt-1">{formErrors.email}</div>
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
                className={`input input-bordered input-sm text-xs w-full ${formErrors.birthdate && attemptedSubmit ? 'input-error' : ''}`}
                value={formData.birthdate}
                onChange={handleChange}
                max={today}
                required
              />
              {formErrors.birthdate && attemptedSubmit && (
                <div className="text-error text-xs mt-1">{formErrors.birthdate}</div>
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
                className={`input input-bordered input-sm text-xs w-full ${formErrors.password && attemptedSubmit ? 'input-error' : ''}`}
                value={formData.password}
                onChange={handleChange}
                required
              />
              {formErrors.password && attemptedSubmit && (
                <div className="text-error text-xs mt-1">{formErrors.password}</div>
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
                className={`input input-bordered input-sm text-xs w-full ${formErrors.confirmPassword && attemptedSubmit ? 'input-error' : ''}`}
                value={formData.confirmPassword}
                onChange={handleChange}
                required
              />
              {formErrors.confirmPassword && attemptedSubmit && (
                <div className="text-error text-xs mt-1">{formErrors.confirmPassword}</div>
              )}
            </div>
            
            {/* Terms and Conditions */}
            <div className="form-control mt-1">
              <div className="flex items-center gap-2">
                <input 
                  type="checkbox" 
                  name="termsAgreed"
                  className="checkbox checkbox-primary checkbox-xs rounded-sm" 
                  checked={formData.termsAgreed}
                  onChange={handleChange}
                  disabled={!termsRead}
                  required
                />
                <span className="label-text text-xs text-shadow">
                  I agree to the {' '}
                  <button 
                    type="button" 
                    className="text-primary hover:underline font-semibold"
                    onClick={() => setTermsModalOpen(true)}
                  >
                    Terms & Conditions
                  </button>
                  <RequiredMark />
                </span>
              </div>
              {formErrors.termsAgreed && attemptedSubmit && (
                <div className="text-error text-xs mt-1">{formErrors.termsAgreed}</div>
              )}
            </div>
            
            {/* Submit Button */}
            <div className="form-control mt-3">
              <button 
                type="submit"
                className="btn btn-secondary btn-sm rounded-lg shadow-md" 
                disabled={loading}
              >
                {loading ? 'Creating account...' : 'Sign Up'}
              </button>
            </div>
            
            {/* Sign In Link */}
            <div className="text-center mt-2">
              <p className="text-xs text-shadow">Already have an account? {' '}
                <Link to="/login" className="text-primary font-semibold hover:underline">
                  Sign In
                </Link>
              </p>
            </div>
          </form>
        </div>

        {/* Terms and Conditions Modal Component */}
        <TermsAndConditionsModal 
          isOpen={termsModalOpen} 
          onClose={closeTermsModal} 
        />

        {/* Styles for text shadows */}
        <style jsx>{`
          .text-shadow {
            text-shadow: 0 1px 2px rgba(0,0,0,0.1);
          }
        `}</style>
      </div>
      <Footer />
    </>
  );
}