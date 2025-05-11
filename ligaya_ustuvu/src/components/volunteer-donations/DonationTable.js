// src/components/user-donation/DonationTable.js
import React from 'react';

const formatDate = (dateString) => {
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  return new Date(dateString).toLocaleDateString(undefined, options);
};

const formatPaymentMethod = (method) => {
  switch (method) {
    case 'cash':
      return 'Cash';
    case 'gcash':
      return 'GCash';
    case 'maya':
      return 'Maya';
    case 'bank_transfer':
      return 'Bank Transfer';
    default:
      return method;
  }
};

const DonationTable = ({ donations }) => {
  if (donations.length === 0) {
    return <p className="text-gray-500">You haven't made any donations yet.</p>;
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white">
        <thead>
          <tr>
            <th className="py-2 px-4 border-b border-gray-200 bg-gray-50 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
              Amount
            </th>
            <th className="py-2 px-4 border-b border-gray-200 bg-gray-50 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
              Date
            </th>
            <th className="py-2 px-4 border-b border-gray-200 bg-gray-50 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
              Method
            </th>
            <th className="py-2 px-4 border-b border-gray-200 bg-gray-50 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
              Reference
            </th>
            <th className="py-2 px-4 border-b border-gray-200 bg-gray-50 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
              Status
            </th>
          </tr>
        </thead>
        <tbody>
          {donations.map((donation) => (
            <tr key={donation.id}>
              <td className="py-2 px-4 border-b border-gray-200">₱{parseFloat(donation.amount).toFixed(2)}</td>
              <td className="py-2 px-4 border-b border-gray-200">{formatDate(donation.date)}</td>
              <td className="py-2 px-4 border-b border-gray-200">{formatPaymentMethod(donation.paymentMethod)}</td>
              <td className="py-2 px-4 border-b border-gray-200">{donation.referenceNumber || '-'}</td>
              <td className="py-2 px-4 border-b border-gray-200">
                <span className={`px-2 py-1 text-xs rounded-full ${donation.isValidated ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                  {donation.isValidated ? 'Verified' : 'Pending'}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DonationTable;