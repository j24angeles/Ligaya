import React, { useEffect, useState } from 'react';
import { FaUser, FaTrophy } from 'react-icons/fa';

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

  const getDonorInitials = (userId) => {
    const user = users.find(u => u.id.toString() === userId.toString());
    
    if (!user) return 'U';
    
    let name = '';
    if (user.name) name = user.name;
    else if (user.firstName || user.lastName) {
      name = `${user.firstName || ''} ${user.lastName || ''}`.trim();
    }
    else if (user.username) name = user.username;
    else return 'D';
    
    const parts = name.split(' ');
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    }
    return name[0] ? name[0].toUpperCase() : 'D';
  };

  const TableWrapper = ({ children }) => (
    <div className="bg-white rounded-xl shadow p-4 h-full">
      <h3 className="font-semibold mb-3 text-sm flex items-center gap-2">
        <FaTrophy className="text-yellow-500" />
        Top Donors This Month
      </h3>
      {children}
    </div>
  );

  if (loading) {
    return (
      <TableWrapper>
        <div className="text-center text-gray-500 my-4 text-xs">
          Loading top donors...
        </div>
      </TableWrapper>
    );
  }

  if (topDonors.length === 0) {
    return (
      <TableWrapper>
        <div className="text-center text-gray-500 my-4 text-xs">
          No donations this month.
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
              <th className="px-2 py-1 text-right">Total</th>
            </tr>
          </thead>
          <tbody>
            {topDonors.map(({ userId, name, total }, index) => (
              <tr key={userId} className="border-t border-gray-100 hover:bg-gray-50">
                <td className="px-2 py-2">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-primary text-xs font-medium">
                      {getDonorInitials(userId)}
                    </div>
                    <span>{name}</span>
                    {index === 0 && <FaTrophy className="text-yellow-500 text-xs" />}
                  </div>
                </td>
                <td className="px-2 py-2 text-right font-medium whitespace-nowrap">
                  ₱{total.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </TableWrapper>
  );
};

export default TopDonorsList;