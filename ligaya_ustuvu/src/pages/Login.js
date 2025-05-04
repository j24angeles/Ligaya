import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginUser } from '../api/auth';
import LoginForm from '../components/LoginForm';

export default function Login() {
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (credentials) => {
    setLoading(true);
    setError('');
    try {
      const user = await loginUser(credentials.email, credentials.password);
      localStorage.setItem('user', JSON.stringify(user));
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
            <div className="text-center mt-4">
              <p>Don't have an account? <a href="/signup" className="link">Sign up</a></p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}