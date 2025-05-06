import React, { useState } from 'react';

interface Order {
  id: number;
  customerName: string;
  orderDate: string;
  totalAmount: number;
  status: 'pending' | 'processing' | 'completed' | 'cancelled';
  items: {
    name: string;
    quantity: number;
    price: number;
  }[];
}

const Orders: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([
    // Sample data - replace with actual data from API
    {
      id: 1,
      customerName: 'John Doe',
      orderDate: '2024-03-15',
      totalAmount: 299.99,
      status: 'pending',
      items: [
        { name: 'Product 1', quantity: 2, price: 99.99 },
        { name: 'Product 2', quantity: 1, price: 100.01 },
      ],
    },
    {
      id: 2,
      customerName: 'Jane Smith',
      orderDate: '2024-03-14',
      totalAmount: 149.99,
      status: 'completed',
      items: [
        { name: 'Product 3', quantity: 1, price: 149.99 },
      ],
    },
  ]);

  const [selectedStatus, setSelectedStatus] = useState('all');

  const filteredOrders = orders.filter(order => 
    selectedStatus === 'all' || order.status === selectedStatus
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'processing':
        return 'bg-blue-100 text-blue-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Orders</h1>
        <div className="flex gap-4">
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="bg-gray-800 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="processing">Processing</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      <div className="bg-gray-800 rounded-lg shadow-md overflow-hidden">
        <table className="min-w-full divide-y divide-gray-700">
          <thead className="bg-gray-700">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Order ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Customer</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Date</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Items</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Total</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-700">
            {filteredOrders.map((order) => (
              <tr key={order.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-white">#{order.id}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-300">{order.customerName}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-300">{order.orderDate}</div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm text-gray-300">
                    {order.items.map((item, index) => (
                      <div key={index}>
                        {item.quantity}x {item.name}
                      </div>
                    ))}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-300">${order.totalAmount.toFixed(2)}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(order.status)}`}>
                    {order.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button className="text-blue-500 hover:text-blue-700 mr-3">View</button>
                  <button className="text-green-500 hover:text-green-700">Update Status</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Orders; 