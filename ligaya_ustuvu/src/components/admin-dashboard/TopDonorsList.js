import React, { useEffect, useState } from 'react';

const TopDonorsList = ({ donations = [], users = [], max = 3 }) => {
  const [topDonors, setTopDonors] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const processTopDonors = () => {
      const now = new Date();

      const thisMonthDonations = donations.filter(d => {
        const dDate = new Date(d.date || d.createdAt);
        return (
          d.isValidated &&
          dDate.getFullYear() === now.getFullYear() &&
          dDate.getMonth() === now.getMonth()
        );
      });

      // Sum total donations per userId
      const totalsMap = thisMonthDonations.reduce((acc, d) => {
        const amt = parseFloat(d.amount) || 0;
        acc[d.userId] = (acc[d.userId] || 0) + amt;
        return acc;
      }, {});

      // Sort and format result
      const sorted = Object.entries(totalsMap)
        .map(([userId, total]) => {
          const u = users.find(u => u.id.toString() === userId.toString());
          const name = u ? (u.name || `${u.firstName || ''} ${u.lastName || ''}`.trim()) : 'Unknown';
          return { userId, total, name };
        })
        .sort((a, b) => b.total - a.total)
        .slice(0, max);

      setTopDonors(sorted);
      setLoading(false);
    };

    processTopDonors();
  }, [donations, users, max]);

  if (loading) {
    return <div className="text-center text-gray-500 my-4 text-xs">Loading top donors…</div>;
  }

  if (topDonors.length === 0) {
    return <div className="text-center text-gray-500 my-4 text-xs">No donations this month.</div>;
  }

  return (
    <div className="bg-white rounded-md shadow p-3">
      <h3 className="font-semibold mb-3 text-sm">Top Donors This Month</h3>
      <div className="overflow-x-auto">
        <table className="w-full text-xs">
          <thead>
            <tr className="text-left uppercase text-gray-500">
              <th className="px-2 py-1">Donor</th>
              <th className="px-2 py-1 text-right">Total</th>
            </tr>
          </thead>
          <tbody>
            {topDonors.map(({ userId, name, total }) => (
              <tr key={userId} className="border-t border-gray-100">
                <td className="px-2 py-1">{name}</td>
                <td className="px-2 py-1 text-right font-medium">
                  ₱{total.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TopDonorsList;
