import React from 'react';

export default function TermsAndConditionsModal({ isOpen, onClose }) {
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[80vh] flex flex-col">
        <div className="p-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold">Terms & Conditions</h3>
        </div>
        
        <div className="overflow-y-auto p-4 flex-1">
          <div className="prose max-w-none">
            <h2 className="text-xl font-bold">Agreement to Terms</h2>
            <p>
              Welcome to Ligaya and UST Volunteers for UNICEF website. These Terms and Conditions constitute a legally binding agreement made between you and Ligaya ("we," "us," or "our"), concerning your access to and use of our website.
            </p>
            <p>
              By accessing or using our website, you agree to be bound by these Terms and Conditions. If you disagree with any part of these terms, you may not access the website.
            </p>
            <p className="text-sm text-gray-600">Last Updated: May 6, 2025</p>
            
            <h3 className="text-lg font-semibold mt-4">Intellectual Property Rights</h3>
            <p>
              Unless otherwise indicated, the website is our proprietary property and all source code, databases, functionality, software, website designs, audio, video, text, photographs, and graphics on the site (collectively, the "Content") and the trademarks, service marks, and logos contained therein (the "Marks") are owned or controlled by us or licensed to us, and are protected by copyright and trademark laws and various other intellectual property rights.
            </p>
            
            <h3 className="text-lg font-semibold mt-4">User Representations</h3>
            <p>By using the website, you represent and warrant that:</p>
            <ul>
              <li>All information you provide is true, accurate, current, and complete.</li>
              <li>You have the legal capacity to agree to these Terms and Conditions.</li>
              <li>You are not a minor in the jurisdiction in which you reside, or if you are a minor, you have received parental permission to use the site.</li>
              <li>You will not access the website through automated or non-human means.</li>
              <li>You will not use the website for any illegal or unauthorized purpose.</li>
              <li>Your use of the website will not violate any applicable law or regulation.</li>
            </ul>
            
            <h3 className="text-lg font-semibold mt-4">Volunteer Registration</h3>
            <p>
              To register as a volunteer, you may be asked to provide certain information, including your name, email address, phone number, and other relevant details. You agree to provide accurate and complete information during the registration process and to update such information to keep it accurate and current.
            </p>
            
            {/* Additional terms content would continue here */}
            {/* For brevity, I'm only including a portion of the terms */}
          </div>
        </div>
        
        <div className="p-4 border-t border-gray-200 flex justify-end">
          <button 
            className="btn btn-primary btn-sm rounded-lg"
            onClick={onClose}
          >
            I have read and understand
          </button>
        </div>
      </div>
    </div>
  );
}