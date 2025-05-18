import React, { useState, useEffect } from 'react';
import axios from 'axios';

const RecentDonorsTable = () => {
  const [donations, setDonations] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const [donRes, userRes] = await Promise.all([
          axios.get('http://localhost:3001/donations'),
          axios.get('http://localhost:3001/users'),
        ]);
        setDonations(
          donRes.data
            .sort((a, b) => new Date(b.createdAt || b.date) - new Date(a.createdAt || a.date))
            .slice(0, 3)
        );
        setUsers(userRes.data);
      } catch (e) {
        console.error('Failed to load donations or users:', e);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const formatDate = (d) =>
    new Date(d).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });

  const getUserName = (id) => {
    const u = users.find((x) => x.id === id);
    if (!u) return 'Full Name';
    return u.name || `${u.firstName || ''} ${u.lastName || ''}`.trim();
  };

  if (loading)
    return <div className="text-center text-gray-500 my-4 text-xs">Loading recent donations...</div>;

  if (donations.length === 0)
    return <div className="text-center text-gray-500 my-4 text-xs">No donations available.</div>;

  return (
    <div className="bg-white rounded-md shadow p-3">
      <h3 className="font-semibold mb-3 text-sm">Recent Donors</h3>
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
            {donations.map(({ id, userId, isValidated, date, createdAt, amount }) => (
              <tr key={id} className="border-t border-gray-100">
                <td className="px-2 py-1">{getUserName(userId)}</td>
                <td className="px-2 py-1">
                  <span
                    className={`px-2 py-0.5 text-[11px] rounded-full ${
                      isValidated ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                    }`}
                  >
                    {isValidated ? 'Verified' : 'Pending'}
                  </span>
                </td>
                <td className="px-2 py-1 text-gray-600">{formatDate(date || createdAt)}</td>
                <td className="px-2 py-1 text-right font-medium">
                  PHP {parseFloat(amount).toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RecentDonorsTable;
