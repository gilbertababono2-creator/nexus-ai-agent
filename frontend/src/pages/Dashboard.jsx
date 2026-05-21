import React from 'react';
import { useAuth } from '../hooks/useAuth';

const Dashboard = () => {
  const { user } = useAuth();
  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold">Dashboard</h1>
      <p>Welcome, {user?.name || 'User'}!</p>
    </div>
  );
};

export default Dashboard;
