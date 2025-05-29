import React, { useEffect, useState, useRef } from 'react';
import { X, ZoomIn, Image, Edit, Save, Upload, Trash2 } from 'lucide-react';

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

const ImageModal = ({ src, onClose }) => {
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const imageRef = useRef(null);

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    
    const handleWheel = (e) => {
      e.preventDefault();
      const rect = imageRef.current?.getBoundingClientRect();
      if (!rect) return;

      const mouseX = e.clientX - rect.left - rect.width / 2;
      const mouseY = e.clientY - rect.top - rect.height / 2;

      const delta = e.deltaY > 0 ? 0.9 : 1.1;
      const newScale = Math.min(Math.max(scale * delta, 0.5), 5);
      
      const scaleChange = newScale / scale;
      setPosition(prev => ({
        x: prev.x - mouseX * (scaleChange - 1),
        y: prev.y - mouseY * (scaleChange - 1)
      }));
      
      setScale(newScale);
    };
    
    document.addEventListener('keydown', handleEscape);
    document.addEventListener('wheel', handleWheel, { passive: false });
    document.body.style.overflow = 'hidden';
    
    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.removeEventListener('wheel', handleWheel);
      document.body.style.overflow = 'visible';
    };
  }, [onClose, scale]);

  const handleMouseDown = (e) => {
    if (scale > 1) {
      setIsDragging(true);
      setDragStart({
        x: e.clientX - position.x,
        y: e.clientY - position.y
      });
    }
  };

  const handleMouseMove = (e) => {
    if (isDragging && scale > 1) {
      setPosition({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleReset = () => {
    setScale(1);
    setPosition({ x: 0, y: 0 });
  };

  const handleZoomIn = () => {
    const newScale = Math.min(scale * 1.2, 5);
    setScale(newScale);
  };

  const handleZoomOut = () => {
    const newScale = Math.max(scale / 1.2, 0.5);
    setScale(newScale);
    
    if (newScale <= 1) {
      setPosition({ x: 0, y: 0 });
    }
  };

  return (
    <div 
      className="fixed inset-0 z-[60] bg-black bg-opacity-95 flex items-center justify-center"
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      <div className="absolute z-10 flex items-center space-x-2 top-4 right-4">
        <div className="px-3 py-1 text-sm text-white bg-black bg-opacity-50 rounded-lg">
          {Math.round(scale * 100)}%
        </div>
        <button
          onClick={handleZoomOut}
          className="p-2 text-white transition-colors bg-black bg-opacity-50 rounded-lg hover:bg-opacity-70"
          title="Zoom Out"
        >
          <span className="text-lg font-bold">−</span>
        </button>
        <button
          onClick={handleZoomIn}
          className="p-2 text-white transition-colors bg-black bg-opacity-50 rounded-lg hover:bg-opacity-70"
          title="Zoom In"
        >
          <span className="text-lg font-bold">+</span>
        </button>
        <button
          onClick={handleReset}
          className="px-3 py-2 text-sm text-white transition-colors bg-black bg-opacity-50 rounded-lg hover:bg-opacity-70"
          title="Reset View"
        >
          Reset
        </button>
        <button
          onClick={onClose}
          className="p-2 text-white transition-colors bg-black bg-opacity-50 rounded-lg hover:bg-opacity-70"
          title="Close"
        >
          <X size={20} />
        </button>
      </div>

      <div className="absolute px-4 py-2 text-sm text-white transform -translate-x-1/2 bg-black bg-opacity-50 rounded-lg bottom-4 left-1/2">
        Scroll to zoom • Drag to pan • ESC to close
      </div>

      <div className="relative flex items-center justify-center w-full h-full overflow-hidden">
        <img
          ref={imageRef}
          src={src}
          alt="Full size receipt"
          className={`max-w-none transition-transform duration-200 ${
            isDragging ? 'cursor-grabbing' : scale > 1 ? 'cursor-grab' : 'cursor-default'
          }`}
          style={{
            transform: `scale(${scale}) translate(${position.x / scale}px, ${position.y / scale}px)`,
            maxHeight: scale === 1 ? '90vh' : 'none',
            maxWidth: scale === 1 ? '90vw' : 'none'
          }}
          onMouseDown={handleMouseDown}
          onDragStart={(e) => e.preventDefault()}
          onClick={(e) => e.stopPropagation()}
        />
      </div>

      <div 
        className="absolute inset-0 -z-10" 
        onClick={onClose}
      />
    </div>
  );
};

const DonationDetailsModal = ({ donation, onClose, onUpdate }) => {
  const [showImageModal, setShowImageModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedDonation, setEditedDonation] = useState({ ...donation });
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef(null);

  // Update editedDonation when the donation prop changes
  useEffect(() => {
    setEditedDonation({ ...donation });
  }, [donation]);

  useEffect(() => {
    if (donation) {
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = 'visible';
      };
    }
  }, [donation]);

  if (!donation) return null;

  const handleImageClick = () => {
    setShowImageModal(true);
  };

  const handleImageModalClose = () => {
    setShowImageModal(false);
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = async () => {
    setIsLoading(true);
    try {
      // Call the parent update function and wait for it to complete
      if (onUpdate) {
        await onUpdate(editedDonation);
      }
      setIsEditing(false);
      
      // Optional: Show success feedback
      // You could add a toast notification here
    } catch (error) {
      console.error('Failed to save donation:', error);
      // Optional: Show error feedback
      // You could add an error toast here
      alert('Failed to save changes. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setEditedDonation({ ...donation }); // Reset to original donation data
    setIsEditing(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (name === 'paymentMethod') {
      // If payment method is changed to cash, remove receipt and reference number
      if (value === 'cash') {
        setEditedDonation(prev => ({
          ...prev,
          [name]: value,
          proofOfReceipt: null,
          referenceNumber: ''
        }));
      } else {
        setEditedDonation(prev => ({
          ...prev,
          [name]: value
        }));
      }
    } else {
      setEditedDonation(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file size (10MB limit)
      if (file.size > 10 * 1024 * 1024) {
        alert('File size must be less than 10MB');
        return;
      }

      // Validate file type
      if (!file.type.startsWith('image/')) {
        alert('Please select an image file');
        return;
      }

      const reader = new FileReader();
      reader.onload = (event) => {
        setEditedDonation(prev => ({
          ...prev,
          proofOfReceipt: event.target.result
        }));
      };
      reader.onerror = () => {
        alert('Error reading file');
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveReceipt = () => {
    setEditedDonation(prev => ({
      ...prev,
      proofOfReceipt: null
    }));
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const triggerFileUpload = () => {
    fileInputRef.current?.click();
  };

  // Use the current donation data (which gets updated from parent) for display when not editing
  // Use editedDonation for display when editing
  const displayDonation = isEditing ? editedDonation : donation;
  
  // Check if receipt should be shown (not cash payment method)
  const shouldShowReceipt = displayDonation.paymentMethod !== 'cash';

  return (
    <>
      <div className="fixed inset-0 z-50 overflow-hidden">
        <div className="fixed inset-0 transition-opacity bg-black bg-opacity-50" onClick={onClose}></div>
        
        <div className="flex items-center justify-center min-h-screen p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto relative z-10">
            <div className="flex items-center justify-between p-4 border-b">
              <h3 className="text-lg font-medium text-gray-900">Donation Details</h3>
              <div className="flex items-center space-x-2">
                {!isEditing ? (
                  <button 
                    onClick={handleEdit}
                    className="p-1 text-gray-600 transition-colors rounded hover:text-primary"
                    disabled={isLoading}
                  >
                    <Edit size={20} />
                  </button>
                ) : (
                  <>
                    <button 
                      onClick={handleCancel}
                      className="px-3 py-1 text-sm text-gray-600 transition-colors rounded hover:text-gray-800"
                      disabled={isLoading}
                    >
                      Cancel
                    </button>
                    <button 
                      onClick={handleSave}
                      disabled={isLoading}
                      className="flex items-center px-3 py-1 space-x-1 text-sm text-white transition-colors bg-blue-500 rounded hover:bg-blue-600 disabled:bg-blue-300"
                    >
                      <Save size={14} />
                      <span>{isLoading ? 'Saving...' : 'Save'}</span>
                    </button>
                  </>
                )}
                <button 
                  onClick={onClose} 
                  className="text-gray-400 transition-colors rounded hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  disabled={isLoading}
                >
                  <X size={20} />
                </button>
              </div>
            </div>
            
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <p className="text-sm text-gray-500">Amount</p>
                  {isEditing ? (
                    <input
                      type="number"
                      step="0.01"
                      name="amount"
                      value={editedDonation.amount}
                      onChange={handleChange}
                      className="block w-full px-3 py-2 mt-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      disabled={isLoading}
                    />
                  ) : (
                    <p className="font-medium">₱{parseFloat(displayDonation.amount).toFixed(2)}</p>
                  )}
                </div>
                
                <div>
                  <p className="text-sm text-gray-500">Date</p>
                  {isEditing ? (
                    <input
                      type="date"
                      name="date"
                      value={editedDonation.date.split('T')[0]}
                      onChange={handleChange}
                      className="block w-full px-3 py-2 mt-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      disabled={isLoading}
                    />
                  ) : (
                    <p className="font-medium">{formatDate(displayDonation.date)}</p>
                  )}
                </div>
                
                <div>
                  <p className="text-sm text-gray-500">Payment Method</p>
                  {isEditing ? (
                    <select
                      name="paymentMethod"
                      value={editedDonation.paymentMethod}
                      onChange={handleChange}
                      className="block w-full px-3 py-2 mt-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      disabled={isLoading}
                    >
                      <option value="cash">Cash</option>
                      <option value="gcash">GCash</option>
                      <option value="maya">Maya</option>
                      <option value="bank_transfer">Bank Transfer</option>
                    </select>
                  ) : (
                    <p className="font-medium">{formatPaymentMethod(displayDonation.paymentMethod)}</p>
                  )}
                </div>
                
                <div>
                  <p className="text-sm text-gray-500">Status</p>
                  <p className="font-medium">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      displayDonation.validationStatus === 'validated' 
                        ? 'bg-green-100 text-green-800' 
                        : displayDonation.validationStatus === 'rejected' 
                          ? 'bg-red-100 text-red-800' 
                          : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {displayDonation.validationStatus === 'validated' 
                        ? 'Verified' 
                        : displayDonation.validationStatus === 'rejected' 
                          ? 'Rejected' 
                          : 'Pending'}
                    </span>
                  </p>
                </div>
                
                {shouldShowReceipt && displayDonation.referenceNumber && (
                  <div>
                    <p className="text-sm text-gray-500">Reference Number</p>
                    {isEditing ? (
                      <input
                        type="text"
                        name="referenceNumber"
                        value={editedDonation.referenceNumber || ''}
                        onChange={handleChange}
                        className="block w-full px-3 py-2 mt-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        disabled={isLoading}
                      />
                    ) : (
                      <p className="font-medium">{displayDonation.referenceNumber}</p>
                    )}
                  </div>
                )}
                
                {displayDonation.notes && (
                  <div className="md:col-span-2">
                    <p className="text-sm text-gray-500">Notes</p>
                    {isEditing ? (
                      <textarea
                        name="notes"
                        value={editedDonation.notes || ''}
                        onChange={handleChange}
                        rows={3}
                        className="block w-full px-3 py-2 mt-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        disabled={isLoading}
                      />
                    ) : (
                      <p className="font-medium">{displayDonation.notes}</p>
                    )}
                  </div>
                )}
                
                {displayDonation.rejectionReason && (
                  <div className="md:col-span-2">
                    <p className="text-sm text-gray-500">Rejection Reason</p>
                    <p className="font-medium text-red-600">{displayDonation.rejectionReason}</p>
                  </div>
                )}
              </div>

              {shouldShowReceipt && (
                <div className="pt-4 mt-6 border-t">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center">
                      <Image size={16} className="mr-2 text-gray-500" />
                      <p className="text-sm font-medium text-gray-700">Proof of Receipt</p>
                    </div>
                    {isEditing && (
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={triggerFileUpload}
                          className="flex items-center space-x-1 text-sm text-blue-600 hover:text-blue-700"
                          disabled={isLoading}
                        >
                          <Upload size={14} />
                          <span>{displayDonation.proofOfReceipt ? 'Change' : 'Upload'}</span>
                        </button>
                        {displayDonation.proofOfReceipt && (
                          <button
                            onClick={handleRemoveReceipt}
                            className="flex items-center space-x-1 text-sm text-red-600 hover:text-red-700"
                            disabled={isLoading}
                          >
                            <Trash2 size={14} />
                            <span>Remove</span>
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                  
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="hidden"
                    disabled={isLoading}
                  />

                  {displayDonation.proofOfReceipt ? (
                    <div className="relative group">
                      <img
                        src={displayDonation.proofOfReceipt}
                        alt="Proof of receipt"
                        className="object-contain w-full h-64 transition-shadow border border-gray-200 rounded-lg cursor-pointer bg-gray-50 hover:shadow-md"
                        onClick={handleImageClick}
                        onError={(e) => {
                          console.error('Image failed to load:', e);
                          e.target.style.display = 'none';
                        }}
                      />
                      <div className="absolute inset-0 flex items-center justify-center transition-all duration-200 bg-black bg-opacity-0 rounded-lg cursor-pointer group-hover:bg-opacity-20" onClick={handleImageClick}>
                        <div className="p-2 transition-opacity duration-200 bg-white rounded-full shadow-lg opacity-0 group-hover:opacity-100">
                          <ZoomIn size={20} className="text-gray-600" />
                        </div>
                      </div>
                    </div>
                  ) : isEditing ? (
                    <div 
                      onClick={triggerFileUpload}
                      className="flex items-center justify-center w-full h-64 transition-colors border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:border-gray-400"
                    >
                      <div className="text-center">
                        <Upload size={32} className="mx-auto mb-2 text-gray-400" />
                        <p className="text-gray-500">Click to upload receipt</p>
                        <p className="text-sm text-gray-400">PNG, JPG up to 10MB</p>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center w-full h-64 border border-gray-200 rounded-lg bg-gray-50">
                      <div className="text-center">
                        <Image size={32} className="mx-auto mb-2 text-gray-400" />
                        <p className="text-gray-500">No receipt uploaded</p>
                      </div>
                    </div>
                  )}

                  {displayDonation.proofOfReceipt && (
                    <p className="mt-2 text-xs text-center text-gray-500">
                      Click image to view full size
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {showImageModal && displayDonation.proofOfReceipt && (
        <ImageModal 
          src={displayDonation.proofOfReceipt} 
          onClose={handleImageModalClose} 
        />
      )}
    </>
  );
};

export default DonationDetailsModal;