// src/components/dashboard/DonationsChart.js
import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';

const DonationsChart = ({ donations }) => {
  const currentYear = new Date().getFullYear();
  
  const chartData = React.useMemo(() => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 
                   'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    
    const monthlyData = months.map(month => ({
      name: month,
      currentYear: 0,
      previousYear: 0
    }));
    
    donations.forEach(donation => {
      if (!donation.isValidated) return;
      
      const date = new Date(donation.date || donation.createdAt);
      const year = date.getFullYear();
      const month = date.getMonth();
      const amount = parseFloat(donation.amount) || 0;
      
      if (year === currentYear) {
        monthlyData[month].currentYear += amount;
      } else if (year === currentYear - 1) {
        monthlyData[month].previousYear += amount;
      }
    });
    
    return monthlyData;
  }, [donations, currentYear]);

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-medium text-gray-700">Donations</h3>
        <div className="flex items-center text-sm">
          <div className="flex items-center mr-4">
            <span className="w-3 h-3 inline-block bg-primary rounded-full mr-1"></span>
            <span>Current Year</span>
          </div>
          <div className="flex items-center">
            <span className="w-3 h-3 inline-block bg-secondary rounded-full mr-1"></span>
            <span>Previous Year</span>
          </div>
        </div>
      </div>
      
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line 
              type="monotone" 
              dataKey="currentYear" 
              stroke="#00254C" 
              strokeWidth={2}
              activeDot={{ r: 8 }} 
            />
            <Line 
              type="monotone" 
              dataKey="previousYear" 
              stroke="#EEB211" 
              strokeWidth={2}
              strokeDasharray="5 5"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default DonationsChart;