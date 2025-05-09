import { Link } from 'react-router-dom';
import LoginForm from '../components/LoginForm'; // Import the separate form component
import Navbar from '../common/Navbar';
import Footer from '../common/Footer';

export default function Login() {
  return (
    <>
      <Navbar />
      <div
        className="min-h-screen py-12 bg-cover bg-center flex items-center justify-center"
        style={{ backgroundImage: "url('/assets/login_bg.png')" }}
      >
        <div className="w-full max-w-md">
          <LoginForm />
        </div>
      </div>
      <Footer />
    </>
  );
}