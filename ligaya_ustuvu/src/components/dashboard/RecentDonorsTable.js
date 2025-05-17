// src/components/dashboard/RecentDonorsTable.js
import React, { useMemo } from 'react';

const RecentDonorsTable = ({ donations }) => {
  const recentDonors = useMemo(() => {
    // Sort donations by date (newest first)
    const sortedDonations = [...donations].sort((a, b) => {
      return new Date(b.createdAt) - new Date(a.createdAt);
    });
    
    // Get the top 5 most recent donations
    return sortedDonations.slice(0, 5);
  }, [donations]);

  const getStatusBadgeClass = (isValidated) => {
    if (isValidated === true) return 'bg-green-100 text-green-800';
    if (isValidated === false) return 'bg-yellow-100 text-yellow-800';
    return 'bg-gray-100 text-gray-800';
  };

  const getStatusText = (isValidated) => {
    if (isValidated === true) return 'Verified';
    if (isValidated === false) return 'Pending';
    return 'Unknown';
  };

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="p-6 pb-0">
        <h3 className="text-lg font-medium text-gray-700">Recent Donors</h3>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Name
              </th>
              <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Amount
              </th>
              <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Donation Status
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {recentDonors.length > 0 ? (
              recentDonors.map((donation) => (
                <tr key={donation.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {donation.donorName || `User ID: ${donation.userId}`}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <div className="text-sm font-medium text-gray-900">
                      ₱{parseFloat(donation.amount).toLocaleString('en-PH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeClass(donation.isValidated)}`}>
                      {getStatusText(donation.isValidated)}
                    </span>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="3" className="px-6 py-4 text-center text-sm text-gray-500">
                  No recent donations found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RecentDonorsTable;