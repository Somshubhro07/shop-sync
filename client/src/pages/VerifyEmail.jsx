// src/pages/VerifyEmail.jsx
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const VerifyEmail = () => {
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/auth/verify', { email, code });
      navigate('/login');
    } catch (err) {
      setError(err.response?.data?.message || 'An error occurred');
    }
  };

  return (
    <div className="h-screen flex items-center justify-center bg-light-cream p-6">
      <div className="bg-white p-8 rounded-xl shadow-lg border-2 border-gold-accent w-full max-w-md">
        <h2 className="text-3xl font-bold text-dark-brown mb-6">Verify Your Email</h2>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-600">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="p-2 border rounded-lg w-full"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-600">Verification Code</label>
            <input
              type="text"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="p-2 border rounded-lg w-full"
              required
            />
          </div>
          <button type="submit" className="bg-gradient-to-r from-gold-accent to-saffron text-white p-3 rounded-lg w-full">
            Verify
          </button>
        </form>
      </div>
    </div>
  );
};

export default VerifyEmail;