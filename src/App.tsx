import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import AddProduct from './pages/AddProduct';
import AllProducts from './pages/AllProducts';
import DiscountProducts from './pages/DiscountProducts';
import Orders from './pages/Orders';
import Payments from './pages/Payments';
import Profile from './pages/Profile';

const App: React.FC = () => {
  // For now, we'll use a simple isAuthenticated check
  // In a real app, this would come from your auth context/state
  const isAuthenticated = true;

  return (
    <Router>
      <Routes>
        {/* Public routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Protected routes with layout */}
        <Route
          path="/"
          element={
            isAuthenticated ? (
              <Layout>
                <Dashboard />
              </Layout>
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
        <Route
          path="/add-product"
          element={
            isAuthenticated ? (
              <Layout>
                <AddProduct />
              </Layout>
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
        <Route
          path="/all-products"
          element={
            isAuthenticated ? (
              <Layout>
                <AllProducts />
              </Layout>
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
        <Route
          path="/discount-products"
          element={
            isAuthenticated ? (
              <Layout>
                <DiscountProducts />
              </Layout>
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
        <Route
          path="/orders"
          element={
            isAuthenticated ? (
              <Layout>
                <Orders />
              </Layout>
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
        <Route
          path="/payments"
          element={
            isAuthenticated ? (
              <Layout>
                <Payments />
              </Layout>
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
        <Route
          path="/profile"
          element={
            isAuthenticated ? (
              <Layout>
                <Profile />
              </Layout>
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />

        {/* Redirect to login for any other route */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
};

export default App;
