import React from 'react';

/**
 * Confirmation Modal Component
 * @param {Object} props - Component props
 * @param {boolean} props.show - Whether to show the modal
 * @param {function} props.onClose - Function to call when modal is closed
 * @param {string} props.title - Modal title
 * @param {string} props.message - Modal message
 * @param {function} props.onConfirm - Function to call when action is confirmed
 * @param {string} props.type - Type of confirmation (info, success, warning, error)
 * @param {string} props.confirmText - Text for the confirm button (optional)
 * @param {string} props.cancelText - Text for the cancel button (optional)
 * @returns {JSX.Element}
 */
const ConfirmationModal = ({ 
  show, 
  onClose, 
  title, 
  message, 
  onConfirm, 
  type = 'info',
  confirmText = 'Confirm',
  cancelText = 'Cancel'
}) => {
  if (!show) return null;

  const typeClasses = {
    error: 'bg-red-100 text-red-700 border-red-300',
    success: 'bg-green-100 text-green-700 border-green-300',
    warning: 'bg-yellow-100 text-yellow-700 border-yellow-300',
    info: 'bg-blue-100 text-primary border-blue-300',
    delete: 'bg-red-100 text-red-700 border-red-300',
  };

  const buttonClasses = {
    error: 'bg-red-600 hover:bg-red-700',
    success: 'bg-green-600 hover:bg-green-700',
    warning: 'bg-yellow-600 hover:bg-yellow-700',
    info: 'bg-primary hover:bg-accent',
    delete: 'bg-red-600 hover:bg-red-700',
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-base-100 rounded-lg p-6 max-w-md w-full shadow-xl border border-gray-200">
        <h3 className={`text-lg font-medium p-3 rounded ${typeClasses[type]}`}>{title}</h3>
        <div className="mt-4">
          <p className="text-gray-700">{message}</p>
        </div>
        <div className="mt-6 flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 transition-colors"
          >
            {cancelText}
          </button>
          <button
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className={`px-4 py-2 text-white rounded ${buttonClasses[type]} transition-colors`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;