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
      <div className="absolute top-4 right-4 flex items-center space-x-2 z-10">
        <div className="bg-black bg-opacity-50 rounded-lg px-3 py-1 text-white text-sm">
          {Math.round(scale * 100)}%
        </div>
        <button
          onClick={handleZoomOut}
          className="bg-black bg-opacity-50 hover:bg-opacity-70 text-white p-2 rounded-lg transition-colors"
          title="Zoom Out"
        >
          <span className="text-lg font-bold">−</span>
        </button>
        <button
          onClick={handleZoomIn}
          className="bg-black bg-opacity-50 hover:bg-opacity-70 text-white p-2 rounded-lg transition-colors"
          title="Zoom In"
        >
          <span className="text-lg font-bold">+</span>
        </button>
        <button
          onClick={handleReset}
          className="bg-black bg-opacity-50 hover:bg-opacity-70 text-white px-3 py-2 rounded-lg transition-colors text-sm"
          title="Reset View"
        >
          Reset
        </button>
        <button
          onClick={onClose}
          className="bg-black bg-opacity-50 hover:bg-opacity-70 text-white p-2 rounded-lg transition-colors"
          title="Close"
        >
          <X size={20} />
        </button>
      </div>

      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-50 text-white px-4 py-2 rounded-lg text-sm">
        Scroll to zoom • Drag to pan • ESC to close
      </div>

      <div className="relative w-full h-full flex items-center justify-center overflow-hidden">
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
  const fileInputRef = useRef(null);

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

  const handleSave = () => {
    onUpdate(editedDonation);
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
      const reader = new FileReader();
      reader.onload = (event) => {
        setEditedDonation(prev => ({
          ...prev,
          proofOfReceipt: event.target.result
        }));
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

  // Check if receipt should be shown (not cash payment method)
  const shouldShowReceipt = editedDonation.paymentMethod !== 'cash';

  return (
    <>
      <div className="fixed inset-0 z-50 overflow-hidden">
        <div className="fixed inset-0 bg-black bg-opacity-50 transition-opacity" onClick={onClose}></div>
        
        <div className="flex items-center justify-center min-h-screen p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto relative z-10">
            <div className="flex justify-between items-center border-b p-4">
              <h3 className="text-lg font-medium text-gray-900">Donation Details</h3>
              <div className="flex items-center space-x-2">
                {!isEditing ? (
                  <button 
                    onClick={handleEdit}
                    className="text-gray-600 hover:text-primary transition-colors p-1 rounded"
                  >
                    <Edit size={20} />
                  </button>
                ) : (
                  <button 
                    onClick={handleSave}
                    className="text-gray-600 hover:text-primary transition-colors p-1 rounded"
                  >
                    <Save size={20} />
                  </button>
                )}
                <button 
                  onClick={onClose} 
                  className="text-gray-400 hover:text-gray-500 transition-colors focus:outline-none focus:ring-2 focus:ring-primary rounded"
                >
                  <X size={20} />
                </button>
              </div>
            </div>
            
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Amount</p>
                  {isEditing ? (
                    <input
                      type="number"
                      name="amount"
                      value={editedDonation.amount}
                      onChange={handleChange}
                      className="font-medium border rounded p-1 w-full"
                    />
                  ) : (
                    <p className="font-medium">₱{parseFloat(donation.amount).toFixed(2)}</p>
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
                      className="font-medium border rounded p-1 w-full"
                    />
                  ) : (
                    <p className="font-medium">{formatDate(donation.date)}</p>
                  )}
                </div>
                
                <div>
                  <p className="text-sm text-gray-500">Payment Method</p>
                  {isEditing ? (
                    <select
                      name="paymentMethod"
                      value={editedDonation.paymentMethod}
                      onChange={handleChange}
                      className="font-medium border rounded p-1 w-full"
                    >
                      <option value="cash">Cash</option>
                      <option value="gcash">GCash</option>
                      <option value="maya">Maya</option>
                      <option value="bank_transfer">Bank Transfer</option>
                    </select>
                  ) : (
                    <p className="font-medium">{formatPaymentMethod(donation.paymentMethod)}</p>
                  )}
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
                
                {shouldShowReceipt && editedDonation.referenceNumber && (
                  <div>
                    <p className="text-sm text-gray-500">Reference Number</p>
                    {isEditing ? (
                      <input
                        type="text"
                        name="referenceNumber"
                        value={editedDonation.referenceNumber}
                        onChange={handleChange}
                        className="font-medium border rounded p-1 w-full"
                      />
                    ) : (
                      <p className="font-medium">{donation.referenceNumber}</p>
                    )}
                  </div>
                )}
                
                {donation.notes && (
                  <div className="md:col-span-2">
                    <p className="text-sm text-gray-500">Notes</p>
                    {isEditing ? (
                      <textarea
                        name="notes"
                        value={editedDonation.notes}
                        onChange={handleChange}
                        className="font-medium border rounded p-1 w-full"
                      />
                    ) : (
                      <p className="font-medium">{donation.notes}</p>
                    )}
                  </div>
                )}
                
                {donation.rejectionReason && (
                  <div className="md:col-span-2">
                    <p className="text-sm text-gray-500">Rejection Reason</p>
                    <p className="font-medium text-red-600">{donation.rejectionReason}</p>
                  </div>
                )}
              </div>

              {shouldShowReceipt && (
                <div className="mt-6 border-t pt-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center">
                      <Image size={16} className="mr-2 text-gray-500" />
                      <p className="text-sm font-medium text-gray-700">Proof of Receipt</p>
                    </div>
                    {isEditing && (
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={triggerFileUpload}
                          className="flex items-center space-x-1 text-blue-600 hover:text-blue-700 text-sm"
                        >
                          <Upload size={14} />
                          <span>{editedDonation.proofOfReceipt ? 'Change' : 'Upload'}</span>
                        </button>
                        {editedDonation.proofOfReceipt && (
                          <button
                            onClick={handleRemoveReceipt}
                            className="flex items-center space-x-1 text-red-600 hover:text-red-700 text-sm"
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
                  />

                  {editedDonation.proofOfReceipt ? (
                    <div className="relative group">
                      <img
                        src={editedDonation.proofOfReceipt}
                        alt="Proof of receipt"
                        className="w-full h-64 object-contain bg-gray-50 rounded-lg border border-gray-200 cursor-pointer hover:shadow-md transition-shadow"
                        onClick={handleImageClick}
                      />
                      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-200 rounded-lg flex items-center justify-center cursor-pointer" onClick={handleImageClick}>
                        <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-white rounded-full p-2 shadow-lg">
                          <ZoomIn size={20} className="text-gray-600" />
                        </div>
                      </div>
                    </div>
                  ) : isEditing ? (
                    <div 
                      onClick={triggerFileUpload}
                      className="w-full h-64 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center cursor-pointer hover:border-gray-400 transition-colors"
                    >
                      <div className="text-center">
                        <Upload size={32} className="mx-auto text-gray-400 mb-2" />
                        <p className="text-gray-500">Click to upload receipt</p>
                        <p className="text-sm text-gray-400">PNG, JPG up to 10MB</p>
                      </div>
                    </div>
                  ) : (
                    <div className="w-full h-64 bg-gray-50 rounded-lg border border-gray-200 flex items-center justify-center">
                      <div className="text-center">
                        <Image size={32} className="mx-auto text-gray-400 mb-2" />
                        <p className="text-gray-500">No receipt uploaded</p>
                      </div>
                    </div>
                  )}

                  {editedDonation.proofOfReceipt && (
                    <p className="text-xs text-gray-500 mt-2 text-center">
                      Click image to view full size
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {showImageModal && editedDonation.proofOfReceipt && (
        <ImageModal 
          src={editedDonation.proofOfReceipt} 
          onClose={handleImageModalClose} 
        />
      )}
    </>
  );
};

export default DonationDetailsModal;