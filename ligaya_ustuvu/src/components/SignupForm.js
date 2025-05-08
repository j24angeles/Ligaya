import { useState } from 'react';

export default function SignupForm({ onSubmit, loading }) {
  const [passwordError, setPasswordError] = useState('');
  
  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    
    const password = formData.get('password');
    const confirmPassword = formData.get('confirmPassword');
    
    if (password !== confirmPassword) {
      setPasswordError('Passwords do not match');
      return;
    }
    
    onSubmit({
      firstName: formData.get('firstName'),
      lastName: formData.get('lastName'),
      email: formData.get('email'),
      password: formData.get('password'),
      birthdate: formData.get('birthdate')
    });
  };
  
  return (
    <form onSubmit={handleSubmit} className="card-body">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="form-control">
          <label className="label">
            <span className="label-text">First Name</span>
          </label>
          <input 
            type="text"
            name="firstName"
            placeholder="John"
            className="input input-bordered"
            required
          />
        </div>
        <div className="form-control">
          <label className="label">
            <span className="label-text">Last Name</span>
          </label>
          <input 
            type="text"
            name="lastName"
            placeholder="Doe"
            className="input input-bordered"
            required
          />
        </div>
      </div>
      
      <div className="form-control">
        <label className="label">
          <span className="label-text">Email</span>
        </label>
        <input 
          type="email"
          name="email"
          placeholder="email@example.com"
          className="input input-bordered"
          required
        />
      </div>
      
      <div className="form-control">
        <label className="label">
          <span className="label-text">Birthdate</span>
        </label>
        <input 
          type="date"
          name="birthdate"
          className="input input-bordered"
          required
        />
      </div>
      
      <div className="form-control">
        <label className="label">
          <span className="label-text">Password</span>
        </label>
        <input 
          type="password"
          name="password"
          placeholder="Enter password"
          className="input input-bordered"
          required
        />
      </div>
      
      <div className="form-control">
        <label className="label">
          <span className="label-text">Confirm Password</span>
        </label>
        <input 
          type="password"
          name="confirmPassword"
          placeholder="Confirm password"
          className="input input-bordered"
          required
        />
        {passwordError && (
          <label className="label">
            <span className="label-text-alt text-error">{passwordError}</span>
          </label>
        )}
      </div>
      
      <div className="form-control mt-6">
        <button className="btn btn-primary" disabled={loading}>
          {loading ? 'Creating account...' : 'Sign Up'}
        </button>
      </div>
    </form>
  );
}