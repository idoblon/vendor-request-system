import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
// Remove bootstrap import
import "./App.css";

// Components
import Navbar from "./components/layout/Navbar";
import Home from "./components/Home";
import Login from "./components/auth/Login";
import Register from "./components/auth/Register";
import VendorForm from "./components/vendor/VendorForm";
import AdminDashboard from "./components/admin/AdminDashboard";
import VendorDashboard from "./components/vendor/VendorDashboard";
import PrivateRoute from "./components/routing/PrivateRoute";

// Context
import { AuthProvider } from "./context/AuthContext";

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Navbar />
          <div className="container mt-4">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route
                path="/vendor/form"
                element={
                  <PrivateRoute>
                    <VendorForm />
                  </PrivateRoute>
                }
              />
              <Route
                path="/vendor/dashboard"
                element={
                  <PrivateRoute>
                    <VendorDashboard />
                  </PrivateRoute>
                }
              />
              <Route
                path="/admin/dashboard"
                element={
                  <PrivateRoute adminOnly={true}>
                    <AdminDashboard />
                  </PrivateRoute>
                }
              />
            </Routes>
          </div>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
