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
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  if (error) {
    return <div className="text-red-500 text-center p-4">Error: {error}</div>;
  }

  return (
    <div className="flex h-screen bg-gray-50">
              <Sidebar role={user.role} />

      <h1 className="text-3xl font-bold text-center mb-8">Make a Donation</h1>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Card - Donation Form */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Donation Form</h2>
          <DonationForm userId={user.id} onSuccess={handleDonationSuccess} />
        </div>

        {/* Right Card - Donation History */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Your Donation History</h2>
          <DonationTable donations={donations} />
        </div>
      </div>
    </div>
  );
};

export default UserDonationPage;