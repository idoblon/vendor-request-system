import React from 'react';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon }) => {
  return (
    <div className="bg-gray-800 p-6 rounded-lg shadow-md">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-gray-400 text-sm font-medium mb-2">{title}</h3>
          <p className="text-white text-2xl font-bold">{value}</p>
        </div>
        <div className="text-3xl">
          {icon}
        </div>
      </div>
    </div>
  );
};

const Dashboard: React.FC = () => {
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <div className="relative">
          <input 
            type="text" 
            placeholder="Search..." 
            className="bg-gray-800 text-gray-300 rounded-lg px-4 py-2 pl-10 focus:outline-none"
          />
          <div className="absolute left-3 top-2.5">
            <svg className="h-5 w-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
            </svg>
          </div>
        </div>
      </div>
      
      {/* Stats cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard 
          title="Total Sales" 
          value="$0" 
          icon={
            <svg className="h-8 w-8 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
              <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" />
            </svg>
          } 
        />
        <StatCard 
          title="Products" 
          value="0" 
          icon={
            <svg className="h-8 w-8 text-teal-500" fill="currentColor" viewBox="0 0 20 20">
              <path d="M4 3a2 2 0 100 4h12a2 2 0 100-4H4z" />
              <path fillRule="evenodd" d="M3 8h14v7a2 2 0 01-2 2H5a2 2 0 01-2-2V8zm5 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z" clipRule="evenodd" />
            </svg>
          } 
        />
        <StatCard 
          title="Orders" 
          value="0" 
          icon={
            <svg className="h-8 w-8 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 2a4 4 0 00-4 4v1H5a1 1 0 00-.994.89l-1 9A1 1 0 004 18h12a1 1 0 00.994-1.11l-1-9A1 1 0 0015 7h-1V6a4 4 0 00-4-4zm2 5V6a2 2 0 10-4 0v1h4z" clipRule="evenodd" />
            </svg>
          } 
        />
        <StatCard 
          title="Pending Orders" 
          value="0" 
          icon={
            <svg className="h-8 w-8 text-pink-500" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
            </svg>
          } 
        />
      </div>
      
      {/* Sales Analytics */}
      <div className="bg-gray-800 rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Sales Analytics</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-700">
            <thead>
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Month</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Orders</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Revenue</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700">
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">No data available</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">-</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">-</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard; 