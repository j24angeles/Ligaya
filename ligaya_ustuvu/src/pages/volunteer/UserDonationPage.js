import React, { useState, useEffect } from 'react';
import DonationToggle from '../../components/volunteer-donations/DonationToggle';
import DonationForm from '../../components/volunteer-donations/DonationForm';
import DonationTable from '../../components/volunteer-donations/DonationTable';
import { useAuth } from '../../context/AuthContext';
import { getAllDonations } from '../../api/donationService';
import Sidebar from '../../common/Sidebar';

const UserDonationPage = () => {
  const [activeTab, setActiveTab] = useState('donate');
  const [userDonations, setUserDonations] = useState([]);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    if (activeTab === 'history' && user) {
      fetchUserDonations();
    }
  }, [activeTab, user]);

  const fetchUserDonations = async () => {
    try {
      setLoading(true);
      const donations = await getAllDonations();
      // Filter donations for current user
      const filteredDonations = donations.filter(
        donation => donation.userId === user.id.toString()
      );
      setUserDonations(filteredDonations);
    } catch (error) {
      console.error('Error fetching donations:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  const handleDonationSuccess = () => {
    // Refresh the donation list if we're on the history tab
    if (activeTab === 'history') {
      fetchUserDonations();
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar role={user.role} />
      
      <main className="flex-1 overflow-auto lg:ml-64 pt-16 lg:pt-4 px-4">
        <div className="container mx-auto">
          <div className="bg-white rounded-lg shadow-md p-6 max-w-4xl mx-auto">
            <h1 className="text-2xl font-bold text-primary mb-6 text-center">User Donations</h1>
            
            <DonationToggle activeTab={activeTab} onChange={handleTabChange} />
            
            <div className="mt-6">
              {activeTab === 'donate' ? (
                <DonationForm onSuccess={handleDonationSuccess} />
              ) : (
                <DonationTable donations={userDonations} loading={loading} />
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default UserDonationPage;