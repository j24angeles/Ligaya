import React, { useEffect, useState } from 'react';
import { X, Image } from 'lucide-react';
import { useToast } from '../../hooks/ToastProvider';
import { updateDonation } from '../../api/donationService';

const formatDate = (dateString) => {
  if (!dateString) return 'Not provided';
  const options = { year: 'numeric', month: 'short', day: 'numeric' };
  return new Date(dateString).toLocaleDateString(undefined, options);
};

const formatCurrency = (amount) => {
  return `₱${parseFloat(amount).toFixed(2)}`;
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

const EditDonationModal = ({ 
  isOpen, 
  onClose,
  donation, 
  users,
  onSuccess
}) => {
  const [validationStatus, setValidationStatus] = useState(donation?.validationStatus || 'pending');
  const { showError, showSuccess } = useToast();

  useEffect(() => {
    if (donation) {
      setValidationStatus(donation.validationStatus);
    }
  }, [donation]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = 'visible';
      };
    }
  }, [isOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!donation) return;
    
    try {
      const updatedData = {
        validationStatus,
        updatedAt: new Date().toISOString()
      };

      if (validationStatus === 'validated' && donation.validationStatus !== 'validated') {
        updatedData.validatedAt = new Date().toISOString();
        updatedData.rejectedAt = null;
        updatedData.rejectionReason = null;
        updatedData.isValidated = true;
      } else if (validationStatus === 'rejected' && donation.validationStatus !== 'rejected') {
        updatedData.rejectedAt = new Date().toISOString();
        updatedData.validatedAt = null;
        updatedData.isValidated = false;
      } else if (validationStatus === 'pending' && donation.validationStatus !== 'pending') {
        updatedData.validatedAt = null;
        updatedData.rejectedAt = null;
        updatedData.rejectionReason = null;
        updatedData.isValidated = false;
      }

      await updateDonation(donation.id, updatedData);
      
      showSuccess('Donation status updated successfully');
      
      if (onSuccess) {
        onSuccess();
      }
      
      onClose();
    } catch (err) {
      showError(`Failed to update donation: ${err.message || err}`);
    }
  };

  if (!isOpen || !donation) return null;

  const getDonorName = (userId) => {
    if (!users || !Array.isArray(users)) return 'Unknown Donor';
    const user = users.find(user => user.id.toString() === userId.toString());
    return user ? `${user.firstName} ${user.lastName}` : 'Unknown Donor';
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div className="fixed inset-0 bg-black bg-opacity-50 transition-opacity" onClick={onClose}></div>
      
      <div className="flex items-center justify-center min-h-screen p-4">
        <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto relative z-10">
          <div className="flex justify-between items-center border-b p-4">
            <h3 className="text-lg font-medium text-gray-900">Edit Donation Status</h3>
            <button 
              onClick={onClose} 
              className="text-gray-400 hover:text-gray-500 transition-colors focus:outline-none focus:ring-2 focus:ring-primary rounded"
            >
              <X size={20} />
            </button>
          </div>
          
          <form onSubmit={handleSubmit}>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Donor</p>
                  <p className="font-medium">{getDonorName(donation.userId)}</p>
                </div>

                <div>
                  <p className="text-sm text-gray-500">Amount</p>
                  <p className="font-medium">{formatCurrency(donation.amount)}</p>
                </div>
                
                <div>
                  <p className="text-sm text-gray-500">Date</p>
                  <p className="font-medium">{formatDate(donation.date)}</p>
                </div>
                
                <div>
                  <p className="text-sm text-gray-500">Payment Method</p>
                  <p className="font-medium">{formatPaymentMethod(donation.paymentMethod)}</p>
                </div>
                
                <div>
                  <p className="text-sm text-gray-500">Status</p>
                  <select
                    value={validationStatus}
                    onChange={(e) => setValidationStatus(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md font-medium"
                  >
                    <option value="pending">Pending</option>
                    <option value="validated">Verified</option>
                    <option value="rejected">Rejected</option>
                  </select>
                </div>
                
                {donation.referenceNumber && (
                  <div>
                    <p className="text-sm text-gray-500">Reference Number</p>
                    <p className="font-medium">{donation.referenceNumber}</p>
                  </div>
                )}

                {donation.validatedAt && (
                  <div>
                    <p className="text-sm text-gray-500">Validated At</p>
                    <p className="font-medium">{formatDate(donation.validatedAt)}</p>
                  </div>
                )}

                {donation.rejectedAt && (
                  <div>
                    <p className="text-sm text-gray-500">Rejected At</p>
                    <p className="font-medium">{formatDate(donation.rejectedAt)}</p>
                  </div>
                )}
                
                {donation.notes && (
                  <div className="md:col-span-2">
                    <p className="text-sm text-gray-500">Notes</p>
                    <p className="font-medium">{donation.notes}</p>
                  </div>
                )}
                
                {donation.rejectionReason && (
                  <div className="md:col-span-2">
                    <p className="text-sm text-gray-500">Rejection Reason</p>
                    <p className="font-medium text-red-600">{donation.rejectionReason}</p>
                  </div>
                )}
              </div>

              {donation.proofOfReceipt && (
                <div className="mt-6 border-t pt-4">
                  <div className="flex items-center mb-3">
                    <Image size={16} className="mr-2 text-gray-500" />
                    <p className="text-sm font-medium text-gray-700">Proof of Receipt</p>
                  </div>
                  <div className="relative group">
                    <img
                      src={donation.proofOfReceipt}
                      alt="Proof of receipt"
                      className="w-full h-64 object-contain bg-gray-50 rounded-lg border border-gray-200"
                    />
                  </div>
                </div>
              )}
            </div>
            
            <div className="border-t p-4 flex justify-end space-x-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90"
              >
                Save Changes
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditDonationModal;