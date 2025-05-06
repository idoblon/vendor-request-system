import React from 'react';
import { Link, useLocation, Outlet } from 'react-router-dom';

interface LayoutProps {
  children?: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const location = useLocation();

  const isActive = (path: string) => {
    return location.pathname === path ? 'bg-gray-700' : 'text-gray-400 hover:bg-gray-700';
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="flex">
        {/* Sidebar */}
        <div className="w-64 bg-gray-800 min-h-screen p-4">
          <div className="flex items-center mb-8">
            <img src="/vrslogo.png" alt="VRS Logo" className="h-10 w-10 rounded-full" />
            <span className="text-xl font-bold ml-2">VRS</span>
          </div>
          
          <nav className="space-y-2">
            <Link
              to="/"
              className={`flex items-center px-4 py-2 rounded-lg ${isActive('/')}`}
            >
              <svg className="h-5 w-5 mr-3" fill="currentColor" viewBox="0 0 20 20">
                <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4z" />
                <path d="M3 10a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1v-2z" />
                <path d="M3 16a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1v-2z" />
              </svg>
              <span>Dashboard</span>
            </Link>
            
            <Link
              to="/add-product"
              className={`flex items-center px-4 py-2 rounded-lg ${isActive('/add-product')}`}
            >
              <svg className="h-5 w-5 mr-3" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
              </svg>
              <span>Add Product</span>
            </Link>
            
            <Link
              to="/all-products"
              className={`flex items-center px-4 py-2 rounded-lg ${isActive('/all-products')}`}
            >
              <svg className="h-5 w-5 mr-3" fill="currentColor" viewBox="0 0 20 20">
                <path d="M7 3a1 1 0 000 2h6a1 1 0 100-2H7zM4 7a1 1 0 011-1h10a1 1 0 110 2H5a1 1 0 01-1-1zM2 11a2 2 0 012-2h12a2 2 0 012 2v4a2 2 0 01-2 2H4a2 2 0 01-2-2v-4z" />
              </svg>
              <span>All Products</span>
            </Link>
            
            <Link
              to="/discount-products"
              className={`flex items-center px-4 py-2 rounded-lg ${isActive('/discount-products')}`}
            >
              <svg className="h-5 w-5 mr-3" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M17.707 9.293a1 1 0 010 1.414l-7 7a1 1 0 01-1.414 0l-7-7A.997.997 0 012 10V5a3 3 0 013-3h5c.256 0 .512.098.707.293l7 7zM5 6a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
              </svg>
              <span>Discount Products</span>
            </Link>
            
            <Link
              to="/orders"
              className={`flex items-center px-4 py-2 rounded-lg ${isActive('/orders')}`}
            >
              <svg className="h-5 w-5 mr-3" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 2a4 4 0 00-4 4v1H5a1 1 0 00-.994.89l-1 9A1 1 0 004 18h12a1 1 0 00.994-1.11l-1-9A1 1 0 0015 7h-1V6a4 4 0 00-4-4zm2 5V6a2 2 0 10-4 0v1h4z" clipRule="evenodd" />
              </svg>
              <span>Orders</span>
            </Link>
            
            <Link
              to="/payments"
              className={`flex items-center px-4 py-2 rounded-lg ${isActive('/payments')}`}
            >
              <svg className="h-5 w-5 mr-3" fill="currentColor" viewBox="0 0 20 20">
                <path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4z" />
                <path fillRule="evenodd" d="M18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z" clipRule="evenodd" />
              </svg>
              <span>Payments</span>
            </Link>
            
            <Link
              to="/profile"
              className={`flex items-center px-4 py-2 rounded-lg ${isActive('/profile')}`}
            >
              <svg className="h-5 w-5 mr-3" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
              </svg>
              <span>Profile</span>
            </Link>
            
            <Link
              to="/logout"
              className="flex items-center px-4 py-2 text-gray-400 hover:bg-gray-700 rounded-lg"
            >
              <svg className="h-5 w-5 mr-3" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M3 3a1 1 0 00-1 1v12a1 1 0 002 0V4a1 1 0 00-1-1zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L14.586 9H7a1 1 0 100 2h7.586l-1.293 1.293z" clipRule="evenodd" />
              </svg>
              <span>Logout</span>
            </Link>
          </nav>
        </div>
        
        {/* Main content */}
        <div className="flex-1 p-6">
          {children || <Outlet />}
        </div>
      </div>
    </div>
  );
};

export default Layout; 