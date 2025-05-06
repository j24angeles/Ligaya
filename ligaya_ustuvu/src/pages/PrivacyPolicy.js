import React from 'react';
import { Link } from 'react-router-dom';
import Footer from '../common/Footer';

const PrivacyPolicy = () => {
  // Scroll to top when component mounts
  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="font-poppins">
      {/* Header Banner */}
      <div className="bg-primary text-white py-16">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold mb-4">Privacy Policy</h1>
          <p className="text-lg">How Ligaya collects, uses, and protects your information</p>
          <div className="flex gap-2 mt-4 text-sm">
            <Link to="/" className="hover:underline">Home</Link>
            <span>/</span>
            <span className="opacity-70">Privacy Policy</span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto bg-white p-8 rounded-lg shadow-lg">
          
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-primary mb-4">Introduction</h2>
            <p className="mb-4">
              At Ligaya, in partnership with UST Volunteers for UNICEF, we are committed to protecting your privacy. 
              This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit 
              our website or use our services.
            </p>
            <p className="mb-4">
              We respect your privacy and are dedicated to transparent information practices. Please read this policy carefully. 
              By accessing or using our website, you acknowledge that you have read and understood this Privacy Policy.
            </p>
            <p>
              Last Updated: May 6, 2025
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-primary mb-4">Information We Collect</h2>
            
            <h3 className="text-xl font-semibold text-primary mb-2">Personal Information</h3>
            <p className="mb-4">
              We may collect personal information that you voluntarily provide when you:
            </p>
            <ul className="list-disc pl-6 mb-4 space-y-2">
              <li>Register as a volunteer</li>
              <li>Sign up for our newsletter</li>
              <li>Make a donation</li>
              <li>Contact us through our website</li>
              <li>Participate in surveys or events</li>
            </ul>
            <p className="mb-4">
              This information may include your name, email address, phone number, mailing address, payment information, 
              and any other information you choose to provide.
            </p>

            <h3 className="text-xl font-semibold text-primary mb-2">Automatically Collected Information</h3>
            <p className="mb-4">
              When you visit our website, we may automatically collect certain information about your device, including:
            </p>
            <ul className="list-disc pl-6 mb-4 space-y-2">
              <li>IP address</li>
              <li>Browser type and version</li>
              <li>Pages you visit</li>
              <li>Time and date of your visit</li>
              <li>Time spent on pages</li>
              <li>Referring website addresses</li>
              <li>Other diagnostic data</li>
            </ul>
            
            <h3 className="text-xl font-semibold text-primary mb-2">Cookies and Similar Technologies</h3>
            <p className="mb-4">
              We use cookies and similar tracking technologies to track activity on our website and store certain information. 
              Cookies are files with a small amount of data which may include an anonymous unique identifier. 
              You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-primary mb-4">How We Use Your Information</h2>
            <p className="mb-4">
              We may use the information we collect for various purposes, including to:
            </p>
            <ul className="list-disc pl-6 mb-4 space-y-2">
              <li>Provide, maintain, and improve our services</li>
              <li>Process donations and volunteer applications</li>
              <li>Send administrative information, such as confirmations, receipts, and updates</li>
              <li>Respond to your comments, questions, and requests</li>
              <li>Send you communications about events, fundraising campaigns, and other news</li>
              <li>Monitor and analyze trends, usage, and activities in connection with our services</li>
              <li>Protect against, identify, and prevent fraud and other illegal activity</li>
              <li>Comply with legal obligations</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-primary mb-4">Information Sharing and Disclosure</h2>
            <p className="mb-4">
              We may share your information in the following situations:
            </p>
            <ul className="list-disc pl-6 mb-4 space-y-2">
              <li><strong>With Service Providers:</strong> We may share your information with third-party vendors, consultants, and other service providers who perform services on our behalf.</li>
              <li><strong>For Legal Reasons:</strong> We may disclose your information if we believe it is necessary to comply with a legal obligation, protect and defend our rights or property, prevent fraud, or protect the safety of our users or the public.</li>
              <li><strong>With Your Consent:</strong> We may share your information with third parties when you have given us your consent to do so.</li>
              <li><strong>Non-personally Identifiable Information:</strong> We may share aggregated or anonymized information that does not directly identify you.</li>
            </ul>
            <p className="mb-4">
              <strong>We do not sell, rent, or trade your personal information with third parties for their marketing purposes.</strong>
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-primary mb-4">Children's Privacy</h2>
            <p className="mb-4">
              Our website is not intended for children under 13 years of age. We do not knowingly collect personal information 
              from children under 13. If you are a parent or guardian and believe your child has provided us with personal 
              information, please contact us, and we will delete such information from our records.
            </p>
            <p className="mb-4">
              For activities involving children, we obtain appropriate parental consent before collecting any personal information.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-primary mb-4">Your Rights and Choices</h2>
            <p className="mb-4">
              You have certain rights regarding your personal information, including:
            </p>
            <ul className="list-disc pl-6 mb-4 space-y-2">
              <li><strong>Access:</strong> You can request access to the personal information we have about you.</li>
              <li><strong>Correction:</strong> You can request that we correct inaccurate or incomplete information.</li>
              <li><strong>Deletion:</strong> You can request that we delete your personal information.</li>
              <li><strong>Objection:</strong> You can object to our processing of your personal information.</li>
              <li><strong>Opt-out:</strong> You can opt-out of receiving promotional communications from us by following the instructions in those communications.</li>
            </ul>
            <p className="mb-4">
              To exercise these rights, please contact us using the information provided at the end of this Privacy Policy.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-primary mb-4">Data Security</h2>
            <p className="mb-4">
              We have implemented appropriate technical and organizational security measures to protect your personal information 
              from unauthorized access, disclosure, alteration, and destruction. However, no Internet or email transmission 
              is ever fully secure or error-free. In particular, email sent to or from our website may not be secure. Therefore, 
              you should take special care in deciding what information you send to us via email.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-primary mb-4">International Data Transfers</h2>
            <p className="mb-4">
              Your information may be transferred to, and maintained on, computers located outside of your state, province, 
              country, or other governmental jurisdiction where the data protection laws may differ from those in your jurisdiction. 
              If you are located outside the Philippines and choose to provide information to us, please note that we transfer 
              the data to the Philippines and process it there.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-primary mb-4">Changes to This Privacy Policy</h2>
            <p className="mb-4">
              We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy 
              Policy on this page and updating the "Last Updated" date at the top of this Privacy Policy. You are advised to 
              review this Privacy Policy periodically for any changes.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-primary mb-4">Contact Us</h2>
            <p className="mb-4">
              If you have any questions about this Privacy Policy, please contact us at:
            </p>
            <div className="bg-blue-50 p-6 rounded-lg">
              <p className="mb-2"><strong>Ligaya & UST Volunteers for UNICEF</strong></p>
              <p className="mb-2">Email: privacy@ligaya.org</p>
              <p className="mb-2">Phone: (02) 8-123-4567</p>
              <p>Address: University of Santo Tomas, España Blvd, Sampaloc, Manila, Philippines</p>
            </div>
          </section>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default PrivacyPolicy;