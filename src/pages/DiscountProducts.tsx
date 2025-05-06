import React, { useState } from 'react';

interface DiscountProduct {
  id: number;
  name: string;
  originalPrice: number;
  discountedPrice: number;
  discountPercentage: number;
  category: string;
  image: string;
}

const DiscountProducts: React.FC = () => {
  const [products, setProducts] = useState<DiscountProduct[]>([
    // Sample data - replace with actual data from API
    {
      id: 1,
      name: 'Premium Headphones',
      originalPrice: 199.99,
      discountedPrice: 149.99,
      discountPercentage: 25,
      category: 'Electronics',
      image: 'https://via.placeholder.com/150',
    },
    {
      id: 2,
      name: 'Smart Watch',
      originalPrice: 299.99,
      discountedPrice: 199.99,
      discountPercentage: 33,
      category: 'Electronics',
      image: 'https://via.placeholder.com/150',
    },
  ]);

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Discount Products</h1>
        <div className="flex gap-4">
          <input
            type="text"
            placeholder="Search discount products..."
            className="bg-gray-800 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product) => (
          <div key={product.id} className="bg-gray-800 rounded-lg shadow-md overflow-hidden">
            <div className="relative">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-48 object-cover"
              />
              <div className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded-full text-sm font-bold">
                {product.discountPercentage}% OFF
              </div>
            </div>
            <div className="p-4">
              <h3 className="text-lg font-semibold text-white mb-2">{product.name}</h3>
              <p className="text-gray-400 text-sm mb-2">{product.category}</p>
              <div className="flex items-center gap-2">
                <span className="text-gray-400 line-through">${product.originalPrice.toFixed(2)}</span>
                <span className="text-green-500 font-bold">${product.discountedPrice.toFixed(2)}</span>
              </div>
              <div className="mt-4">
                <button className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition-colors">
                  View Details
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DiscountProducts; 