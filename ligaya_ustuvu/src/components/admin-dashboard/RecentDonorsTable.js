import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaUser } from 'react-icons/fa';

const RecentDonorsTable = () => {
  const [donations, setDonations] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [donRes, userRes] = await Promise.all([
          axios.get('http://localhost:3001/donations?_sort=date,createdAt&_order=desc&_limit=3'),
          axios.get('http://localhost:3001/users'),
        ]);
        
        setDonations(donRes.data);
        setUsers(userRes.data);
        setError(null);
      } catch (err) {
        console.error('Failed to load donations or users:', err);
        setError('Failed to load recent donors data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const formatDate = (d) =>
    new Date(d).toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });

  const getUserName = (userId) => {
    if (!userId) return 'Anonymous Donor';
    
    const user = users.find(u => u.id.toString() === userId.toString());
    if (!user) return 'Unknown Donor';
    
    // Handle different possible name formats
    if (user.name) return user.name;
    if (user.firstName || user.lastName) {
      return `${user.firstName || ''} ${user.lastName || ''}`.trim();
    }
    if (user.username) return user.username;
    return 'Donor';
  };

  const getDonorInitials = (userId) => {
    const name = getUserName(userId);
    const parts = name.split(' ');
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    }
    return name[0] ? name[0].toUpperCase() : 'D';
  };

  const TableWrapper = ({ children }) => (
    <div className="bg-white rounded-xl shadow p-4 h-full">
      <h3 className="font-semibold mb-3 text-sm flex items-center gap-2">
        <FaUser className="text-inherit" />
        Recent Donors
      </h3>
      {children}
    </div>
  );

  if (loading) {
    return (
      <TableWrapper>
        <div className="text-center text-gray-500 my-4 text-xs">
          Loading recent donors...
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
          No recent donations found.
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
              <th className="px-2 py-1">Donor</th>
              <th className="px-2 py-1">Status</th>
              <th className="px-2 py-1">Date</th>
              <th className="px-2 py-1 text-right">Amount</th>
            </tr>
          </thead>
          <tbody>
            {donations.map(({ id, userId, validationStatus, date, createdAt, amount }) => (
              <tr key={id} className="border-t border-gray-100 hover:bg-gray-50">
                <td className="px-2 py-2">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-primary text-xs font-medium">
                      {getDonorInitials(userId)}
                    </div>
                    <span>{getUserName(userId)}</span>
                  </div>
                </td>
                <td className="px-2 py-2">
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
                <td className="px-2 py-2 text-gray-600 whitespace-nowrap">
                  {formatDate(date || createdAt)}
                </td>
                <td className="px-2 py-2 text-right font-medium whitespace-nowrap">
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

export default RecentDonorsTable;