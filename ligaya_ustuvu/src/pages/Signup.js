import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { registerUser } from '../api/auth';
import SignupForm from '../components/SignupForm';

export default function Signup() {
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const handleSignup = async (userData) => {
    setLoading(true);
    setError('');
    try {
      await registerUser(userData);
      setSuccess(true);
      setTimeout(() => navigate('/login'), 2000);
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
            <h2 className="text-2xl font-bold text-center">Sign Up</h2>
            {error && <div className="alert alert-error">{error}</div>}
            {success ? (
              <div className="alert alert-success">
                Account created successfully! Redirecting to login...
              </div>
            ) : (
              <SignupForm onSubmit={handleSignup} loading={loading} />
            )}
            <div className="text-center mt-4">
              <p>Already have an account? <a href="/login" className="link">Login</a></p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}