import React, { useState } from 'react';
import { Search, ChevronDown, ChevronUp } from 'lucide-react';
import DonationDetailsModal from './DonationDetailsModal';

const formatDate = (dateString) => {
  const options = { year: 'numeric', month: 'short', day: 'numeric' };
  return new Date(dateString).toLocaleDateString(undefined, options);
};

const formatPaymentMethod = (method) => {
  const methods = {
    cash: 'Cash',
    gcash: 'GCash',
    maya: 'Maya',
    bank_transfer: 'Bank Transfer'
  };
  return methods[method] || method;
};

const statusStyles = {
  verified: 'bg-green-100 text-green-800',
  pending: 'bg-yellow-100 text-yellow-800',
  rejected: 'bg-red-100 text-red-800'
};

const DonationTable = ({ donations }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);
  const [filterMethod, setFilterMethod] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [sortConfig, setSortConfig] = useState({ key: 'date', direction: 'desc' });
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDonation, setSelectedDonation] = useState(null);

  // Only show active donations (filter out archived ones)
  const activeDonations = donations.filter(donation => 
    donation.status !== 'archived'
  );

  // Filter donations based on user criteria
  const filteredDonations = activeDonations.filter(donation => {
    const matchesSearch = 
      donation.referenceNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      donation.amount.toString().includes(searchTerm);

    // Fallback if the validationStatus is undefined
    const donationStatus = donation.validationStatus || 'pending'; 

    const statusMatch = filterStatus === 'all' || donationStatus.toLowerCase() === filterStatus.toLowerCase();
    const methodMatch = filterMethod === 'all' || donation.paymentMethod === filterMethod;

    return matchesSearch && statusMatch && methodMatch;
  });

  // Sort donations
  const sortedDonations = [...filteredDonations].sort((a, b) => {
    let aValue = a[sortConfig.key];
    let bValue = b[sortConfig.key];

    if (sortConfig.key === 'validationStatus') {
      const statusOrder = { 'validated': 1, 'pending': 2, 'rejected': 3 };
      aValue = statusOrder[a.validationStatus] || 0;
      bValue = statusOrder[b.validationStatus] || 0;
    }
    else if (sortConfig.key === 'date') {
      aValue = new Date(a.date).getTime();
      bValue = new Date(b.date).getTime();
    }
    else if (sortConfig.key === 'amount') {
      aValue = parseFloat(a.amount);
      bValue = parseFloat(b.amount);
    }

    if (aValue == null) return sortConfig.direction === 'asc' ? 1 : -1;
    if (bValue == null) return sortConfig.direction === 'asc' ? -1 : 1;
    if (aValue == null && bValue == null) return 0;

    if (aValue < bValue) {
      return sortConfig.direction === 'asc' ? -1 : 1;
    }
    if (aValue > bValue) {
      return sortConfig.direction === 'asc' ? 1 : -1;
    }
    return 0;
  });

  // Pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = sortedDonations.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(sortedDonations.length / itemsPerPage);

  const requestSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const getSortIcon = (key) => {
    if (sortConfig.key !== key) return null;
    return sortConfig.direction === 'asc' ? <ChevronUp size={16} /> : <ChevronDown size={16} />;
  };

  if (activeDonations.length === 0) {
    return (
      <div className="text-center py-8">
        <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <h3 className="mt-2 text-sm font-medium text-gray-900">No donations yet</h3>
        <p className="mt-1 text-sm text-gray-500">Your donations will appear here once you make one.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Search and Filters */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <Search size={18} className="text-gray-400" />
          </div>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by reference or amount..."
            className="block w-full p-2 pl-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
        
        <div className="flex items-center gap-4">
          <div className="flex items-center">
            <span className="mr-2 text-sm text-gray-600">Method:</span>
            <select
              value={filterMethod}
              onChange={(e) => setFilterMethod(e.target.value)}
              className="border border-gray-300 rounded-md p-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="all">All Methods</option>
              <option value="cash">Cash</option>
              <option value="gcash">GCash</option>
              <option value="maya">Maya</option>
              <option value="bank_transfer">Bank Transfer</option>
            </select>
          </div>
          
          <div className="flex items-center">
            <span className="mr-2 text-sm text-gray-600">Status:</span>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="border border-gray-300 rounded-md p-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="all">All Statuses</option>
              <option value="validated">Verified</option>
              <option value="pending">Pending</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-hidden border border-gray-200 rounded-lg">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th 
                scope="col" 
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                onClick={() => requestSort('amount')}
              >
                <div className="flex items-center">
                  Amount {getSortIcon('amount')}
                </div>
              </th>
              <th 
                scope="col" 
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                onClick={() => requestSort('date')}
              >
                <div className="flex items-center">
                  Date {getSortIcon('date')}
                </div>
              </th>
              <th 
                scope="col" 
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                onClick={() => requestSort('paymentMethod')}
              >
                <div className="flex items-center">
                  Method {getSortIcon('paymentMethod')}
                </div>
              </th>
              <th 
                scope="col" 
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                onClick={() => requestSort('validationStatus')}
              >
                <div className="flex items-center">
                  Status {getSortIcon('validationStatus')}
                </div>
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {currentItems.map((donation) => (
              <tr 
                key={donation.id} 
                className="hover:bg-gray-50 cursor-pointer"
                onClick={() => setSelectedDonation(donation)}
              >
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  ₱{parseFloat(donation.amount).toFixed(2)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {formatDate(donation.date)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {formatPaymentMethod(donation.paymentMethod)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    donation.validationStatus === 'validated' 
                      ? statusStyles.verified 
                      : donation.validationStatus === 'rejected' 
                        ? statusStyles.rejected 
                        : statusStyles.pending
                  }`}>
                    {donation.validationStatus === 'validated' ? 'Verified' : donation.validationStatus === 'rejected' ? 'Rejected' : 'Pending'}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex flex-col sm:flex-row items-center justify-between mt-4 gap-4 sm:gap-0">
          <div className="text-sm text-gray-700">
            Showing <span className="font-medium">{indexOfFirstItem + 1}</span> to{' '}
            <span className="font-medium">
              {Math.min(indexOfLastItem, sortedDonations.length)}
            </span>{' '}
            of <span className="font-medium">{sortedDonations.length}</span> donations
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className={`p-2 rounded-md border ${
                currentPage === 1 
                  ? 'text-gray-300 border-gray-200 cursor-not-allowed' 
                  : 'text-gray-600 border-gray-300 hover:bg-gray-50'
              }`}
            >
              Previous
            </button>
            
            <div className="hidden sm:flex space-x-1">
              {Array.from({ length: Math.min(5, totalPages) }).map((_, idx) => {
                let pageNum;
                if (totalPages <= 5) {
                  pageNum = idx + 1;
                } else if (currentPage <= 3) {
                  pageNum = idx + 1;
                } else if (currentPage >= totalPages - 2) {
                  pageNum = totalPages - 4 + idx;
                } else {
                  pageNum = currentPage - 2 + idx;
                }
                
                return (
                  <button
                    key={pageNum}
                    onClick={() => setCurrentPage(pageNum)}
                    className={`w-8 h-8 flex items-center justify-center rounded-md border ${
                      currentPage === pageNum
                        ? 'bg-primary text-white border-primary'
                        : 'text-gray-600 border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}
            </div>
            
            <span className="sm:hidden text-sm">
              Page {currentPage} of {totalPages}
            </span>
            
            <button
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className={`p-2 rounded-md border ${
                currentPage === totalPages 
                  ? 'text-gray-300 border-gray-200 cursor-not-allowed' 
                  : 'text-gray-600 border-gray-300 hover:bg-gray-50'
              }`}
            >
              Next
            </button>
          </div>
        </div>
      )}

      {/* Donation Details Modal */}
      {selectedDonation && (
        <DonationDetailsModal 
          donation={selectedDonation} 
          onClose={() => setSelectedDonation(null)} 
        />
      )}
    </div>
  );
};

export default DonationTable;