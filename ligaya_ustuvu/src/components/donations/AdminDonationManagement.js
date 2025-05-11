import React, { useState, useEffect } from 'react';
import { Plus, Search, AlertCircle, Edit, Check, X, DollarSign, Calendar, CreditCard, Image, ChevronDown, ChevronUp, RefreshCw, ChevronLeft, ChevronRight } from 'lucide-react';
import DonationFormModal from './DonationFormModal';
import ConfirmationModal from '../../components/ConfirmationModal';
import { useToast } from '../../hooks/ToastProvider';
import { getAllDonations, createDonation, updateDonation, deleteDonation } from '../../api/donationService';
import { getAllUsers } from '../../api/userService';

const AdminDonationManagement = () => {
  const [donations, setDonations] = useState([]);
  const [volunteers, setVolunteers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [currentDonation, setCurrentDonation] = useState(null);
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortField, setSortField] = useState('date');
  const [sortDirection, setSortDirection] = useState('desc');
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [confirmationConfig, setConfirmationConfig] = useState({
    title: '',
    message: '',
    type: 'info',
    onConfirm: () => {},
    confirmText: 'Confirm',
    cancelText: 'Cancel'
  });
  const [currentPage, setCurrentPage] = useState(1);
  const donationsPerPage = 10;

  const { showSuccess, showError, showInfo } = useToast();

  const fetchDonations = async () => {
    setIsLoading(true);
    try {
      const data = await getAllDonations();
      setDonations(data);
      setError(null);
    } catch (err) {
      setError(err.message);
      showError(`Failed to load donations: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchVolunteers = async () => {
    try {
      const data = await getAllUsers();
      setVolunteers(data.filter(user => user.role === 'volunteer'));
    } catch (err) {
      console.error('Error fetching volunteers:', err);
    }
  };

  useEffect(() => {
    fetchDonations();
    fetchVolunteers();
  }, []);

  const openConfirmationModal = (config) => {
    setConfirmationConfig(config);
    setShowConfirmationModal(true);
  };

  const handleSubmitDonation = async (donationData) => {
    if (currentDonation) {
      openConfirmationModal({
        title: "Update Donation",
        message: "Are you sure you want to update this donation record?",
        type: "info",
        onConfirm: async () => {
          setIsLoading(true);
          try {
            await updateDonation(currentDonation.id, donationData);
            await fetchDonations();
            setShowModal(false);
            setCurrentDonation(null);
            showSuccess("Donation was updated successfully");
          } catch (err) {
            setError(err.message);
            showError(`Failed to update donation: ${err.message}`);
          } finally {
            setIsLoading(false);
          }
        },
        confirmText: "Update",
        cancelText: "Cancel"
      });
    } else {
      openConfirmationModal({
        title: "Add New Donation",
        message: "Are you sure you want to add this donation record?",
        type: "info",
        onConfirm: async () => {
          setIsLoading(true);
          try {
            await createDonation(donationData);
            await fetchDonations();
            setShowModal(false);
            showSuccess("Donation was added successfully");
          } catch (err) {
            setError(err.message);
            showError(`Failed to add donation: ${err.message}`);
          } finally {
            setIsLoading(false);
          }
        },
        confirmText: "Add Donation",
        cancelText: "Cancel"
      });
    }
  };

  const handleEdit = (donation) => {
    setCurrentDonation(donation);
    setShowModal(true);
  };

  const handleVerify = (donation) => {
    openConfirmationModal({
      title: "Verify Donation",
      message: `Are you sure you want to mark this donation of ₱${donation.amount} as verified?`,
      type: "success",
      onConfirm: async () => {
        setIsLoading(true);
        try {
          await updateDonation(donation.id, { ...donation, status: 'Verified' });
          await fetchDonations();
          showSuccess("Donation was verified successfully");
        } catch (err) {
          setError(err.message);
          showError(`Failed to verify donation: ${err.message}`);
        } finally {
          setIsLoading(false);
        }
      },
      confirmText: "Verify",
      cancelText: "Cancel"
    });
  };

  const handleDelete = (donation) => {
    openConfirmationModal({
      title: "Delete Donation",
      message: `Are you sure you want to permanently delete this donation of ₱${donation.amount}?`,
      type: "delete",
      onConfirm: async () => {
        setIsLoading(true);
        try {
          await deleteDonation(donation.id);
          await fetchDonations();
          showSuccess("Donation was deleted successfully");
        } catch (err) {
          setError(err.message);
          showError(`Failed to delete donation: ${err.message}`);
        } finally {
          setIsLoading(false);
        }
      },
      confirmText: "Delete Permanently",
      cancelText: "Cancel"
    });
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-PH', {
      style: 'currency',
      currency: 'PHP',
      minimumFractionDigits: 2
    }).format(amount);
  };

  const getVolunteerName = (volunteerId) => {
    const volunteer = volunteers.find(v => v.id === volunteerId);
    return volunteer ? `${volunteer.firstName} ${volunteer.lastName}` : 'Unknown Volunteer';
  };

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const getSortIcon = (field) => {
    if (sortField === field) {
      return sortDirection === 'asc' ? <ChevronUp size={16} /> : <ChevronDown size={16} />;
    }
    return null;
  };

  const filteredDonations = donations.filter(donation => {
    const volunteerName = getVolunteerName(donation.volunteerId).toLowerCase();
    const matchesSearch = 
      volunteerName.includes(searchTerm.toLowerCase()) ||
      donation.amount.toString().includes(searchTerm);
    const matchesStatus = statusFilter === 'all' || donation.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const sortedDonations = [...filteredDonations].sort((a, b) => {
    let valueA, valueB;
    
    if (sortField === 'volunteer') {
      valueA = getVolunteerName(a.volunteerId).toLowerCase();
      valueB = getVolunteerName(b.volunteerId).toLowerCase();
    } else if (sortField === 'amount') {
      valueA = parseFloat(a.amount);
      valueB = parseFloat(b.amount);
    } else if (sortField === 'date') {
      valueA = new Date(a.date).getTime();
      valueB = new Date(b.date).getTime();
    } else if (sortField === 'status') {
      valueA = a.status;
      valueB = b.status;
    } else {
      return 0;
    }
    
    if (valueA < valueB) return sortDirection === 'asc' ? -1 : 1;
    if (valueA > valueB) return sortDirection === 'asc' ? 1 : -1;
    return 0;
  });

  const indexOfLastDonation = currentPage * donationsPerPage;
  const indexOfFirstDonation = indexOfLastDonation - donationsPerPage;
  const currentDonations = sortedDonations.slice(indexOfFirstDonation, indexOfLastDonation);
  const totalPages = Math.ceil(sortedDonations.length / donationsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  const nextPage = () => setCurrentPage(prev => Math.min(prev + 1, totalPages));
  const prevPage = () => setCurrentPage(prev => Math.max(prev - 1, 1));

  const handleRefresh = () => {
    fetchDonations();
    showInfo('Refreshing donation records...');
  };

  const handleModalClose = () => {
    setShowModal(false);
    setCurrentDonation(null);
  };

  return (
    <div className="p-6 max-w-7xl mx-auto transition-all duration-300">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-primary">Manage Donations</h1>
        <div className="flex gap-2">
          <button
            onClick={handleRefresh}
            className="flex items-center bg-gray-100 text-gray-700 p-2 rounded-lg hover:bg-gray-200 transition-colors"
            title="Refresh donation records"
          >
            <RefreshCw size={18} />
          </button>
          <button
            onClick={() => {
              setCurrentDonation(null);
              setShowModal(true);
            }}
            className="flex items-center justify-center bg-primary text-white p-2 rounded-lg hover:bg-primary/90 transition-colors"
          >
            <Plus size={18} />
            <span className="hidden sm:inline ml-2">Add Donation</span>
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6 flex items-start" role="alert">
          <AlertCircle size={20} className="mr-2 mt-0.5" />
          <p>{error}</p>
        </div>
      )}

      <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <Search size={18} className="text-gray-400" />
          </div>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search donations by volunteer name or amount..."
            className="block w-full p-2 pl-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
        
        <div className="flex items-center">
          <span className="mr-2 text-sm text-gray-600">Status:</span>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="border border-gray-300 rounded-md p-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="all">All</option>
            <option value="Pending">Pending</option>
            <option value="Verified">Verified</option>
          </select>
        </div>
      </div>

      {isLoading && (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      )}

      {!isLoading && filteredDonations.length === 0 && (
        <div className="bg-gray-50 rounded-lg border border-gray-200 p-8 text-center">
          <h3 className="text-lg font-medium text-gray-600 mb-2">No donations found</h3>
          <p className="text-gray-500">
            {searchTerm 
              ? "Try adjusting your search or filter" 
              : "Click the '+' button to add your first donation record"}
          </p>
        </div>
      )}

      {!isLoading && filteredDonations.length > 0 && (
        <>
          <div className="overflow-x-auto rounded-lg border border-gray-200 bg-white shadow-sm">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th 
                    scope="col" 
                    className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort('volunteer')}
                  >
                    <div className="flex items-center">
                      Volunteer
                      <span className="ml-1">{getSortIcon('volunteer')}</span>
                    </div>
                  </th>
                  <th 
                    scope="col" 
                    className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort('amount')}
                  >
                    <div className="flex items-center">
                      Amount
                      <span className="ml-1">{getSortIcon('amount')}</span>
                    </div>
                  </th>
                  <th 
                    scope="col" 
                    className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hidden sm:table-cell"
                    onClick={() => handleSort('date')}
                  >
                    <div className="flex items-center">
                      Date
                      <span className="ml-1">{getSortIcon('date')}</span>
                    </div>
                  </th>
                  <th 
                    scope="col" 
                    className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hidden md:table-cell"
                  >
                    Payment Method
                  </th>
                  <th 
                    scope="col" 
                    className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort('status')}
                  >
                    <div className="flex items-center">
                      Status
                      <span className="ml-1">{getSortIcon('status')}</span>
                    </div>
                  </th>
                  <th scope="col" className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {currentDonations.map((donation) => (
                  <tr key={donation.id} className="hover:bg-gray-50">
                    <td className="px-4 py-4">
                      <div className="text-sm font-medium text-gray-900">
                        {getVolunteerName(donation.volunteerId)}
                      </div>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-green-600">
                        {formatCurrency(donation.amount)}
                      </div>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap hidden sm:table-cell">
                      <div className="text-sm text-gray-500">
                        {formatDate(donation.date)}
                      </div>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap hidden md:table-cell">
                      <div className="text-sm text-gray-500">
                        {donation.paymentMethod}
                      </div>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        donation.status === 'Verified' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {donation.status}
                      </span>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end space-x-2">
                        <button
                          onClick={() => handleEdit(donation)}
                          className="text-indigo-600 hover:text-indigo-900"
                          title="Edit donation"
                        >
                          <Edit size={18} />
                        </button>
                        {donation.status === 'Pending' && (
                          <button
                            onClick={() => handleVerify(donation)}
                            className="text-green-600 hover:text-green-900"
                            title="Verify donation"
                          >
                            <Check size={18} />
                          </button>
                        )}
                        <button
                          onClick={() => handleDelete(donation)}
                          className="text-red-600 hover:text-red-900"
                          title="Delete donation"
                        >
                          <X size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between mt-4 px-2 gap-4 sm:gap-0">
            <div className="text-sm text-gray-700">
              Showing <span className="font-medium">{indexOfFirstDonation + 1}</span> to{" "}
              <span className="font-medium">{Math.min(indexOfLastDonation, filteredDonations.length)}</span> of{" "}
              <span className="font-medium">{filteredDonations.length}</span> donations
            </div>
            
            <div className="flex items-center space-x-2">
              <button
                onClick={prevPage}
                disabled={currentPage === 1}
                className={`p-2 rounded-md border ${
                  currentPage === 1 
                    ? 'text-gray-300 border-gray-200 cursor-not-allowed' 
                    : 'text-gray-600 border-gray-300 hover:bg-gray-50'
                }`}
              >
                <ChevronLeft size={16} />
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
                      onClick={() => paginate(pageNum)}
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
                onClick={nextPage}
                disabled={currentPage === totalPages}
                className={`p-2 rounded-md border ${
                  currentPage === totalPages 
                    ? 'text-gray-300 border-gray-200 cursor-not-allowed' 
                    : 'text-gray-600 border-gray-300 hover:bg-gray-50'
                }`}
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        </>
      )}

      <DonationFormModal
        isOpen={showModal}
        onClose={handleModalClose}
        onSubmit={handleSubmitDonation}
        currentDonation={currentDonation}
        volunteers={volunteers}
      />

      <ConfirmationModal
        show={showConfirmationModal}
        onClose={() => setShowConfirmationModal(false)}
        title={confirmationConfig.title}
        message={confirmationConfig.message}
        onConfirm={confirmationConfig.onConfirm}
        type={confirmationConfig.type}
        confirmText={confirmationConfig.confirmText}
        cancelText={confirmationConfig.cancelText}
      />
    </div>
  );
};

export default AdminDonationManagement;