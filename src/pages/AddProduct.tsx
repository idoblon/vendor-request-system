import React, { useState } from 'react';

interface FormData {
  name: string;
  description: string;
  price: string;
  category: string;
  image: File | null;
  discount: string;
}

const AddProduct: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    description: '',
    price: '',
    category: '',
    image: null,
    discount: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
    console.log(formData);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Add New Product</h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Product Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full bg-gray-800 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Price</label>
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleChange}
              className="w-full bg-gray-800 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-300 mb-2">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="w-full bg-gray-800 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={4}
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Category</label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full bg-gray-800 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="">Select Category</option>
              <option value="electronics">Electronics</option>
              <option value="clothing">Clothing</option>
              <option value="food">Food</option>
              <option value="other">Other</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Discount (%)</label>
            <input
              type="number"
              name="discount"
              value={formData.discount}
              onChange={handleChange}
              className="w-full bg-gray-800 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              min="0"
              max="100"
            />
          </div>
          
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-300 mb-2">Product Image</label>
            <input
              type="file"
              name="image"
              onChange={(e) => {
                if (e.target.files && e.target.files[0]) {
                  setFormData(prev => ({ ...prev, image: e.target.files![0] }));
                }
              }}
              className="w-full bg-gray-800 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              accept="image/*"
            />
          </div>
        </div>
        
        <div className="flex justify-end">
          <button
            type="submit"
            className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors"
          >
            Add Product
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddProduct; 