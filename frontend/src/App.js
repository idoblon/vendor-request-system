import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import "./App.css";

// Components
import Login from "./components/auth/Login";
import VendorForm from "./components/vendor/VendorForm";
import AdminDashboard from "./components/admin/AdminDashboard";
import VendorDashboard from "./components/vendor/VendorDashboard";
import PrivateRoute from "./components/routing/PrivateRoute";
import VendorRegistrationForm from "./components/auth/VendorRegistrationForm";
import CenterRegistrationForm from "./components/auth/CenterRegistrationForm";

// Context
import { AuthProvider } from "./context/AuthContext";

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gray-50">
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/login" element={<Navigate to="/" replace />} />
            <Route path="/register/vendor" element={<VendorRegistrationForm />} />
            <Route path="/register/center" element={<CenterRegistrationForm />} />
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
      </Router>
    </AuthProvider>
  );
}

export default App;
