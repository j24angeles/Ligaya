import React, { useState, useRef } from 'react';
import { Upload, X, Image } from 'lucide-react';

const ProofOfReceiptUpload = ({ value, onChange, error, show = true }) => {
  const fileInputRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);

  if (!show) return null;

  const handleImageClick = () => {
    fileInputRef.current.click();
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      handleImageFile(file);
    }
  };

  const handleImageFile = (file) => {
    // Check if the file is an image
    if (file.type.startsWith('image/')) {
      // Check file size (limit to 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('File size must be less than 5MB');
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        const imageDataUrl = e.target.result;
        onChange(imageDataUrl);
      };
      reader.readAsDataURL(file);
    } else {
      alert('Please select an image file (JPEG, PNG, etc.)');
    }
  };

  const handleRemoveImage = () => {
    onChange('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Drag and drop handlers
  const handleDragEnter = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isDragging) {
      setIsDragging(true);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      handleImageFile(file);
    }
  };

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        <Image size={16} className="inline mr-1" />
  Proof of Receipt <span className="text-red-500">*</span>
      </label>
      <p className="text-xs text-gray-500 mb-2">
        Upload a clear photo of your payment receipt or transaction screenshot
      </p>
      
      {value ? (
        <div className="relative mt-1 mb-2">
          <img 
            src={value} 
            alt="Proof of receipt" 
            className="w-full h-48 object-cover rounded-md border border-gray-300"
          />
          <button
            type="button"
            onClick={handleRemoveImage}
            className="absolute top-2 right-2 p-1 bg-white rounded-full shadow-md hover:bg-gray-100 transition-colors"
          >
            <X size={16} className="text-gray-700" />
          </button>
        </div>
      ) : (
        <div
          onClick={handleImageClick}
          onDragEnter={handleDragEnter}
          onDragLeave={handleDragLeave}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          className={`mt-1 flex flex-col items-center justify-center h-32 border-2 border-dashed rounded-md cursor-pointer transition-all ${
            isDragging 
              ? 'border-primary bg-primary/5' 
              : error 
                ? 'border-red-300 hover:border-red-400 hover:bg-red-50'
                : 'border-gray-300 hover:border-primary hover:bg-gray-50'
          }`}
        >
          <Upload size={24} className={`mb-2 ${error ? 'text-red-400' : 'text-gray-400'}`} />
          <p className={`text-sm ${error ? 'text-red-500' : 'text-gray-500'}`}>
            Click to upload or drag and drop
          </p>
          <p className="text-xs text-gray-400 mt-1">
            PNG, JPG, GIF up to 5MB
          </p>
        </div>
      )}
      
      {error && (
        <p className="text-red-500 text-sm mt-1">{error}</p>
      )}
      
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleImageChange}
        className="hidden"
      />
    </div>
  );
};

export default ProofOfReceiptUpload;