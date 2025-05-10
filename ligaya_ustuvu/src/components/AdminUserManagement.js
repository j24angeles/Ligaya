import React, { useState, useEffect } from 'react';
import { Plus, Search, AlertCircle, Edit, Archive, Trash2, ChevronDown, ChevronUp, RefreshCw, ChevronLeft, ChevronRight } from 'lucide-react';
import UserFormModal from './UserFormModal';
import ConfirmationModal from './ConfirmationModal';
import { useToast } from '../hooks/ToastProvider';
import { getAllUsers, createUser, updateUser, deleteUser } from '../api/userService';

const AdminUserManagement = () => {
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [statusFilter, setStatusFilter] = useState('active');
  const [sortField, setSortField] = useState('name');
  const [sortDirection, setSortDirection] = useState('asc');
  
  // Toast notifications
  const { showSuccess, showError, showInfo } = useToast();
  
  // Confirmation modals state
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [confirmationConfig, setConfirmationConfig] = useState({
    title: '',
    message: '',
    type: 'info',
    onConfirm: () => {},
    confirmText: 'Confirm',
    cancelText: 'Cancel'
  });
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 10;

  // Fetch all users
  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      const data = await getAllUsers();
      setUsers(data);
      setError(null);
    } catch (err) {
      setError(err.message);
      showError(`Failed to load users: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  // Load users on component mount
  useEffect(() => {
    fetchUsers();
  }, []);

  // Open confirmation modal with specific configuration
  const openConfirmationModal = (config) => {
    setConfirmationConfig(config);
    setShowConfirmationModal(true);
  };

  // Handle creating and updating users with confirmation
  const handleSubmitUser = async (userData) => {
    if (currentUser) {
      // Editing existing user - show confirmation
      openConfirmationModal({
        title: "Update Volunteer",
        message: `Are you sure you want to update ${userData.firstName} ${userData.lastName}'s information?`,
        type: "info",
        onConfirm: async () => {
          setIsLoading(true);
          try {
            await updateUser(currentUser.id, userData);
            await fetchUsers();
            setShowModal(false);
            setCurrentUser(null);
            showSuccess(`Volunteer ${userData.firstName} ${userData.lastName} was updated successfully`);
          } catch (err) {
            setError(err.message);
            showError(`Failed to update volunteer: ${err.message}`);
          } finally {
            setIsLoading(false);
          }
        },
        confirmText: "Update",
        cancelText: "Cancel"
      });
    } else {
      // Creating new user - show confirmation
      openConfirmationModal({
        title: "Add New Volunteer",
        message: `Are you sure you want to add ${userData.firstName} ${userData.lastName} as a volunteer?`,
        type: "info",
        onConfirm: async () => {
          setIsLoading(true);
          try {
            await createUser(userData);
            await fetchUsers();
            setShowModal(false);
            showSuccess(`Volunteer ${userData.firstName} ${userData.lastName} was added successfully`);
          } catch (err) {
            setError(err.message);
            showError(`Failed to add volunteer: ${err.message}`);
          } finally {
            setIsLoading(false);
          }
        },
        confirmText: "Add Volunteer",
        cancelText: "Cancel"
      });
    }
  };

  // Handle editing user
  const handleEdit = (user) => {
    setCurrentUser(user);
    setShowModal(true);
  };

  // Handle archiving user with confirmation
  const handleArchive = (user) => {
    openConfirmationModal({
      title: "Archive Volunteer",
      message: `Are you sure you want to archive ${user.firstName} ${user.lastName}? They will no longer appear in the active volunteers list.`,
      type: "warning",
      onConfirm: async () => {
        setIsLoading(true);
        try {
          await updateUser(user.id, { ...user, status: 'archived' });
          await fetchUsers();
          showSuccess(`Volunteer ${user.firstName} ${user.lastName} was archived successfully`);
        } catch (err) {
          setError(err.message);
          showError(`Failed to archive volunteer: ${err.message}`);
        } finally {
          setIsLoading(false);
        }
      },
      confirmText: "Archive",
      cancelText: "Cancel"
    });
  };
  
  // Handle restoring archived user with confirmation
  const handleRestore = (user) => {
    openConfirmationModal({
      title: "Restore Volunteer",
      message: `Are you sure you want to restore ${user.firstName} ${user.lastName} to active status?`,
      type: "success",
      onConfirm: async () => {
        setIsLoading(true);
        try {
          await updateUser(user.id, { ...user, status: 'active' });
          await fetchUsers();
          showSuccess(`Volunteer ${user.firstName} ${user.lastName} was restored to active status`);
        } catch (err) {
          setError(err.message);
          showError(`Failed to restore volunteer: ${err.message}`);
        } finally {
          setIsLoading(false);
        }
      },
      confirmText: "Restore",
      cancelText: "Cancel"
    });
  };
  
  // Handle permanently deleting user with confirmation
  const handleDelete = (user) => {
    openConfirmationModal({
      title: "Delete Volunteer Permanently",
      message: `Are you sure you want to permanently delete ${user.firstName} ${user.lastName}? This action cannot be undone.`,
      type: "delete",
      onConfirm: async () => {
        setIsLoading(true);
        try {
          await deleteUser(user.id);
          await fetchUsers();
          showSuccess(`Volunteer ${user.firstName} ${user.lastName} was permanently deleted`);
        } catch (err) {
          setError(err.message);
          showError(`Failed to delete volunteer: ${err.message}`);
        } finally {
          setIsLoading(false);
        }
      },
      confirmText: "Delete Permanently",
      cancelText: "Cancel"
    });
  };

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return 'Not provided';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Handle sorting
  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  // Get sort icon
  const getSortIcon = (field) => {
    if (sortField === field) {
      return sortDirection === 'asc' ? <ChevronUp size={16} /> : <ChevronDown size={16} />;
    }
    return null;
  };

  // Filter users based on search term, volunteer role, and status
  const filteredUsers = users.filter(user => {
    const fullName = `${user.firstName} ${user.lastName}`.toLowerCase();
    const matchesSearch = 
      fullName.includes(searchTerm.toLowerCase()) || 
      (user.email && user.email.toLowerCase().includes(searchTerm.toLowerCase()));
    
    // Only show volunteer role
    const isVolunteer = user.role === 'volunteer';
    
    // Check if user matches status filter
    const userStatus = user.status || 'active'; // Default to active if status not set
    const matchesStatus = statusFilter === 'all' || userStatus === statusFilter;
    
    return matchesSearch && isVolunteer && matchesStatus;
  });

  // Sort users
  const sortedUsers = [...filteredUsers].sort((a, b) => {
    let valueA, valueB;
    
    if (sortField === 'name') {
      valueA = `${a.firstName} ${a.lastName}`.toLowerCase();
      valueB = `${b.firstName} ${b.lastName}`.toLowerCase();
    } else if (sortField === 'email') {
      valueA = (a.email || '').toLowerCase();
      valueB = (b.email || '').toLowerCase();
    } else if (sortField === 'registered') {
      valueA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
      valueB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
    } else {
      return 0;
    }
    
    if (valueA < valueB) return sortDirection === 'asc' ? -1 : 1;
    if (valueA > valueB) return sortDirection === 'asc' ? 1 : -1;
    return 0;
  });

  // Pagination logic
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = sortedUsers.slice(indexOfFirstUser, indexOfLastUser);
  const totalPages = Math.ceil(sortedUsers.length / usersPerPage);

  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  const nextPage = () => setCurrentPage(prev => Math.min(prev + 1, totalPages));
  const prevPage = () => setCurrentPage(prev => Math.max(prev - 1, 1));

  // Handle refresh button
  const handleRefresh = () => {
    fetchUsers();
    showInfo('Refreshing volunteer list...');
  };

  // Handle modal close with confirmation if form has been edited
  const handleModalClose = () => {
    // In a real implementation, we might check if the form has unsaved changes
    // For now, simply close the modal
    setShowModal(false);
    setCurrentUser(null);
  };

  return (
    <div className="p-6 max-w-7xl mx-auto transition-all duration-300">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-primary">Volunteer Management</h1>
        <div className="flex gap-2">
          <button
            onClick={handleRefresh}
            className="flex items-center bg-gray-100 text-gray-700 p-2 rounded-lg hover:bg-gray-200 transition-colors"
            title="Refresh volunteer list"
          >
            <RefreshCw size={18} />
          </button>
          <button
            onClick={() => {
              setCurrentUser(null);
              setShowModal(true);
            }}
            className="flex items-center gap-2 bg-primary text-white p-2 sm:px-4 sm:py-2 rounded-lg hover:bg-primary/90 transition-colors"
          >
            <Plus size={18} />
            <span className="hidden sm:inline">Add New Volunteer</span>
          </button>
        </div>
      </div>

      {/* Error alert */}
      {error && (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6 flex items-start" role="alert">
          <AlertCircle size={20} className="mr-2 mt-0.5" />
          <p>{error}</p>
        </div>
      )}

      {/* Search and filter */}
      <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <Search size={18} className="text-gray-400" />
          </div>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search volunteers by name or email..."
            className="block w-full p-2 pl-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
        
        <div className="flex items-center gap-4">
          <div className="flex items-center">
            <span className="mr-2 text-sm text-gray-600">Status:</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="border border-gray-300 rounded-md p-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="active">Active</option>
              <option value="archived">Archived</option>
              <option value="all">All</option>
            </select>
          </div>
        </div>
      </div>

      {/* Loading state */}
      {isLoading && (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      )}

      {/* No users message */}
      {!isLoading && filteredUsers.length === 0 && (
        <div className="bg-gray-50 rounded-lg border border-gray-200 p-8 text-center">
          <h3 className="text-lg font-medium text-gray-600 mb-2">No volunteers found</h3>
          <p className="text-gray-500">
            {searchTerm 
              ? "Try adjusting your search or filter" 
              : "Click the 'Add New Volunteer' button to create your first volunteer"}
          </p>
        </div>
      )}

      {/* Users table */}
      {!isLoading && filteredUsers.length > 0 && (
        <>
          <div className="overflow-x-auto rounded-lg border border-gray-200 bg-white shadow-sm">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th 
                    scope="col" 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort('name')}
                  >
                    <div className="flex items-center">
                      Name
                      <span className="ml-1">{getSortIcon('name')}</span>
                    </div>
                  </th>
                  <th 
                    scope="col" 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort('email')}
                  >
                    <div className="flex items-center">
                      Email
                      <span className="ml-1">{getSortIcon('email')}</span>
                    </div>
                  </th>
                  <th 
                    scope="col" 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort('registered')}
                  >
                    <div className="flex items-center">
                      Date Registered
                      <span className="ml-1">{getSortIcon('registered')}</span>
                    </div>
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {currentUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {user.firstName} {user.lastName}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">{user.email}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">{formatDate(user.createdAt)}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      {user.status !== 'archived' && (
                        <>
                          <button
                            onClick={() => handleEdit(user)}
                            className="text-indigo-600 hover:text-indigo-900 mr-4"
                            title="Edit volunteer"
                          >
                            <Edit size={18} className="inline" />
                            <span className="sr-only">Edit</span>
                          </button>
                          <button
                            onClick={() => handleArchive(user)}
                            className="text-amber-600 hover:text-amber-900"
                            title="Archive volunteer"
                          >
                            <Archive size={18} className="inline" />
                            <span className="sr-only">Archive</span>
                          </button>
                        </>
                      )}
                      {user.status === 'archived' && (
                        <>
                          <button
                            onClick={() => handleRestore(user)}
                            className="text-green-600 hover:text-green-900 mr-4"
                            title="Restore volunteer"
                          >
                            <RefreshCw size={18} className="inline" />
                            <span className="sr-only">Restore</span>
                          </button>
                          <button
                            onClick={() => handleDelete(user)}
                            className="text-red-600 hover:text-red-900"
                            title="Permanently delete volunteer"
                          >
                            <Trash2 size={18} className="inline" />
                            <span className="sr-only">Delete</span>
                          </button>
                        </>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination controls */}
          <div className="flex items-center justify-between mt-4 px-2">
            <div className="text-sm text-gray-700">
              Showing <span className="font-medium">{indexOfFirstUser + 1}</span> to{" "}
              <span className="font-medium">{Math.min(indexOfLastUser, filteredUsers.length)}</span> of{" "}
              <span className="font-medium">{filteredUsers.length}</span> volunteers
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
              
              {/* Page numbers */}
              <div className="hidden md:flex space-x-1">
                {Array.from({ length: Math.min(5, totalPages) }).map((_, idx) => {
                  // Calculate which page numbers to show
                  let pageNum;
                  if (totalPages <= 5) {
                    pageNum = idx + 1;
                  } else if (currentPage <= 3) {
                    pageNum = idx + 1; // Show first 5 pages
                  } else if (currentPage >= totalPages - 2) {
                    pageNum = totalPages - 4 + idx; // Show last 5 pages
                  } else {
                    pageNum = currentPage - 2 + idx; // Show current page and 2 pages on each side
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
              
              {/* Current page indicator for mobile */}
              <span className="md:hidden text-sm">
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

      {/* User form modal */}
      <UserFormModal
        isOpen={showModal}
        onClose={handleModalClose}
        onSubmit={handleSubmitUser}
        currentUser={currentUser}
      />

      {/* Confirmation Modal */}
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

export default AdminUserManagement;