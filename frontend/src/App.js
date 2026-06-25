import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';

// Context Providers
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';

// Components
import NavigationBar from './components/Navbar';
import PrivateRoute from './components/PrivateRoute';

// Pages
import Home from './pages/Home';
import Services from './pages/Services';
import ServiceDetail from './pages/ServiceDetail';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import Bookings from './pages/Bookings';
import Profile from './pages/Profile';
import Login from './pages/Login';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <CartProvider>
          <div className="d-flex flex-column min-vh-100 bg-light">
            <NavigationBar />
            <main className="flex-grow-1 py-4">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/services" element={<Services />} />
                <Route path="/services/:id" element={<ServiceDetail />} />
                <Route path="/cart" element={<Cart />} />
                <Route path="/login" element={<Login />} />

                {/* Protected Routes */}
                <Route path="/checkout" element={<PrivateRoute><Checkout /></PrivateRoute>} />
                <Route path="/bookings" element={<PrivateRoute><Bookings /></PrivateRoute>} />
                <Route path="/profile" element={<PrivateRoute><Profile /></PrivateRoute>} />
              </Routes>
            </main>
            <footer className="bg-dark text-light py-4 mt-auto text-center">
              <div className="container">
                <p className="mb-1">&copy; 2026 1App Service Booking Platform. All Rights Reserved.</p>
                <small className="text-muted">Premium electrical wires, cables, and installation support.</small>
              </div>
            </footer>
            <ToastContainer position="bottom-right" autoClose={3000} />
          </div>
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
