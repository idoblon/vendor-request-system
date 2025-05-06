import React from 'react';
import { useNavigate } from 'react-router-dom';

const Logout: React.FC = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Clear any stored authentication data
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    
    // Redirect to login page
    navigate('/login');
  };

  return (
    <div className="p-6">
      <div className="bg-gray-800 rounded-lg shadow-md p-6 max-w-md mx-auto">
        <h2 className="text-2xl font-bold mb-4">Logout</h2>
        <p className="text-gray-300 mb-6">Are you sure you want to logout?</p>
        <div className="flex justify-end gap-4">
          <button
            onClick={() => navigate(-1)}
            className="bg-gray-700 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleLogout}
            className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default Logout; 