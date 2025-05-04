export default function SignupForm({ onSubmit, loading }) {
    const handleSubmit = (e) => {
      e.preventDefault();
      const formData = new FormData(e.target);
      onSubmit({
        name: formData.get('name'),
        email: formData.get('email'),
        password: formData.get('password')
      });
    };
  
    return (
      <form onSubmit={handleSubmit} className="card-body">
        <div className="form-control">
          <label className="label">
            <span className="label-text">Full Name</span>
          </label>
          <input 
            type="text" 
            name="name"
            placeholder="John Doe" 
            className="input input-bordered" 
            required 
          />
        </div>
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
            {loading ? 'Creating account...' : 'Sign Up'}
          </button>
        </div>
      </form>
    );
  }