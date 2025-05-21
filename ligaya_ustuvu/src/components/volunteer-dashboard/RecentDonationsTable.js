import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { getDonationsByUserId } from '../../api/donationService';
import { FaHandHoldingHeart } from 'react-icons/fa';


const RecentDonationsTable = () => {
  const { user } = useAuth();
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserDonations = async () => {
      if (!user || !user.id) return;

      try {
        setLoading(true);
        const userDonations = await getDonationsByUserId(user.id);
        
        // Filter out archived donations
        const activeDonations = userDonations.filter(donation => 
          donation.status !== 'archived'
        );
        
        setDonations(activeDonations);
        setError(null);
      } catch (err) {
        console.error('Error fetching user donations:', err);
        setError('Failed to load your donations. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchUserDonations();
  }, [user]);

  const formatDate = (d) =>
    new Date(d).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });

  const recentDonations = donations.slice(0, 3);

  const TableWrapper = ({ children }) => (
    <div className="bg-white rounded-xl shadow-s p-2 h-full">

<h3 className="font-semibold mb-3 text-sm flex items-center gap-2">
  <FaHandHoldingHeart className="text-inherit" />
  Your Recent Donations
</h3>

      {children}
    </div>
  );

  if (!user) {
    return (
      <TableWrapper>
        <div className="text-center text-gray-500 my-4 text-xs">
          Please log in to view your donations.
        </div>
      </TableWrapper>
    );
  }

  if (loading) {
    return (
      <TableWrapper>
        <div className="text-center text-gray-500 my-4 text-xs">
          Loading your donations...
        </div>
      </TableWrapper>
    );
  }

  if (error) {
    return (
      <TableWrapper>
        <div className="text-center text-red-500 my-4 text-xs">{error}</div>
      </TableWrapper>
    );
  }

  if (donations.length === 0) {
    return (
      <TableWrapper>
        <div className="text-center text-gray-500 my-4 text-xs">
          You haven't made any donations yet.
        </div>
      </TableWrapper>
    );
  }

  return (
    <TableWrapper>
      <div className="overflow-x-auto">
        <table className="w-full text-xs">
          <thead>
            <tr className="text-left uppercase text-gray-500">
              <th className="px-2 py-1">Status</th>
              <th className="px-2 py-1">Date</th>
              <th className="px-2 py-1">Method</th>
              <th className="px-2 py-1 text-right">Amount</th>
            </tr>
          </thead>
          <tbody>
            {recentDonations.map(({ id, paymentMethod, validationStatus, date, createdAt, amount }) => (
              <tr key={id} className="border-t border-gray-100">
                <td className="px-2 py-1">
                  <span
                    className={`px-2 py-0.5 text-[11px] rounded-full ${
                      validationStatus === 'validated'
                        ? 'bg-green-100 text-green-700'
                        : validationStatus === 'rejected'
                        ? 'bg-red-100 text-red-700'
                        : 'bg-yellow-100 text-yellow-700'
                    }`}
                  >
                    {validationStatus === 'validated'
                      ? 'Verified'
                      : validationStatus === 'rejected'
                      ? 'Rejected'
                      : 'Pending'}
                  </span>
                </td>
                <td className="px-2 py-1 text-gray-600">{formatDate(date || createdAt)}</td>
                <td className="px-2 py-1 capitalize">{paymentMethod?.replace('_', ' ') || 'N/A'}</td>
                <td className="px-2 py-1 text-right font-medium">
                  ₱{parseFloat(amount || 0).toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </TableWrapper>
  );
};

export default RecentDonationsTable;