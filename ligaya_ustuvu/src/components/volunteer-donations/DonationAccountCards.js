import React from 'react';

const DonationAccountCards = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
      {/* Card Template */}
      {[
        {
          title: 'GCash',
          img: '/assets/bank/gcash.png',
          name: 'Ligaya Community Foundation',
          contactLabel: 'Mobile Number',
          contact: '0927 111 1111',
        },
        {
          title: 'Maya',
          img: '/assets/bank/maya.png',
          name: 'Ligaya Community Foundation',
          contactLabel: 'Mobile Number',
          contact: '0927 111 1111',
        },
        {
          title: 'BDO Bank Transfer',
          img: '/assets/bank/bdo.png',
          name: 'Ligaya Community Foundation',
          contactLabel: 'Account Number',
          contact: '1234 5678 9012',
        },
      ].map(({ title, img, name, contactLabel, contact }) => (
        <div key={title} className="bg-white rounded-md shadow border border-gray-200">
          <div className="flex items-start p-3">
            <div className="p-1.5 rounded-full mr-2">
              <img src={img} alt={title} className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-800 mb-1">{title}</h3>
              <div className="space-y-0.5">
                <div>
                  <p className="text-xs text-gray-500">Account Name</p>
                  <p className="text-xs">{name}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">{contactLabel}</p>
                  <p className="text-xs font-mono">{contact}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default DonationAccountCards;
