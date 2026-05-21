import React from 'react';
import { Link } from 'react-router-dom';

const Sidebar = () => {
  return (
    <aside className="w-64 bg-gray-800 p-4 min-h-screen">
      <ul className="space-y-2">
        <li><Link to="/dashboard" className="block p-2 hover:bg-gray-700 rounded">Dashboard</Link></li>
        <li><Link to="/chat" className="block p-2 hover:bg-gray-700 rounded">Chat</Link></li>
        <li><Link to="/tasks" className="block p-2 hover:bg-gray-700 rounded">Tasks</Link></li>
        <li><Link to="/appointments" className="block p-2 hover:bg-gray-700 rounded">Appointments</Link></li>
        <li><Link to="/notes" className="block p-2 hover:bg-gray-700 rounded">Notes</Link></li>
        <li><Link to="/admin" className="block p-2 hover:bg-gray-700 rounded">Admin</Link></li>
      </ul>
    </aside>
  );
};

export default Sidebar;
