import React, { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    role: "",
  });

  const [errors, setErrors] = useState({
    email: "",
    password: "",
    role: "",
  });

  const { email, password, role } = formData;
  const { login, isAuthenticated, error, user, clearError } =
    useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      if (user?.role === "admin") {
        navigate("/admin/dashboard");
      } else if (user?.role === "vendor") {
        navigate("/vendor/dashboard");
      } else if (user?.role === "center") {
        navigate("/center/dashboard");
      }
    }
  }, [isAuthenticated, navigate, user]);

  const validateEmail = (email) => {
    const re = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return re.test(String(email).toLowerCase());
  };

  const validatePassword = (password) => {
    return password.length >= 6;
  };

  const onChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    // Clear errors when user types
    if (name === "email" || name === "password" || name === "role") {
      setErrors({ ...errors, [name]: "" });
    }
  };

  const validateForm = () => {
    let valid = true;
    const newErrors = { email: "", password: "", role: "" };

    if (!validateEmail(email)) {
      newErrors.email = "Please enter a valid email address";
      valid = false;
    }

    if (!validatePassword(password)) {
      newErrors.password = "Password must be at least 6 characters";
      valid = false;
    }

    if (!role) {
      newErrors.role = "Please select a role";
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    clearError();

    if (validateForm()) {
      await login(formData);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gradient-to-r from-blue-50 to-indigo-50 overflow-hidden">
      <div className="w-full max-w-md px-4">
        <div className="bg-white rounded-xl shadow-2xl overflow-hidden transform transition-all hover:scale-[1.01] duration-300">
          <div className="px-8 pt-6 pb-8">
            {/* Logo - Smaller size */}
            <div className="flex justify-center mb-4">
              <img
                src="/assets/images/vrslogo.png"
                alt="VRS Logo"
                className="w-28 h-auto drop-shadow-md transition-transform duration-300 hover:scale-105"
              />
            </div>

            <h2 className="text-xl font-bold text-center text-indigo-600 mb-6">
              Sign in to your account
            </h2>

            {error && (
              <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-4 text-sm">
                {error}
              </div>
            )}

            <form onSubmit={onSubmit}>
              <div className="mb-4">
                <label
                  className="block text-gray-700 text-sm font-medium mb-2"
                  htmlFor="email"
                >
                  Email Address
                </label>
                <input
                  className={`w-full px-3 py-2 text-gray-700 border ${errors.email ? "border-red-500" : "border-gray-300"} rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500`}
                  id="email"
                  type="email"
                  name="email"
                  value={email}
                  onChange={onChange}
                  placeholder="Enter your email"
                  required
                />
                {errors.email && (
                  <p className="text-red-500 text-xs mt-1">{errors.email}</p>
                )}
              </div>

              <div className="mb-4">
                <label
                  className="block text-gray-700 text-sm font-medium mb-2"
                  htmlFor="password"
                >
                  Password
                </label>
                <input
                  className={`w-full px-3 py-2 text-gray-700 border ${errors.password ? "border-red-500" : "border-gray-300"} rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500`}
                  id="password"
                  type="password"
                  name="password"
                  value={password}
                  onChange={onChange}
                  placeholder="Enter your password"
                  required
                />
                {errors.password && (
                  <p className="text-red-500 text-xs mt-1">{errors.password}</p>
                )}
              </div>

              <div className="mb-6">
                <label
                  className="block text-gray-700 text-sm font-medium mb-2"
                  htmlFor="role"
                >
                  User Role
                </label>
                <select
                  className={`w-full px-3 py-2 text-gray-700 border ${errors.role ? "border-red-500" : "border-gray-300"} rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500`}
                  id="role"
                  name="role"
                  value={role}
                  onChange={onChange}
                  required
                >
                  <option value="">Select your role</option>
                  <option value="vendor">Vendor</option>
                  <option value="center">Center</option>
                </select>
                {errors.role && (
                  <p className="text-red-500 text-xs mt-1">{errors.role}</p>
                )}
              </div>

              <div className="mb-6">
                <button
                  type="submit"
                  className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-300"
                >
                  Sign In
                </button>
              </div>

              <div className="mt-6 text-center">
                <p className="text-gray-600 mb-2">
                  Don't have an account?
                </p>
                <div className="flex flex-col space-y-2">
                  <a 
                    href="/register/vendor" 
                    className="w-full py-2 border-2 border-indigo-500 text-indigo-600 rounded-lg font-medium hover:bg-indigo-50 transition duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 block text-center"
                  >
                    Register as Vendor
                  </a>
                  <a 
                    href="/register/center" 
                    className="w-full py-2 border-2 border-green-500 text-green-600 rounded-lg font-medium hover:bg-green-50 transition duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 block text-center"
                  >
                    Register as Center
                  </a>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
