import React, { useState, useEffect } from 'react';
import axios from 'axios';

const RecentDonorsTable = () => {
  const [recentDonations, setRecentDonations] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDonationsAndUsers = async () => {
      try {
        const [donationsRes, usersRes] = await Promise.all([
          axios.get('http://localhost:3001/donations'),
          axios.get('http://localhost:3001/users')
        ]);

        const sortedDonations = donationsRes.data
          .sort((a, b) => new Date(b.createdAt || b.date) - new Date(a.createdAt || a.date))
          .slice(0, 3);

        setRecentDonations(sortedDonations);
        setUsers(usersRes.data);
      } catch (error) {
        console.error('Failed to load donations or users:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDonationsAndUsers();
  }, []);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getUserName = (userId) => {
    const user = users.find((u) => u.id === userId);
    if (!user) return 'Full Name';
    return user.name || `${user.firstName || ''} ${user.lastName || ''}`.trim();
  };

  return (
    <div className="bg-white rounded-xl shadow-sm p-4">
      <h3 className="font-semibold mb-4">Recent Donors</h3>
      {loading ? (
        <div className="text-center text-gray-500 my-8">Loading recent donations...</div>
      ) : recentDonations.length === 0 ? (
        <div className="text-center text-gray-500 my-8">No donations available.</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left text-xs uppercase text-gray-500">
                <th className="px-4 py-2">Donor Name</th>
                <th className="px-4 py-2">Status</th>
                <th className="px-4 py-2">Date</th>
                <th className="px-4 py-2 text-right">Amount</th>
              </tr>
            </thead>
            <tbody>
              {recentDonations.map((donation) => (
                <tr key={donation.id} className="border-t border-gray-100">
                  <td className="px-4 py-3 font-medium">
                    {getUserName(donation.userId)}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      donation.isValidated
                        ? 'bg-green-100 text-green-800'
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {donation.isValidated ? 'Verified' : 'Pending'}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-600">
                    {formatDate(donation.date || donation.createdAt)}
                  </td>
                  <td className="px-4 py-3 text-right font-medium">
                    PHP {parseFloat(donation.amount).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default RecentDonorsTable;
