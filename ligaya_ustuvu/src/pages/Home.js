import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-primary to-secondary">
      {/* Navigation Bar */}
      <nav className="navbar bg-base-100 shadow-lg">
        <div className="flex-1">
          <Link to="/" className="btn btn-ghost normal-case text-xl">
            <img src="/logo.png" alt="Ligaya Logo" className="h-8 mr-2" />
            Ligaya
          </Link>
        </div>
        <div className="flex-none">
          <ul className="menu menu-horizontal px-1">
            <li><Link to="/login" className="btn btn-ghost">Login</Link></li>
            <li><Link to="/signup" className="btn btn-primary">Sign Up</Link></li>
          </ul>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="hero min-h-[70vh] text-white">
        <div className="hero-content text-center">
          <div className="max-w-2xl">
            <h1 className="text-5xl font-bold mb-6">Empower Children Through Volunteering</h1>
            <p className="text-xl mb-8">
              Join Ligaya in creating meaningful change for children's education and well-being.
              Partnered with UST Volunteers for UNICEF to support SDG 4 (Quality Education) and SDG 3 (Good Health).
            </p>
            <div className="flex justify-center gap-4">
              <Link to="/signup" className="btn btn-accent btn-lg">Become a Volunteer</Link>
              <Link to="/events" className="btn btn-outline btn-lg text-white">View Events</Link>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 text-primary">How It Works</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="card bg-base-100 shadow-xl">
              <div className="card-body items-center text-center">
                <div className="text-4xl mb-4">1</div>
                <h3 className="card-title">Create Account</h3>
                <p>Register as a volunteer in just 2 minutes</p>
              </div>
            </div>
            <div className="card bg-base-100 shadow-xl">
              <div className="card-body items-center text-center">
                <div className="text-4xl mb-4">2</div>
                <h3 className="card-title">Browse Opportunities</h3>
                <p>Find child advocacy events that match your skills</p>
              </div>
            </div>
            <div className="card bg-base-100 shadow-xl">
              <div className="card-body items-center text-center">
                <div className="text-4xl mb-4">3</div>
                <h3 className="card-title">Make an Impact</h3>
                <p>Volunteer your time or donate to support causes</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Upcoming Events Preview */}
      <div className="py-16 bg-base-200">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 text-primary">Upcoming Events</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Sample event cards - these would be dynamic in a real app */}
            <div className="card bg-white shadow-xl">
              <figure><img src="/event1.jpg" alt="Back to School" /></figure>
              <div className="card-body">
                <h3 className="card-title">Back-to-School Drive</h3>
                <p>Aug 15, 2023 • UST Plaza Mayor</p>
                <p>Collecting school supplies for underprivileged children</p>
                <div className="card-actions justify-end">
                  <button className="btn btn-primary">Learn More</button>
                </div>
              </div>
            </div>
            <div className="card bg-white shadow-xl">
              <figure><img src="/event2.jpg" alt="Health Seminar" /></figure>
              <div className="card-body">
                <h3 className="card-title">Child Health Seminar</h3>
                <p>Sep 10, 2023 • Barangay 123 Center</p>
                <p>Educating parents about child nutrition</p>
                <div className="card-actions justify-end">
                  <button className="btn btn-primary">Learn More</button>
                </div>
              </div>
            </div>
            <div className="card bg-white shadow-xl">
              <figure><img src="/event3.jpg" alt="Reading Program" /></figure>
              <div className="card-body">
                <h3 className="card-title">Reading Buddies Program</h3>
                <p>Oct 5, 2023 • Local Elementary School</p>
                <p>Help children improve their reading skills</p>
                <div className="card-actions justify-end">
                  <button className="btn btn-primary">Learn More</button>
                </div>
              </div>
            </div>
          </div>
          <div className="text-center mt-8">
            <Link to="/events" className="btn btn-outline btn-primary">View All Events</Link>
          </div>
        </div>
      </div>

      {/* Call to Action */}
      <div className="py-16 bg-primary text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to Make a Difference?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Join our community of volunteers dedicated to improving children's lives through education and health initiatives.
          </p>
          <Link to="/signup" className="btn btn-accent btn-lg">Get Started Today</Link>
        </div>
      </div>

      {/* Footer */}
      <footer className="footer p-10 bg-neutral text-neutral-content">
        <div>
          <img src="/logo.png" alt="Ligaya Logo" className="h-12" />
          <p>Ligaya Volunteer Platform<br/>Partnered with UST UVU</p>
        </div> 
        <div>
          <span className="footer-title">Quick Links</span> 
          <Link to="/" className="link link-hover">Home</Link>
          <Link to="/about" className="link link-hover">About Us</Link>
          <Link to="/events" className="link link-hover">Events</Link>
          <Link to="/contact" className="link link-hover">Contact</Link>
        </div> 
        <div>
          <span className="footer-title">Legal</span> 
          <Link to="/privacy" className="link link-hover">Privacy Policy</Link>
          <Link to="/terms" className="link link-hover">Terms of Service</Link>
        </div>
      </footer>
    </div>
  );
}