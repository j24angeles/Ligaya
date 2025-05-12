// src/pages/UserDonationPage.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import DonationForm from '../../components/volunteer-donations/DonationForm';
import DonationTable from '../../components/volunteer-donations/DonationTable';
import { getDonationsByUserId } from '../../api/donationService';
import Sidebar from '../../common/Sidebar';
import DonationAccountCards from '../../components/volunteer-donations/DonationAccountCards';

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
    <div className="flex min-h-screen bg-gray-50 overflow-x-hidden">
      {/* Sidebar */}
      <Sidebar role={user.role} />

      {/* Main Content */}
      <main className="flex-1 p-4 sm:p-6 lg:p-8 mt-3 mx-auto max-w-full lg:ml-64 sm:ml-0">
        <div className="mb-8 sm:mb-6">
          {/* Page Header */}
          <div className="mb-4 sm:mb-3">
            {/* Added more top margin on small screens */}
            <h1 className="text-3xl font-bold text-primary mt-12 sm:mt-5">Make a Donation</h1>
            <p className="text-gray-600 mt-2 text-xs sm:text-sm">
              Kindly transfer your donations directly to our official accounts,
              then complete the donation form so we can verify your contribution.
            </p>
          </div>
          <DonationAccountCards />

          {/* Donation Section */}
          <div className="flex flex-col lg:flex-row gap-4 sm:gap-6">
            {/* Donation Form Card */}
            <div className="bg-white rounded-md shadow-sm border border-gray-200 px-4 sm:px-6 py-4 w-full lg:w-[47%] max-h-[650px] overflow-auto">
              <DonationForm
                userId={user.id}
                onSuccess={(newDonation) => {
                  setDonations(prev => [newDonation, ...prev]);
                }}
              />
            </div>

            {/* Donation History Card */}
            <div className="bg-white rounded-md shadow-sm border border-gray-200 px-4 sm:px-6 py-4 w-full lg:w-[53%] max-h-[650px] overflow-auto">
              <div className="flex items-center mb-4 sm:mb-6">
                <h2 className="text-lg sm:text-xl font-semibold text-gray-800">Donation History</h2>
              </div>
              <DonationTable donations={donations} />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default UserDonationPage;
