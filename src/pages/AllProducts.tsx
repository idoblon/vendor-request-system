import React, { useState } from 'react';

interface Product {
  id: number;
  name: string;
  price: number;
  category: string;
  stock: number;
  status: 'active' | 'inactive';
}

const AllProducts: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([
    // Sample data - replace with actual data from API
    { id: 1, name: 'Product 1', price: 99.99, category: 'Electronics', stock: 50, status: 'active' },
    { id: 2, name: 'Product 2', price: 49.99, category: 'Clothing', stock: 100, status: 'active' },
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">All Products</h1>
        <div className="flex gap-4">
          <input
            type="text"
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="bg-gray-800 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="bg-gray-800 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Categories</option>
            <option value="Electronics">Electronics</option>
            <option value="Clothing">Clothing</option>
            <option value="Food">Food</option>
          </select>
        </div>
      </div>

      <div className="bg-gray-800 rounded-lg shadow-md overflow-hidden">
        <table className="min-w-full divide-y divide-gray-700">
          <thead className="bg-gray-700">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Product</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Category</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Price</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Stock</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-700">
            {filteredProducts.map((product) => (
              <tr key={product.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-white">{product.name}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-300">{product.category}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-300">${product.price.toFixed(2)}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-300">{product.stock}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    product.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {product.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button className="text-blue-500 hover:text-blue-700 mr-3">Edit</button>
                  <button className="text-red-500 hover:text-red-700">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AllProducts; 