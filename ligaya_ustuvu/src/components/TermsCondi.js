import React from 'react';

export default function TermsAndConditionsModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[80vh] flex flex-col">
      <div className="p-4 border-b border-gray-200 flex justify-between items-center">
  <h3 className="text-lg font-semibold">Terms & Conditions</h3>
  <button
    className="text-gray-400 hover:text-gray-600 text-xl font-bold focus:outline-none"
    onClick={onClose}
    aria-label="Close"
  >
    &times;
  </button>
</div>


        <div className="overflow-y-auto p-6 space-y-6 text-sm text-gray-800">
          <section>
            <h4 className="font-bold text-base mb-2">Agreement to Terms</h4>
            <p>
              Welcome to Ligaya and UST Volunteers for UNICEF website. These Terms and Conditions constitute a legally binding agreement made between you and Ligaya ("we," "us," or "our").
            </p>
            <p>
              By accessing or using our website, you agree to be bound by these Terms. If you disagree, please do not use the site.
            </p>
            <p className="text-xs text-gray-500 mt-1">Last Updated: May 6, 2025</p>
          </section>

          <section>
            <h4 className="font-bold text-base mb-2">Intellectual Property Rights</h4>
            <p>
              All content, trademarks, and materials on this website are owned by us or licensed to us. You may not copy, reuse, or redistribute any part for commercial purposes without permission.
            </p>
          </section>

          <section>
            <h4 className="font-bold text-base mb-2">User Representations</h4>
            <p>By using the website, you confirm that:</p>
            <ul className="list-disc list-inside space-y-1">
              <li>Your information is accurate and up to date.</li>
              <li>You are legally capable of agreeing to these terms.</li>
              <li>You will use the site lawfully and appropriately.</li>
              <li>You are not a bot or automated script.</li>
            </ul>
          </section>

          <section>
            <h4 className="font-bold text-base mb-2">Volunteer Registration</h4>
            <p>
              You may need to register to volunteer. You're responsible for the security and accuracy of your information. We reserve the right to limit access or remove accounts.
            </p>
          </section>

          <section>
            <h4 className="font-bold text-base mb-2">Donations</h4>
            <p>By donating, you agree that:</p>
            <ul className="list-disc list-inside space-y-1">
              <li>All donations are voluntary and non-refundable.</li>
              <li>You have legal authority to donate.</li>
              <li>The funds are not from illegal sources.</li>
              <li>You will provide correct and complete details.</li>
            </ul>
          </section>

          <section>
            <h4 className="font-bold text-base mb-2">Prohibited Activities</h4>
            <p>You may not use the site to:</p>
            <ul className="list-disc list-inside space-y-1">
              <li>Scrape or collect data without permission.</li>
              <li>Spread false information or malware.</li>
              <li>Use bots or scripts for automated access.</li>
              <li>Impersonate others or abuse users.</li>
              <li>Violate laws or site security measures.</li>
            </ul>
          </section>

          <section>
            <h4 className="font-bold text-base mb-2">User-Generated Content</h4>
            <p>
              Any content you submit (e.g., comments) can be used, copied, or shared by us. It will be treated as non-confidential and must follow our rules.
            </p>
          </section>

          <section>
            <h4 className="font-bold text-base mb-2">Third-Party Links</h4>
            <p>
              We may link to third-party sites. We are not responsible for their content, security, or privacy practices.
            </p>
          </section>

          <section>
            <h4 className="font-bold text-base mb-2">Site Management</h4>
            <p>We have the right to:</p>
            <ul className="list-disc list-inside space-y-1">
              <li>Monitor activity on the website.</li>
              <li>Remove harmful content.</li>
              <li>Limit access or disable accounts.</li>
              <li>Preserve website functionality.</li>
            </ul>
          </section>

          <section>
            <h4 className="font-bold text-base mb-2">Disclaimer</h4>
            <p>
              The website is provided "as is." We do not guarantee its accuracy, completeness, or performance. Use it at your own risk.
            </p>
          </section>

          <section>
            <h4 className="font-bold text-base mb-2">Limitation of Liability</h4>
            <p>
              We are not responsible for any damages resulting from your use of this website, including data loss or service interruptions.
            </p>
          </section>
        </div>

        <div className="p-4 border-t border-gray-200 flex justify-end">
          <button
            className="text-neutral btn btn-secondary btn-sm rounded-full"
            onClick={onClose}
          >
            I have read and understand
          </button>
        </div>
      </div>
    </div>
  );
}
