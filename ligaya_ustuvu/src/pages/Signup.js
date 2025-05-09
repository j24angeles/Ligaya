import { Link } from 'react-router-dom';
import SignupForm from '../components/SignupForm'; // Ensure this path matches your project structure
import Navbar from '../common/Navbar';
import Footer from '../common/Footer';

export default function Signup() {
  return (
    <>
      <Navbar />
      <div
        className="min-h-screen py-12 bg-cover bg-center flex items-center justify-center"
        style={{ backgroundImage: "url('/assets/login_bg.png')" }}
      >
        <div className="w-full max-w-md">
          <SignupForm />
          
        
        </div>
      </div>
      <Footer />
    </>
  );
}