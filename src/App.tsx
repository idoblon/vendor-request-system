import React, { useState } from 'react';
import './App.css';
import Dashboard from './components/Dashboard';
import Login from './components/Login';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Add this temporary function for development/testing
  const toggleView = () => {
    setIsLoggedIn(!isLoggedIn);
  };

  return (
    <div className="w-full h-screen">
      {isLoggedIn ? <Dashboard /> : <Login />}
      
      {/* Temporary button to switch between login and dashboard */}
      <button 
        onClick={toggleView} 
        className="fixed bottom-4 right-4 bg-blue-500 text-white px-4 py-2 rounded-md shadow-md"
      >
        {isLoggedIn ? 'Show Login' : 'Show Dashboard'}
      </button>
    </div>
  );
}

export default App;
