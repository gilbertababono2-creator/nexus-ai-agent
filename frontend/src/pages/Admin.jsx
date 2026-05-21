import React from 'react';
import { useAuth } from '../hooks/useAuth';

const Admin = () => {
  const { user } = useAuth();

  if (!user || user.role !== 'admin') {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold text-red-500">Access Denied</h1>
        <p>You must be an admin to view this page.</p>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold">Admin Panel</h1>
      <p>Admin controls will go here.</p>
    </div>
  );
};

export default Admin;
