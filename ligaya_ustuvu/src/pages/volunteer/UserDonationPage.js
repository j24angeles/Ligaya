// src/pages/UserDonationPage.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import DonationForm from '../../components/volunteer-donations/DonationForm';
import DonationTable from '../../components/volunteer-donations/DonationTable';
import { getDonationsByUserId } from '../../api/donationService';
import Sidebar from '../../common/Sidebar';

const UserDonationPage = () => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    const fetchDonations = async () => {
      try {
        const userId = user.id;
        const userDonations = await getDonationsByUserId(userId);
        setDonations(userDonations);
      } catch (err) {
        setError(err.message || 'Failed to fetch donations');
      } finally {
        setLoading(false);
      }
    };

    fetchDonations();
  }, [isAuthenticated, navigate, user]);

  const handleDonationSuccess = (newDonation) => {
    setDonations(prevDonations => [newDonation, ...prevDonations]);
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50">
        <div className="bg-white p-6 rounded-lg shadow-md max-w-md w-full text-center">
          <div className="text-red-500 text-lg font-medium mb-4">Error</div>
          <p className="text-gray-700">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <Sidebar role={user.role} />
      
      {/* Main Content */}
      <main className="flex-1 ml-64 p-8">
        <div className="max-w-7xl mx-auto">
          {/* Page Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Donation Dashboard</h1>
            <p className="mt-2 text-gray-600">Support our cause by making a donation</p>
          </div>

          {/* Cards Container */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Donation Form Card */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="p-6">
                <div className="flex items-center mb-6">
                  <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-2 rounded-lg mr-4 text-white">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h2 className="text-xl font-semibold text-gray-800">New Donation</h2>
                </div>
                <DonationForm userId={user.id} onSuccess={handleDonationSuccess} />
              </div>
            </div>

            {/* Donation History Card */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="p-6">
                <div className="flex items-center mb-6">
                  <div className="bg-gradient-to-r from-green-500 to-green-600 p-2 rounded-lg mr-4 text-white">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                  </div>
                  <h2 className="text-xl font-semibold text-gray-800">Your Donation History</h2>
                </div>
                <DonationTable donations={donations} />
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default UserDonationPage;