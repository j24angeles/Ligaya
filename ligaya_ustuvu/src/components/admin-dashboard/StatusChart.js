import React, { useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { MdCheckCircle, MdHourglassEmpty, MdCancel } from 'react-icons/md';

const StatusChart = ({ donations }) => {
  const [chartData, setChartData] = useState([]);
  const [timeFrame, setTimeFrame] = useState('yearly');
  
  useEffect(() => {
    if (!donations?.length) return;
    
    // Process data based on the selected time frame
    const processedData = processDataByTimeFrame(donations, timeFrame);
    setChartData(processedData);
  }, [donations, timeFrame]);
  
  // Process donations data by the selected time frame
  const processDataByTimeFrame = (donations, timeFrame) => {
    switch (timeFrame) {
      case 'daily':
        return processDailyData(donations);
      case 'weekly':
        return processWeeklyData(donations);
      case 'monthly':
        return processMonthlyData(donations);
      case 'yearly':
      default:
        return processYearlyData(donations);
    }
  };
  
  // Process data for yearly view
  const processYearlyData = (donations) => {
    const currentYear = new Date().getFullYear();
    const yearlyData = {};
    
    // Initialize yearly data structure
    for (let y = currentYear - 5; y <= currentYear; y++) {
      yearlyData[y] = { label: y.toString(), verified: 0, pending: 0, rejected: 0 };
    }
    
    // Populate data
    donations.forEach(({ date, validationStatus }) => {
      if (!date) return;
      
      const year = new Date(date).getFullYear();
      const status = validationStatus || "pending";
      
      if (yearlyData[year]) {
        if (status === "validated") {
          yearlyData[year].verified++;
        } else if (status === "pending") {
          yearlyData[year].pending++;
        } else if (status === "rejected") {
          yearlyData[year].rejected++;
        }
      }
    });
    
    return Object.values(yearlyData);
  };
  
  // Process data for monthly view
  const processMonthlyData = (donations) => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    
    // Create data for all months of current year in order
    const monthlyData = months.map((month, index) => ({
      label: month,  // Just show month name without year
      month: index,
      verified: 0,
      pending: 0,
      rejected: 0
    }));
    
    // Populate data for current year only
    donations.forEach(({ date, validationStatus }) => {
      if (!date) return;
      
      const donationDate = new Date(date);
      const year = donationDate.getFullYear();
      const month = donationDate.getMonth();
      
      // Only count donations from current year
      if (year === currentYear && month >= 0 && month < 12) {
        const status = validationStatus || "pending";
        
        if (status === "validated") {
          monthlyData[month].verified++;
        } else if (status === "pending") {
          monthlyData[month].pending++;
        } else if (status === "rejected") {
          monthlyData[month].rejected++;
        }
      }
    });
    
    return monthlyData;
  };
  
  // Process data for weekly view
  const processWeeklyData = (donations) => {
    const weeksData = [];
    const currentDate = new Date();
    
    // Set to start of current week (Sunday)
    const startOfCurrentWeek = new Date(currentDate);
    startOfCurrentWeek.setDate(currentDate.getDate() - currentDate.getDay());
    startOfCurrentWeek.setHours(0, 0, 0, 0);

    // Generate data for last 10 weeks (including current week)
    for (let i = 9; i >= 0; i--) {
      const weekStartDate = new Date(startOfCurrentWeek);
      weekStartDate.setDate(startOfCurrentWeek.getDate() - (i * 7));
      
      const weekEndDate = new Date(weekStartDate);
      weekEndDate.setDate(weekStartDate.getDate() + 6);
      weekEndDate.setHours(23, 59, 59, 999);
      
      // Format label
      const startMonth = weekStartDate.getMonth() + 1;
      const startDay = weekStartDate.getDate();
      const endMonth = weekEndDate.getMonth() + 1;
      const endDay = weekEndDate.getDate();
      
      const weekLabel = `${startMonth}/${startDay}-${endMonth}/${endDay}`;
      
      weeksData.push({
        label: weekLabel,
        verified: 0,
        pending: 0,
        rejected: 0,
        weekStart: new Date(weekStartDate),
        weekEnd: new Date(weekEndDate)
      });
    }
    
    // Populate data
    donations.forEach(({ date, validationStatus }) => {
      if (!date) return;
      
      const donationDate = new Date(date);
      const status = validationStatus || "pending";
      
      // Find which week this donation belongs to
      for (const weekData of weeksData) {
        if (donationDate >= weekData.weekStart && donationDate <= weekData.weekEnd) {
          if (status === "validated") {
            weekData.verified++;
          } else if (status === "pending") {
            weekData.pending++;
          } else if (status === "rejected") {
            weekData.rejected++;
          }
          break;
        }
      }
    });
    
    return weeksData;
  };
  
  // Process data for daily view
  const processDailyData = (donations) => {
    const dailyData = {};
    const currentDate = new Date();
    
    // Initialize data for the last 14 days
    for (let i = 13; i >= 0; i--) {
      const date = new Date(currentDate);
      date.setDate(currentDate.getDate() - i);
      const key = date.toISOString().substring(0, 10);
      
      dailyData[key] = { 
        label: `${date.getMonth() + 1}/${date.getDate()}`, 
        verified: 0, 
        pending: 0, 
        rejected: 0,
        date: new Date(date)
      };
    }
    
    // Populate data
    donations.forEach(({ date, validationStatus }) => {
      if (!date) return;
      
      const donationDate = new Date(date);
      const key = donationDate.toISOString().substring(0, 10);
      const status = validationStatus || "pending";
      
      if (dailyData[key]) {
        if (status === "validated") {
          dailyData[key].verified++;
        } else if (status === "pending") {
          dailyData[key].pending++;
        } else if (status === "rejected") {
          dailyData[key].rejected++;
        }
      }
    });
    
    return Object.values(dailyData).sort((a, b) => a.date - b.date);
  };
  
  return (
    <div className="bg-white rounded-xl shadow-sm p-4 h-full">
      <div className="flex justify-between mb-4 items-center flex-wrap gap-2">
        <h3 className="font-semibold text-base">Donation Tracking</h3>
        <div className="inline-flex rounded-md shadow-sm">
          <button 
            className={`px-3 py-1 text-xs font-medium rounded-l-md border border-r-0 ${
              timeFrame === 'daily' 
                ? 'bg-primary text-white border-primary' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200 border-gray-200'
            }`}
            onClick={() => setTimeFrame('daily')}
          >
            Daily
          </button>
          <button 
            className={`px-3 py-1 text-xs font-medium border border-r-0 ${
              timeFrame === 'weekly' 
                ? 'bg-primary text-white border-primary' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200 border-gray-200'
            }`}
            onClick={() => setTimeFrame('weekly')}
          >
            Weekly
          </button>
          <button 
            className={`px-3 py-1 text-xs font-medium border border-r-0 ${
              timeFrame === 'monthly' 
                ? 'bg-primary text-white border-primary' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200 border-gray-200'
            }`}
            onClick={() => setTimeFrame('monthly')}
          >
            Monthly
          </button>
          <button 
            className={`px-3 py-1 text-xs font-medium rounded-r-md border ${
              timeFrame === 'yearly' 
                ? 'bg-primary text-white border-primary' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200 border-gray-200'
            }`}
            onClick={() => setTimeFrame('yearly')}
          >
            Yearly
          </button>
        </div>
      </div>
      
      <div className="flex gap-4 mb-3 text-xs flex-wrap">
        <div className="flex items-center gap-1">
          <MdCheckCircle className="text-primary text-lg" />
          Verified
        </div>
        <div className="flex items-center gap-1">
          <MdHourglassEmpty className="text-secondary text-lg" />
          Pending
        </div>
        <div className="flex items-center gap-1">
          <MdCancel className="text-red-500 text-lg" />
          Rejected
        </div>
      </div>
      
      <div className="h-40">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
            <XAxis 
              dataKey="label" 
              tick={{ fontSize: 10 }} 
              tickLine={false} 
              padding={{ left: 10, right: 10 }}
            />
            <YAxis 
              tick={{ fontSize: 10 }} 
              tickLine={false} 
              axisLine={false} 
              allowDecimals={false}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: '#fff',
                borderRadius: 6,
                boxShadow: '0 1px 5px rgba(0,0,0,0.1)',
                border: 'none',
                fontSize: 12,
              }}
              labelStyle={{ fontWeight: 'bold', marginBottom: 3, fontSize: 12 }}
            />
            <Line
              type="monotone"
              dataKey="verified"
              name="Verified"
              stroke="#00254C"
              strokeWidth={1.5}
              dot={{ r: 3, strokeWidth: 0, fill: '#00254C' }}
              activeDot={{ r: 4 }}
            />
            <Line
              type="monotone"
              dataKey="pending"
              name="Pending"
              stroke="#EEB211"
              strokeWidth={1.5}
              dot={{ r: 3, strokeWidth: 0, fill: '#EEB211' }}
              activeDot={{ r: 4 }}
            />
            <Line
              type="monotone"
              dataKey="rejected"
              name="Rejected"
              stroke="#E53E3E"
              strokeWidth={1.5}
              dot={{ r: 3, strokeWidth: 0, fill: '#E53E3E' }}
              activeDot={{ r: 4 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default StatusChart;