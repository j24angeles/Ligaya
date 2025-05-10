import React from 'react';

const SupportTab = ({ 
  setShowContactModal, 
  setShowPrivacyModal, 
  setShowTermsModal 
}) => {
  return (
    <div className="p-4">
      <div className="space-y-4">
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="flex items-center mb-3">
            <div className="w-10 h-10 rounded-full bg-primary bg-opacity-10 flex items-center justify-center mr-3">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </div>
            <div>
              <h4 className="font-medium">Need help?</h4>
              <p className="text-sm text-gray-500">Have questions or concerns regarding your account?</p>
            </div>
          </div>
          <button 
            onClick={() => setShowContactModal(true)}
            className="w-full bg-primary text-white py-2 rounded-md hover:bg-accent transition"
          >
            Chat with us
          </button>
        </div>

        <div className="bg-gray-50 rounded-lg p-4">
          <h4 className="font-medium mb-3">Legal Documents</h4>

          <div className="flex items-center justify-between mb-3 pb-3 border-b border-gray-200">
            <div>
              <h5 className="font-medium">Privacy Policy</h5>
              <p className="text-sm text-gray-500">How we handle your data</p>
            </div>
            <button 
              onClick={() => setShowPrivacyModal(true)}
              className="px-3 py-1 bg-secondary text-primary rounded-md font-medium hover:bg-opacity-80 transition"
            >
              Read
            </button>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <h5 className="font-medium">Terms of Use</h5>
              <p className="text-sm text-gray-500">Rules for using our service</p>
            </div>
            <button 
              onClick={() => setShowTermsModal(true)}
              className="px-3 py-1 bg-secondary text-primary rounded-md font-medium hover:bg-opacity-80 transition"
            >
              Read
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SupportTab;