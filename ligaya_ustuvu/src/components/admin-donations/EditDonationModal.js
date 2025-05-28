import React from 'react';
import { useToast } from '../../hooks/ToastProvider';

const EditDonationModal = ({ 
  isOpen, 
  onClose, 
  donation, 
  onSave 
}) => {
  const [status, setStatus] = React.useState(donation?.status || 'active');
  const [validationStatus, setValidationStatus] = React.useState(donation?.validationStatus || 'pending');
  const { showError } = useToast();

  React.useEffect(() => {
    if (donation) {
      setStatus(donation.status);
      setValidationStatus(donation.validationStatus);
    }
  }, [donation]);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!donation) return;
    
    try {
      const updatedData = {
        status,
        validationStatus,
        updatedAt: new Date().toISOString()
      };

      // Additional logic for validation timestamps
      if (validationStatus === 'validated' && donation.validationStatus !== 'validated') {
        updatedData.validatedAt = new Date().toISOString();
        updatedData.rejectedAt = null;
        updatedData.rejectionReason = null;
      } else if (validationStatus === 'rejected' && donation.validationStatus !== 'rejected') {
        updatedData.rejectedAt = new Date().toISOString();
        updatedData.validatedAt = null;
      } else if (validationStatus === 'pending' && donation.validationStatus !== 'pending') {
        updatedData.validatedAt = null;
        updatedData.rejectedAt = null;
        updatedData.rejectionReason = null;
      }

      onSave(donation.id, updatedData);
      onClose();
    } catch (err) {
      showError(`Failed to update donation: ${err.message}`);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Edit Donation Status</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            &times;
          </button>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Donation Status
            </label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md"
            >
              <option value="active">Active</option>
              <option value="archived">Archived</option>
            </select>
          </div>
          
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Validation Status
            </label>
            <select
              value={validationStatus}
              onChange={(e) => setValidationStatus(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md"
            >
              <option value="pending">Pending</option>
              <option value="validated">Validated</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>
          
          <div className="flex justify-end space-x-3">
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
  );
};

export default EditDonationModal;