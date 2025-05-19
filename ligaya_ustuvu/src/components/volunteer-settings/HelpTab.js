// src/components/settings/HelpTab.js
import React from 'react';

const HelpTab = () => {
  const faqs = [
    {
      question: "How do I update my profile information?",
      answer: "Go to the Profile tab and click on any field you want to edit. After making changes, click the 'Save' button next to the field."
    },
    {
      question: "Can I change my email address?",
      answer: "Yes, you can update your email address in the Profile tab. Make sure to use a valid email address as it will be used for account notifications."
    },
    {
      question: "How do I view my donation history?",
      answer: "Your recent donations are displayed on your dashboard. For a complete history, check the donations section in your profile."
    },
    {
      question: "How can I participate in events?",
      answer: "Browse upcoming events on your dashboard and click on any event to view details and register for participation."
    },
    {
      question: "What should I do if I forgot my password?",
      answer: "Use the 'Forgot Password' link on the login page to reset your password. You'll receive instructions via email."
    }
  ];

  const contactInfo = [
    {
      type: "Email Support",
      value: "support@ligaya.com",
      description: "For general inquiries and account issues"
    },
    {
      type: "Phone Support",
      value: "+1 (555) 123-4567",
      description: "Available Monday to Friday, 9 AM - 5 PM"
    },
    {
      type: "Emergency Contact",
      value: "emergency@ligaya.com",
      description: "For urgent matters only"
    }
  ];

  return (
    <div className="p-8">
      <h2 className="text-2xl font-bold text-gray-900 mb-8">Help & Support</h2>
      
      <div className="space-y-8">
        {/* Frequently Asked Questions */}
        <section>
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Frequently Asked Questions</h3>
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-4">
                <h4 className="font-medium text-gray-900 mb-2">{faq.question}</h4>
                <p className="text-gray-600 text-sm leading-relaxed">{faq.answer}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Contact Information */}
        <section>
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Contact Us</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {contactInfo.map((contact, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-4">
                <h4 className="font-medium text-gray-900 mb-1">{contact.type}</h4>
                <p className="text-blue-600 font-medium mb-1">{contact.value}</p>
                <p className="text-gray-600 text-sm">{contact.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Quick Actions */}
        <section>
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Quick Actions</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <button className="text-left p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
              <h4 className="font-medium text-gray-900 mb-1">Report an Issue</h4>
              <p className="text-gray-600 text-sm">Tell us about any problems you're experiencing</p>
            </button>
            <button className="text-left p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
              <h4 className="font-medium text-gray-900 mb-1">Request a Feature</h4>
              <p className="text-gray-600 text-sm">Suggest improvements or new features</p>
            </button>
            <button className="text-left p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
              <h4 className="font-medium text-gray-900 mb-1">Account Assistance</h4>
              <p className="text-gray-600 text-sm">Get help with your account settings</p>
            </button>
            <button className="text-left p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
              <h4 className="font-medium text-gray-900 mb-1">Technical Support</h4>
              <p className="text-gray-600 text-sm">Get help with technical issues</p>
            </button>
          </div>
        </section>

        {/* System Information */}
        <section>
          <h3 className="text-xl font-semibold text-gray-800 mb-4">System Information</h3>
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div>
                <span className="font-medium text-gray-700">Version:</span>
                <span className="ml-2 text-gray-600">2.1.0</span>
              </div>
              <div>
                <span className="font-medium text-gray-700">Last Updated:</span>
                <span className="ml-2 text-gray-600">May 2025</span>
              </div>
              <div>
                <span className="font-medium text-gray-700">Status:</span>
                <span className="ml-2 text-green-600">All systems operational</span>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default HelpTab;