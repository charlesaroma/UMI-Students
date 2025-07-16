import React from 'react';
import { format } from 'date-fns';
import DashboardTimeline from './DashboardTimeline';
import DashboardStatusReport from './DashboardStatusReport';
import DashboardDirectMessages from './DashboardDirectMessages';
import DashboardRecentResearchRequests from './DashboardRecentResearchRequests';
import { useGetLoggedInUser } from '../../store/tanstackStore/services/queries';

const Dashboard = () => {
  const { data: userData } = useGetLoggedInUser();

  // Use real last login if available, otherwise use current time
  const lastLogin = userData?.user?.lastLoginAt 
    ? format(new Date(userData.user.lastLoginAt), 'MM-dd-yyyy HH:mm:ss a')
    : format(new Date(), 'MM-dd-yyyy HH:mm:ss a');

  return (
    <div className="p-2 sm:p-4 md:p-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4 gap-2">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>
          {userData?.user?.name && (
            <p className="text-gray-600 mt-1">Welcome back, {userData.user.name}</p>
          )}
        </div>
        <span className="text-sm text-gray-400">Last login: {lastLogin}</span>
      </div>
      
      {/* Timeline */}
      <DashboardTimeline />
      
      {/* Two columns below timeline */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 mt-2">
        {/* Left column: Academic Progress + Direct Messages */}
        <div className="flex flex-col gap-4 h-full w-full">
          <div className="bg-white rounded-2xl shadow-md p-4 md:p-5 h-full min-h-[300px] w-full">
            <DashboardStatusReport />
          </div>
          <div className="bg-white rounded-2xl shadow-md p-4 md:p-5 h-full min-h-[220px] w-full">
            <DashboardDirectMessages />
          </div>
        </div>
        {/* Right column: Recent Research Requests */}
        <div className="bg-white rounded-2xl shadow-md p-4 md:p-5 h-full min-h-[500px] flex flex-col w-full">
          <DashboardRecentResearchRequests />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
