import React, { createContext, useState, useEffect } from "react";
import axios from "axios";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load user from token
  useEffect(() => {
    const loadUser = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        setLoading(false);
        return;
      }

      try {
        // Set default headers for all axios requests
        axios.defaults.headers.common["x-auth-token"] = token;

        // Get user data
        const res = await axios.get("/api/auth/user");

        setUser(res.data);
        setIsAuthenticated(true);
      } catch (err) {
        localStorage.removeItem("token");
        delete axios.defaults.headers.common["x-auth-token"];
        setError(err.response?.data?.message || "Authentication error");
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, []);

  // Register user
  const register = async (formData) => {
    try {
      const res = await axios.post("/api/auth/register", formData);

      localStorage.setItem("token", res.data.token);
      axios.defaults.headers.common["x-auth-token"] = res.data.token;

      setUser({ ...res.data, role: formData.role });
      setIsAuthenticated(true);
      setError(null);

      return true;
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
      return false;
    }
  };

  // Login user
  const login = async (formData) => {
    try {
      const res = await axios.post("/api/auth/login", formData);

      localStorage.setItem("token", res.data.token);
      axios.defaults.headers.common["x-auth-token"] = res.data.token;

      setUser(res.data);
      setIsAuthenticated(true);
      setError(null);

      return true;
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
      return false;
    }
  };

  // Logout user
  const logout = () => {
    localStorage.removeItem("token");
    delete axios.defaults.headers.common["x-auth-token"];

    setUser(null);
    setIsAuthenticated(false);
  };

  // Clear errors
  const clearError = () => setError(null);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        loading,
        error,
        register,
        login,
        logout,
        clearError,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
