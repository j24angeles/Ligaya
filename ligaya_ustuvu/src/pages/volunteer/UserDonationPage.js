import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import Sidebar from '../../common/Sidebar';
import DonationForm from '../../components/volunteer-donations/DonationForm';
import DonationTable from '../../components/volunteer-donations/DonationTable';
import { getDonationsByUserId } from '../../api/donationService';
import DonationAccountCards from '../../components/volunteer-donations/DonationAccountCards';

const UserDonationPage = () => {
  const [user, setUser] = useState(null);
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
        
        // Fetch donations after we have the user
        const fetchDonations = async () => {
          try {
            const userDonations = await getDonationsByUserId(parsedUser.id);
            setDonations(userDonations);
          } catch (err) {
            setError(err.message || 'Failed to fetch donations');
          } finally {
            setLoading(false);
          }
        };
        
        fetchDonations();
      } catch (error) {
        console.error('Error parsing current user:', error);
        localStorage.removeItem('currentUser');
        setLoading(false);
      }
    } else {
      setLoading(false);
    }
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar role={user.role} />
      
      {/* Main Content - with proper padding to avoid overlap */}
      <main className="flex-1 overflow-auto lg:ml-64 pt-16 lg:pt-4 px-4">
        <div className="container mx-auto">
          <div className="p-6 max-w-7xl mx-auto transition-all duration-300">
            <div className="mb-6">
              <h1 className="text-3xl font-bold text-primary">Make a Donation</h1>
<p className="text-gray-600 mt-2 max-w-prose">
                100% of your donations will go to our cause. 
              </p>
            </div>

            {/* Donation Account Cards */}
            <DonationAccountCards />

            {/* Donation Section */}
            <div className="flex flex-col lg:flex-row gap-6 mt-6">
              {/* Donation Form Card */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 w-full lg:w-[45%]">
                <DonationForm
                  userId={user.id}
                  onSuccess={(newDonation) => {
                    setDonations(prev => [newDonation, ...prev]);
                  }}
                />
              </div>

              {/* Donation History Card */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 w-full lg:w-[55%]">
                <div className="mb-4">
                  <h2 className="text-xl font-semibold text-gray-800">Donation History</h2>
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