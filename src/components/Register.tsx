import React, { useState } from 'react';

interface RegisterProps {
  onSwitchToLogin: () => void;
}

const Register: React.FC<RegisterProps> = ({ onSwitchToLogin }) => {
  const [fullName, setFullName] = useState('');
  const [vendorName, setVendorName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [agreeTerms, setAgreeTerms] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle registration logic here
    console.log({ fullName, vendorName, email, phone, password, confirmPassword, agreeTerms });
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-blue-50">
      <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-md">
        <div className="flex flex-col items-center mb-8">
          <img src="/vrslogo.png" alt="VRS Logo" className="w-28 h-28 mb-4" />
        </div>

        <h2 className="text-2xl font-bold text-center mb-2">Vendor Registration</h2>
        <p className="text-gray-600 text-center mb-6">Create a new vendor account</p>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <div className="flex items-center border rounded-lg bg-gray-50 px-3 py-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              <input
                type="text"
                placeholder="Full Name"
                className="w-full bg-gray-50 outline-none"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="mb-4">
            <div className="flex items-center border rounded-lg bg-gray-50 px-3 py-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
              <input
                type="text"
                placeholder="Vendor/Business Name"
                className="w-full bg-gray-50 outline-none"
                value={vendorName}
                onChange={(e) => setVendorName(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="mb-4">
            <div className="flex items-center border rounded-lg bg-gray-50 px-3 py-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              <input
                type="email"
                placeholder="Email Address"
                className="w-full bg-gray-50 outline-none"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="mb-4">
            <div className="flex items-center border rounded-lg bg-gray-50 px-3 py-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              <input
                type="tel"
                placeholder="Phone Number"
                className="w-full bg-gray-50 outline-none"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="mb-4">
            <div className="flex items-center border rounded-lg bg-gray-50 px-3 py-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              <input
                type="password"
                placeholder="Password"
                className="w-full bg-gray-50 outline-none"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="mb-4">
            <div className="flex items-center border rounded-lg bg-gray-50 px-3 py-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              <input
                type="password"
                placeholder="Confirm Password"
                className="w-full bg-gray-50 outline-none"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="flex items-start mb-6">
            <div className="flex items-center h-5">
              <input
                id="terms"
                type="checkbox"
                className="h-4 w-4 text-blue-600 rounded"
                checked={agreeTerms}
                onChange={(e) => setAgreeTerms(e.target.checked)}
                required
              />
            </div>
            <label htmlFor="terms" className="ml-2 text-sm text-gray-700">
              I agree to the <a href="#" className="text-orange-500 hover:underline">Terms and Conditions</a> and <a href="#" className="text-orange-500 hover:underline">Privacy Policy</a>
            </label>
          </div>

          <button
            type="submit"
            className="w-full bg-orange-500 text-white py-3 rounded-lg hover:bg-orange-600 transition-colors font-medium"
          >
            Register as Vendor
          </button>
        </form>

        <p className="mt-8 text-center text-gray-600">
          Already have an account? <a href="#" onClick={(e) => { e.preventDefault(); onSwitchToLogin(); }} className="text-orange-500 hover:underline">Login here</a>
        </p>
      </div>
    </div>
  );
};

export default Register; 