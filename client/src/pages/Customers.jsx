// src/pages/Customers.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Customers = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:5000/api/customers', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setCustomers(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching customers:', error);
        setLoading(false);
      }
    };
    fetchCustomers();
  }, []);

  const handleDeleteCustomer = async (id) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:5000/api/customers/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCustomers(customers.filter((customer) => customer._id !== id));
    } catch (error) {
      console.error('Error deleting customer:', error);
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-3xl font-bold text-dark-brown mb-6">Customers</h2>
      {loading ? (
        <p className="text-gray-600">Loading...</p>
      ) : customers.length === 0 ? (
        <p className="text-gray-600">No customers available.</p>
      ) : (
        <div className="bg-light-cream p-6 rounded-xl shadow-lg border-2 border-gold-accent">
          <h3 className="text-xl font-bold text-dark-brown mb-4">Customer List</h3>
          <div className="space-y-4">
            {customers.map((customer) => (
              <div
                key={customer._id}
                className="flex justify-between items-center p-3 bg-gray-100 rounded-lg"
              >
                <div>
                  <p className="text-dark-brown font-semibold">{customer.phone}</p>
                  <p className="text-gray-600 text-sm">
                    Loyalty Points: {customer.loyaltyPoints}
                  </p>
                </div>
                <button
                  onClick={() => handleDeleteCustomer(customer._id)}
                  className="bg-red-500 text-white p-2 rounded-lg hover:bg-red-600"
                >
                  Delete
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Customers;