import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';

// Layout
import MainLayout from './layouts/MainLayout';

// Pages
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import BookingManagement from './pages/BookingManagement';
import ServiceManagement from './pages/ServiceManagement';
import CategoryManagement from './pages/CategoryManagement';
import UserManagement from './pages/UserManagement';
import OfferManagement from './pages/OfferManagement';

// Private Route Wrapper
const AdminPrivateRoute = ({ children }) => {
  const token = localStorage.getItem('vmarc_admin_token');
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public login */}
        <Route path="/login" element={<Login />} />

        {/* Protected Dashboard Routes nested inside MainLayout */}
        <Route 
          path="/*" 
          element={
            <AdminPrivateRoute>
              <MainLayout />
            </AdminPrivateRoute>
          }
        >
          <Route index element={<Dashboard />} />
          <Route path="bookings" element={<BookingManagement />} />
          <Route path="services" element={<ServiceManagement />} />
          <Route path="categories" element={<CategoryManagement />} />
          <Route path="users" element={<UserManagement />} />
          <Route path="offers" element={<OfferManagement />} />
        </Route>
      </Routes>
      <ToastContainer position="bottom-right" autoClose={3000} />
    </BrowserRouter>
  );
}

export default App;
