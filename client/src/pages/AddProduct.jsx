// src/pages/AddProduct.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const AddProduct = () => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    stock: '',
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const token = localStorage.getItem('token');
      await axios.post(
        'http://localhost:5000/api/products',
        { ...formData, price: parseFloat(formData.price), stock: parseInt(formData.stock) },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      navigate('/inventory'); // Redirect to inventory page after adding
    } catch (err) {
      console.error('Error adding product:', err.response?.data || err.message);
      setError(err.response?.dataINAmessage || 'An error occurred. Please try again.');
    }
  };

  return (
    <div className="p-6 min-h-screen bg-light-cream">
      <h2 className="text-3xl font-bold text-dark-brown mb-6">Add Product</h2>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <form onSubmit={handleSubmit} className="bg-light-cream p-6 rounded-xl shadow-lg border-2 border-gold-accent">
        <div className="space-y-4">
          <div>
            <label className="block text-gray-600">Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full p-2 border rounded-lg"
              required
            />
          </div>
          <div>
            <label className="block text-gray-600">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="w-full p-2 border rounded-lg"
            />
          </div>
          <div>
            <label className="block text-gray-600">Price</label>
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleChange}
              className="w-full p-2 border rounded-lg"
              required
              step="0.01"
            />
          </div>
          <div>
            <label className="block text-gray-600">Stock</label>
            <input
              type="number"
              name="stock"
              value={formData.stock}
              onChange={handleChange}
              className="w-full p-2 border rounded-lg"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-gold-accent to-saffron text-white p-2 rounded-lg hover:opacity-90"
          >
            Add Product
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddProduct;