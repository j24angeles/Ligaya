// src/components/settings/HelpTab.js
import React from 'react';

const HelpTab = () => {
  const faqs = [
    {
      question: "How do I update my profile information?",
      answer:
        "Go to the Profile tab and click on any field you want to edit. After making changes, click the 'Save' button next to the field.",
    },
    {
      question: "Can I change my email address?",
      answer:
        "Yes, you can update your email address in the Profile tab. Make sure to use a valid email as it's used for account-related notifications.",
    },
    {
      question: "How do I view my donation history?",
      answer:
        "Your recent donations are shown on your dashboard. To view your full donation history, go to the Donations section in your profile.",
    },
    {
      question: "How can I participate in volunteer events?",
      answer:
        "Go to the Events page to browse upcoming opportunities. Click 'View Details' to learn more and register for an event.",
    },
    {
      question: "What should I do if I forgot my password?",
      answer:
        "Click the 'Forgot Password' link on the login page. You'll receive reset instructions via email.",
    },
    {
      question: "How do I donate through Ligaya?",
      answer:
        "You can fill out the donation form through the Donate page. Currently, Ligaya does not have a built-in payment portal, so you must transfer your donation directly using one of the supported methods.",
    },
    {
      question: "What are the accepted payment methods for donations?",
      answer:
        "We accept GCash, Maya, bank transfers, and cash. Cash donations can be made during official Ligaya events.",
    },
    {
      question: "How are donations verified?",
      answer:
        "After submitting your donation form, your donation status will be 'Pending' until it is manually verified by an admin. If the donation is 'Rejected,' the admin may provide a reason.",
    },
    {
      question: "Can I edit or delete a donation after submitting?",
      answer:
        "No, editing or deleting a donation is not supported. If you spot an error, please contact support so our admin can assist you.",
    },
    {
      question: "Where can I see events I joined or completed?",
      answer:
        "On your dashboard, you can see the count of events you've joined and completed. You can also view event details on the Events page.",
    },
  ];

  const contactInfo = [
    {
      type: "Email Support",
      value: "support@ligaya.com",
      description: "For general inquiries and account issues",
    },
    {
      type: "Phone Support",
      value: "+1 (555) 123-4567",
      description: "Available Monday to Friday, 9 AM - 5 PM",
    },
    {
      type: "Emergency Contact",
      value: "emergency@ligaya.com",
      description: "For urgent matters only",
    },
  ];

  return (
    <div className="p-8">
<div className="flex items-center mb-6">
          <div className="w-2 h-8 bg-secondary rounded-full mr-4"></div>
          <h2 className="text-xl font-bold text-primary">Help & Support</h2>
        </div>
      <div className="space-y-8">
        {/* Frequently Asked Questions */}
        <section>
          <h4 className="text-xl font-semibold text-gray-800 mb-4">Frequently Asked Questions</h4>
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
      </div>
    </div>
  );
};

export default HelpTab;
