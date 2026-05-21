import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

const Header = () => {
  const { user, logout } = useAuth();

  return (
    <header className="bg-gray-800 p-4 flex justify-between items-center">
      <Link to="/" className="text-xl font-bold">Nexus AI</Link>
      <nav className="flex gap-4">
        <Link to="/dashboard" className="hover:text-blue-400">Dashboard</Link>
        <Link to="/chat" className="hover:text-blue-400">Chat</Link>
        <Link to="/tasks" className="hover:text-blue-400">Tasks</Link>
        <Link to="/appointments" className="hover:text-blue-400">Appointments</Link>
      </nav>
      <div>
        {user ? (
          <button onClick={logout} className="bg-red-600 px-3 py-1 rounded">Logout</button>
        ) : (
          <Link to="/login" className="bg-blue-600 px-3 py-1 rounded">Login</Link>
        )}
      </div>
    </header>
  );
};

export default Header;
