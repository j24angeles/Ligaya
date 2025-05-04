export default function LoginForm({ onSubmit, loading }) {
    const handleSubmit = (e) => {
      e.preventDefault();
      const formData = new FormData(e.target);
      const email = formData.get('email');
      const password = formData.get('password');
      onSubmit({ email, password });
    };
  
    return (
      <form onSubmit={handleSubmit} className="card-body">
        <div className="form-control">
          <label className="label">
            <span className="label-text">Email</span>
          </label>
          <input 
            type="email" 
            name="email"
            placeholder="email" 
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
            placeholder="password" 
            className="input input-bordered" 
            required 
          />
        </div>
        <div className="form-control mt-6">
          <button className="btn btn-primary" disabled={loading}>
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </div>
      </form>
    );
  }