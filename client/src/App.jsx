// src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import BillingForm from './components/BillingForm';
import Login from './pages/Login';
import Signup from './pages/Signup';
import VerifyEmail from './pages/VerifyEmail';
import Reporting from './pages/Reporting';
import Catalogue from './pages/Catalogue';
import Inventory from './pages/Inventory';
import Customers from './pages/Customers';
import Setup from './pages/Setup';
import Landing from './pages/Landing';
import ProtectedRoute from './components/ProtectedRoute';
import { jwtDecode } from 'jwt-decode';
import AddProduct from './pages/AddProduct';

const App = () => {
  const token = localStorage.getItem('token');
  let isAuthenticated = false;

  console.log('App.jsx - Token from localStorage:', token);

  if (token) {
    try {
      const decoded = jwtDecode(token);
      const currentTime = Date.now() / 1000;
      console.log('App.jsx - Decoded token:', decoded);
      console.log('App.jsx - Token expiration:', decoded.exp, 'Current time:', currentTime);
      if (decoded.exp > currentTime) {
        isAuthenticated = true;
        console.log('App.jsx - User is authenticated');
      } else {
        console.log('App.jsx - Token expired, removing it');
        localStorage.removeItem('token');
      }
    } catch (error) {
      console.error('App.jsx - Error decoding token:', error);
      localStorage.removeItem('token');
    }
  } else {
    console.log('App.jsx - No token found in localStorage');
  }

  console.log('App.jsx - isAuthenticated:', isAuthenticated);

  return (
    <Router>
      <div className="flex">
        {isAuthenticated && <Navbar />}
        <div className={isAuthenticated ? 'ml-64 flex-1' : 'flex-1'}>
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/verify-email" element={<VerifyEmail />} />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Home />
                </ProtectedRoute>
              }
            />
            <Route
              path="/sell"
              element={
                <ProtectedRoute>
                  <BillingForm />
                </ProtectedRoute>
              }
            />
            <Route
              path="/reporting"
              element={
                <ProtectedRoute>
                  <Reporting />
                </ProtectedRoute>
              }
            />
            <Route
              path="/catalogue"
              element={
                <ProtectedRoute>
                  <Catalogue />
                </ProtectedRoute>
              }
            />
            <Route
              path="/inventory"
              element={
                <ProtectedRoute>
                  <Inventory />
                </ProtectedRoute>
              }
            />
            <Route
              path="/customers"
              element={
                <ProtectedRoute>
                  <Customers />
                </ProtectedRoute>
              }
            />
            <Route
              path="/setup"
              element={
                <ProtectedRoute>
                  <Setup />
                </ProtectedRoute>
              }
            />
            <Route
              path="/add-product"
              element={
                <ProtectedRoute>
                  <AddProduct />
                </ProtectedRoute>
              }
            />
          </Routes>
        </div>
      </div>
    </Router>
  );
};

export default App;