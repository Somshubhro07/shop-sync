// src/components/ProtectedRoute.jsx
import React from 'react';
import { Navigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('token');

  let isAuthenticated = false;
  if (token) {
    try {
      const decoded = jwtDecode(token);
      const currentTime = Date.now() / 1000;
      console.log('ProtectedRoute - Decoded token:', decoded); // Debug log
      console.log('ProtectedRoute - Expiration:', decoded.exp, 'Current time:', currentTime); // Debug log
      if (decoded.exp > currentTime) {
        isAuthenticated = true;
      } else {
        console.log('ProtectedRoute - Token expired, removing it');
        localStorage.removeItem('token');
      }
    } catch (error) {
      console.error('ProtectedRoute - Error decoding token:', error);
      localStorage.removeItem('token');
    }
  } else {
    console.log('ProtectedRoute - No token found');
  }

  return isAuthenticated ? children : <Navigate to="/" replace />;
};

export default ProtectedRoute;