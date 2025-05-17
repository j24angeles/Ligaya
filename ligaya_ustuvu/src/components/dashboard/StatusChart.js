import React, { useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { MdCheckCircle, MdHourglassEmpty } from 'react-icons/md';

const StatusChart = ({ donations }) => {
  const [chartData, setChartData] = useState([]);
  
  useEffect(() => {
    if (donations && donations.length > 0) {
      // Process donations data for chart
      const yearlyData = {};
      const currentYear = new Date().getFullYear();
      
      // Initialize years from 2015 to current year
      for (let year = 2015; year <= currentYear; year++) {
        yearlyData[year] = {
          year,
          verified: 0,
          pending: 0
        };
      }
      
      // Count donations by status and year
      donations.forEach(donation => {
        const donationDate = new Date(donation.date);
        const year = donationDate.getFullYear();
        
        if (yearlyData[year]) {
          if (donation.isValidated) {
            yearlyData[year].verified += 1;
          } else {
            yearlyData[year].pending += 1;
          }
        }
      });
      
      // Convert to array for Recharts
      const chartDataArray = Object.values(yearlyData);
      setChartData(chartDataArray);
    }
  }, [donations]);

  return (
    <div className="bg-white rounded-xl shadow-sm p-4">
      <div className="mb-4">
        <h3 className="font-semibold">Donation Tracking</h3>
        <div className="flex items-center gap-6 mt-2">
          <div className="flex items-center gap-2">
            <MdCheckCircle className="text-primary text-xl" />
            <span className="text-sm">Verified</span>
          </div>
          <div className="flex items-center gap-2">
            <MdHourglassEmpty className="text-secondary text-xl" />
            <span className="text-sm">Pending</span>
          </div>
        </div>
      </div>
      
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={chartData}
            margin={{ top: 5, right: 20, left: 0, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
            <XAxis 
              dataKey="year" 
              tick={{ fontSize: 12 }}
              tickLine={false}
            />
            <YAxis 
              tick={{ fontSize: 12 }}
              tickLine={false}
              axisLine={false}
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'white', 
                borderRadius: '8px',
                boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
                border: 'none'
              }}
              labelStyle={{ fontWeight: 'bold', marginBottom: '5px' }}
            />
            <Line 
              type="monotone" 
              dataKey="verified" 
              name="Verified"
              stroke="#00254C" 
              strokeWidth={2}
              dot={{ strokeWidth: 0, r: 4, fill: "#00254C" }}
              activeDot={{ r: 6, fill: "#00254C" }}
            />
            <Line 
              type="monotone" 
              dataKey="pending" 
              name="Pending"
              stroke="#EEB211" 
              strokeWidth={2}
              dot={{ strokeWidth: 0, r: 4, fill: "#EEB211" }}
              activeDot={{ r: 6, fill: "#EEB211" }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default StatusChart;
