import React, { useState, useEffect } from 'react';
import DashboardCards from './DashboardCards';
import Calendar from './Calendar';
import StatusChart from './StatusChart';
import RecentDonorsTable from './RecentDonorsTable';
import { getAllEvents } from '../../api/eventService';
import { getAllDonations } from '../../api/donationService';
import { getAllUsers } from '../../api/userService';
import TopDonorsList from './TopDonorsList';


const AdminDashboardComponent = () => {
const [events, setEvents] = useState([]);
const [donations, setDonations] = useState([]);
const [users, setUsers] = useState([]);  // <-- store users here
const [loading, setLoading] = useState(true);
const [error, setError] = useState(null);

useEffect(() => {
const fetchData = async () => {
try {
const [eventsData, donationsData, usersData] = await Promise.all([
getAllEvents(),
getAllDonations(),
getAllUsers()   // <-- fetch users here
]);
setEvents(eventsData);
setDonations(donationsData);
setUsers(usersData);
setLoading(false);
} catch (err) {
console.error('Error fetching dashboard data:', err);
setError('Failed to load dashboard data');
setLoading(false);
}
};

fetchData();
}, []);

if (loading) {
return <div className="text-primary">Loading dashboard data...</div>;
}

if (error) {
return <div className="text-red-500">{error}</div>;
}

return ( 
<div className="p-6 max-w-7xl mx-auto"> 
<div className="flex justify-between items-center mb-2">
  <h1 className="text-3xl font-bold text-primary">Hello, Admin!</h1>
</div>

<div className="mb-3">
  <DashboardCards events={events} donations={donations} users={users} />
</div>
<div className="grid grid-cols-1 lg:grid-cols-4 gap-4 mb-3">
  <Calendar events={events} className="col-span-1 h-24" />
  <StatusChart donations={donations} className="col-span-3" />
</div>


<div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
  <TopDonorsList donations={donations} users={users} />
  <RecentDonorsTable donations={donations} />
</div>
</div>

);
};

export default AdminDashboardComponent;