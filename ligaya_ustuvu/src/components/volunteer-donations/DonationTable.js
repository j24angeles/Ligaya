import React from 'react';

const DonationTable = ({ donations, loading }) => {
  // Format payment method for display
  const formatPaymentMethod = (method) => {
    switch (method) {
      case 'gcash':
        return 'GCash';
      case 'maya':
        return 'Maya';
      case 'bank_transfer':
        return 'Bank Transfer';
      case 'cash':
        return 'Cash';
      default:
        return method;
    }
  };

  // Format amount as PHP currency
  const formatAmount = (amount) => {
    return new Intl.NumberFormat('en-PH', {
      style: 'currency',
      currency: 'PHP',
    }).format(amount);
  };

  // Format date for display
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-PH', {
      year: 'numeric', 
      month: 'long', 
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    );
  }

  if (donations.length === 0) {
    return (
      <div className="text-center py-10">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
        </svg>
        <p className="mt-4 text-gray-600">You haven't made any donations yet.</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="table w-full">
        <thead>
          <tr>
            <th className="bg-primary text-white">Date</th>
            <th className="bg-primary text-white">Amount</th>
            <th className="bg-primary text-white">Payment Method</th>
            <th className="bg-primary text-white">Reference #</th>
            <th className="bg-primary text-white">Status</th>
          </tr>
        </thead>
        <tbody>
          {donations.map((donation) => (
            <tr key={donation.id}>
              <td>{formatDate(donation.date)}</td>
              <td>{formatAmount(donation.amount)}</td>
              <td>{formatPaymentMethod(donation.paymentMethod)}</td>
              <td>{donation.referenceNumber || 'N/A'}</td>
              <td>
                <span className={`badge ${donation.isValidated ? 'badge-success' : 'badge-warning'}`}>
                  {donation.isValidated ? 'Validated' : 'Pending'}
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