import React from 'react';

const DonationToggle = ({ activeTab, onChange }) => {
  return (
    <div className="flex justify-center">
      <div className="tabs tabs-boxed">
        <button
          className={`tab ${activeTab === 'donate' ? 'tab-active bg-secondary text-white' : ''}`}
          onClick={() => onChange('donate')}
        >
          Donate Now
        </button>
        <button
          className={`tab ${activeTab === 'history' ? 'tab-active bg-secondary text-white' : ''}`}
          onClick={() => onChange('history')}
        >
          See Past Donations
        </button>
      </div>
    </div>
  );
};

export default DonationToggle;