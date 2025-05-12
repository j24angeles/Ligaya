// src/components/volunteer-donations/DonationDetailsModal.js
import React from 'react';
import { X } from 'lucide-react';

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

const DonationDetailsModal = ({ donation, onClose }) => {
  if (!donation) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center border-b p-4">
          <h3 className="text-lg font-medium text-gray-900">Donation Details</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-500">
            <X size={20} />
          </button>
        </div>
        
        <div className="p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-500">Amount</p>
              <p className="font-medium">₱{parseFloat(donation.amount).toFixed(2)}</p>
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
          <p className="font-medium">
            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
              donation.validationStatus === 'validated' 
                ? 'bg-green-100 text-green-800' 
                : donation.validationStatus === 'rejected' 
                  ? 'bg-red-100 text-red-800' 
                  : 'bg-yellow-100 text-yellow-800'
            }`}>
              {donation.validationStatus === 'validated' 
                ? 'Verified' 
                : donation.validationStatus === 'rejected' 
                  ? 'Rejected' 
                  : 'Pending'}
            </span>
          </p>
        </div>
            
            {donation.referenceNumber && (
              <div>
                <p className="text-sm text-gray-500">Reference Number</p>
                <p className="font-medium">{donation.referenceNumber}</p>
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
        </div>
        
        <div className="border-t p-4 flex justify-end">
        
        </div>
      </div>
    </div>
  );
};

export default DonationDetailsModal;