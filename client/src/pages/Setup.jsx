// src/pages/Setup.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Setup = () => {
  const [profile, setProfile] = useState({
    name: '',
    phone: '',
    shopName: '',
    shopType: '',
    address: '',
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:5000/api/auth/profile', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setProfile(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching profile:', error);
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleInputChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const response = await axios.put('http://localhost:5000/api/auth/profile', profile, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProfile(response.data);
      alert('Profile updated successfully!');
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-3xl font-bold text-dark-brown mb-6">Setup</h2>
      {loading ? (
        <p className="text-gray-600">Loading...</p>
      ) : (
        <div className="bg-light-cream p-6 rounded-xl shadow-lg border-2 border-gold-accent">
          <h3 className="text-xl font-bold text-dark-brown mb-4">Shop Details</h3>
          <form onSubmit={handleUpdateProfile}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-600">Name</label>
                <input
                  type="text"
                  name="name"
                  value={profile.name}
                  onChange={handleInputChange}
                  className="p-2 border rounded-lg w-full"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-600">Phone</label>
                <input
                  type="text"
                  name="phone"
                  value={profile.phone}
                  onChange={handleInputChange}
                  className="p-2 border rounded-lg w-full"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-600">Shop Name</label>
                <input
                  type="text"
                  name="shopName"
                  value={profile.shopName}
                  onChange={handleInputChange}
                  className="p-2 border rounded-lg w-full"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-600">Shop Type</label>
                <input
                  type="text"
                  name="shopType"
                  value={profile.shopType}
                  onChange={handleInputChange}
                  className="p-2 border rounded-lg w-full"
                  required
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-gray-600">Address</label>
                <textarea
                  name="address"
                  value={profile.address}
                  onChange={handleInputChange}
                  className="p-2 border rounded-lg w-full"
                  required
                />
              </div>
            </div>
            <button
              type="submit"
              className="mt-4 bg-gradient-to-r from-gold-accent to-saffron text-white p-2 rounded-lg hover:opacity-90"
            >
              Update Profile
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default Setup;