import React, { useState } from 'react';
import './App.css';
import Dashboard from './components/Dashboard';
import Login from './components/Login';
import Register from './components/Register';

function App() {
  const [view, setView] = useState<'login' | 'register' | 'dashboard'>('login');

  // Functions to handle navigation between screens
  const goToLogin = () => setView('login');
  const goToRegister = () => setView('register');
  const goToDashboard = () => setView('dashboard');

  // Render the appropriate component based on the current view
  const renderView = () => {
    switch (view) {
      case 'login':
        return <Login onSwitchToRegister={goToRegister} />;
      case 'register':
        return <Register onSwitchToLogin={goToLogin} />;
      case 'dashboard':
        return <Dashboard />;
      default:
        return <Login onSwitchToRegister={goToRegister} />;
    }
  };

  return (
    <div className="w-full h-screen">
      {renderView()}
      
      {/* Development-only button to view dashboard */}
      <button 
        onClick={() => setView(view === 'dashboard' ? 'login' : 'dashboard')} 
        className="fixed bottom-4 right-4 bg-blue-500 text-white px-4 py-2 rounded-md shadow-md"
      >
        {view === 'dashboard' ? 'Show Auth Forms' : 'Show Dashboard'}
      </button>
    </div>
  );
}

export default App;
