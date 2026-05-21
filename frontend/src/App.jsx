import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { useAuth } from './hooks/useAuth';

import Header from './components/common/Header';
import Sidebar from './components/common/Sidebar';

import Dashboard from './pages/Dashboard';
import Chat from './pages/Chat';
import Tasks from './pages/Tasks';
import Appointments from './pages/Appointments';
import Notes from './pages/Notes';
import Login from './pages/Login';
import Admin from './pages/Admin';

const PrivateRoute = ({ children }) => {
  const { user } = useAuth();
  return user ? children : <Navigate to="/login" />;
};

const Layout = ({ children }) => {
  return (
    <div className="flex min-h-screen bg-gray-900 text-white">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Header />
        <main className="flex-1 p-4">{children}</main>
      </div>
    </div>
  );
};

function AppRoutes() {
  const { user } = useAuth();

  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/" element={<Navigate to="/dashboard" />} />
      <Route path="/dashboard" element={
        <PrivateRoute>
          <Layout><Dashboard /></Layout>
        </PrivateRoute>
      } />
      <Route path="/chat" element={
        <PrivateRoute>
          <Layout><Chat /></Layout>
        </PrivateRoute>
      } />
      <Route path="/tasks" element={
        <PrivateRoute>
          <Layout><Tasks /></Layout>
        </PrivateRoute>
      } />
      <Route path="/appointments" element={
        <PrivateRoute>
          <Layout><Appointments /></Layout>
        </PrivateRoute>
      } />
      <Route path="/notes" element={
        <PrivateRoute>
          <Layout><Notes /></Layout>
        </PrivateRoute>
      } />
      <Route path="/admin" element={
        <PrivateRoute>
          <Layout><Admin /></Layout>
        </PrivateRoute>
      } />
    </Routes>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
