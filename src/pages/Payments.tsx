import React, { useState } from 'react';

interface Payment {
  id: number;
  orderId: number;
  customerName: string;
  amount: number;
  paymentMethod: string;
  status: 'completed' | 'pending' | 'failed' | 'refunded';
  date: string;
}

const Payments: React.FC = () => {
  const [payments, setPayments] = useState<Payment[]>([
    // Sample data - replace with actual data from API
    {
      id: 1,
      orderId: 1001,
      customerName: 'John Doe',
      amount: 299.99,
      paymentMethod: 'Credit Card',
      status: 'completed',
      date: '2024-03-15',
    },
    {
      id: 2,
      orderId: 1002,
      customerName: 'Jane Smith',
      amount: 149.99,
      paymentMethod: 'PayPal',
      status: 'pending',
      date: '2024-03-14',
    },
  ]);

  const [selectedStatus, setSelectedStatus] = useState('all');

  const filteredPayments = payments.filter(payment => 
    selectedStatus === 'all' || payment.status === selectedStatus
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      case 'refunded':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Payments</h1>
        <div className="flex gap-4">
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="bg-gray-800 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Status</option>
            <option value="completed">Completed</option>
            <option value="pending">Pending</option>
            <option value="failed">Failed</option>
            <option value="refunded">Refunded</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <div className="bg-gray-800 p-6 rounded-lg">
          <h3 className="text-gray-400 text-sm font-medium mb-2">Total Revenue</h3>
          <p className="text-white text-2xl font-bold">$449.98</p>
        </div>
        <div className="bg-gray-800 p-6 rounded-lg">
          <h3 className="text-gray-400 text-sm font-medium mb-2">Completed Payments</h3>
          <p className="text-white text-2xl font-bold">1</p>
        </div>
        <div className="bg-gray-800 p-6 rounded-lg">
          <h3 className="text-gray-400 text-sm font-medium mb-2">Pending Payments</h3>
          <p className="text-white text-2xl font-bold">1</p>
        </div>
        <div className="bg-gray-800 p-6 rounded-lg">
          <h3 className="text-gray-400 text-sm font-medium mb-2">Average Order Value</h3>
          <p className="text-white text-2xl font-bold">$224.99</p>
        </div>
      </div>

      <div className="bg-gray-800 rounded-lg shadow-md overflow-hidden">
        <table className="min-w-full divide-y divide-gray-700">
          <thead className="bg-gray-700">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Payment ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Order ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Customer</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Amount</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Method</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Date</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-700">
            {filteredPayments.map((payment) => (
              <tr key={payment.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-white">#{payment.id}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-300">#{payment.orderId}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-300">{payment.customerName}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-300">${payment.amount.toFixed(2)}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-300">{payment.paymentMethod}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(payment.status)}`}>
                    {payment.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-300">{payment.date}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button className="text-blue-500 hover:text-blue-700 mr-3">View</button>
                  {payment.status === 'pending' && (
                    <button className="text-green-500 hover:text-green-700">Process</button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Payments; 