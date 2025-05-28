import React, { useEffect, useState, useRef } from 'react';
import { X, ZoomIn, Image } from 'lucide-react';

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

// Full-screen image modal component with pan and zoom
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

      // Get mouse position relative to the image
      const mouseX = e.clientX - rect.left - rect.width / 2;
      const mouseY = e.clientY - rect.top - rect.height / 2;

      const delta = e.deltaY > 0 ? 0.9 : 1.1;
      const newScale = Math.min(Math.max(scale * delta, 0.5), 5);
      
      // Adjust position to zoom towards mouse cursor
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
    
    // Reset position if zoomed out to 1x or less
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
      {/* Controls */}
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

      {/* Instructions */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-50 text-white px-4 py-2 rounded-lg text-sm">
        Scroll to zoom • Drag to pan • ESC to close
      </div>

      {/* Image Container */}
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

      {/* Background click to close */}
      <div 
        className="absolute inset-0 -z-10" 
        onClick={onClose}
      />
    </div>
  );
};

const AdminDonationDetailsModal = ({ donation, users, onClose }) => {
  const [showImageModal, setShowImageModal] = useState(false);

  // Add event listener to prevent body scrolling when modal is open
  useEffect(() => {
    // Only apply when donation exists
    if (donation) {
      // Disable scrolling on body when modal appears
      document.body.style.overflow = 'hidden';
      
      // Re-enable scrolling when modal is closed
      return () => {
        document.body.style.overflow = 'visible';
      };
    }
  }, [donation]);

  if (!donation) return null;

  const getDonorName = (userId) => {
    const user = users.find(user => user.id.toString() === userId.toString());
    return user ? `${user.firstName} ${user.lastName}` : 'Unknown Donor';
  };

  const handleImageClick = () => {
    setShowImageModal(true);
  };

  const handleImageModalClose = () => {
    setShowImageModal(false);
  };

  return (
    <>
      <div className="fixed inset-0 z-50 overflow-hidden">
        {/* Overlay */}
        <div className="fixed inset-0 bg-black bg-opacity-50 transition-opacity" onClick={onClose}></div>
        
        {/* Modal container - centered */}
        <div className="flex items-center justify-center min-h-screen p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto relative z-10">
            <div className="flex justify-between items-center border-b p-4">
              <h3 className="text-lg font-medium text-gray-900">Donation Details</h3>
              <button 
                onClick={onClose} 
                className="text-gray-400 hover:text-gray-500 transition-colors focus:outline-none focus:ring-2 focus:ring-primary rounded"
              >
                <X size={20} />
              </button>
            </div>
            
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

              {/* Proof of Receipt Section */}
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
                      className="w-full h-64 object-contain bg-gray-50 rounded-lg border border-gray-200 cursor-pointer hover:shadow-md transition-shadow"
                      onClick={handleImageClick}
                    />
                    {/* Zoom overlay */}
                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-200 rounded-lg flex items-center justify-center cursor-pointer" onClick={handleImageClick}>
                      <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-white rounded-full p-2 shadow-lg">
                        <ZoomIn size={20} className="text-gray-600" />
                      </div>
                    </div>
                  </div>
                  <p className="text-xs text-gray-500 mt-2 text-center">
                    Click image to view full size
                  </p>
                </div>
              )}
            </div>
            
            <div className="border-t p-4 flex justify-end">
              {/* Footer content if needed */}
            </div>
          </div>
        </div>
      </div>

      {/* Full-screen image modal */}
      {showImageModal && donation.proofOfReceipt && (
        <ImageModal 
          src={donation.proofOfReceipt} 
          onClose={handleImageModalClose} 
        />
      )}
    </>
  );
};

export default AdminDonationDetailsModal;