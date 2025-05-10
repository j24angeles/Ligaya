import React from 'react';

const ProfileCard = ({ formData, previewUrl, handleProfilePictureClick, fileInputRef, handleFileSelect }) => {
  return (
    <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
      <div className="flex flex-col sm:flex-row items-center">
        <div className="relative mb-3 sm:mb-0 sm:mr-4">
          <div 
            className="w-20 h-20 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden cursor-pointer"
            onClick={handleProfilePictureClick}
          >
            {previewUrl ? (
              <img 
                src={previewUrl} 
                alt="Profile" 
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-2xl text-gray-400">
                {formData.firstName?.charAt(0)}{formData.lastName?.charAt(0)}
              </span>
            )}
          </div>
          <div 
            className="absolute bottom-0 right-0 bg-primary rounded-full w-6 h-6 flex items-center justify-center text-white cursor-pointer"
            onClick={handleProfilePictureClick}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </div>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileSelect}
            className="hidden"
            accept="image/*"
          />
        </div>
        <div className="text-center sm:text-left">
          <h3 className="text-lg font-semibold">{`${formData.firstName} ${formData.lastName}`}</h3>
          <p className="text-sm text-gray-600">{formData.email}</p>
        </div>
      </div>
    </div>
  );
};

export default ProfileCard;