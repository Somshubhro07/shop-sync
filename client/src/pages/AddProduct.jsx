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
    category: '',
    image: null,
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'image') {
      setFormData({ ...formData, [name]: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const autoAssignCategory = () => {
    const { name, description } = formData;
    const text = (name + ' ' + (description || '')).toLowerCase();
    const categories = {
      clothing: ['shirt', 'tshirt', 'dress', 'jeans', 'pant', 'saree'],
      electronics: ['phone', 'laptop', 'charger', 'headphone', 'tv'],
      groceries: ['rice', 'oil', 'milk', 'bread', 'vegetable'],
      accessories: ['watch', 'belt', 'bag', 'wallet', 'jewelry'],
    };

    for (const [cat, keywords] of Object.entries(categories)) {
      if (keywords.some(keyword => text.includes(keyword))) {
        setFormData({ ...formData, category: cat.charAt(0).toUpperCase() + cat.slice(1) });
        return;
      }
    }
    setFormData({ ...formData, category: 'Other' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
  
    if (!formData.name || !formData.price || !formData.stock || !formData.category) {
      setError('Name, price, stock, and category are required.');
      return;
    }
    if (isNaN(formData.price) || isNaN(formData.stock) || formData.price <= 0 || formData.stock < 0) {
      setError('Price and stock must be positive numbers.');
      return;
    }
  
    autoAssignCategory(); // Auto-assign category if empty
  
    const formDataToSend = new FormData();
    formDataToSend.append('name', formData.name);
    formDataToSend.append('description', formData.description);
    formDataToSend.append('price', parseFloat(formData.price));
    formDataToSend.append('stock', parseInt(formData.stock));
    formDataToSend.append('category', formData.category || 'Other'); // Ensure category is sent
    if (formData.image) {
      formDataToSend.append('image', formData.image);
    }
  
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post('http://localhost:5000/api/products', formDataToSend, {
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });
      console.log('Response:', response.data); // Log the response for debugging
      setSuccess('Product added successfully!');
      setTimeout(() => navigate('/inventory'), 2000);
    } catch (err) {
      console.error('Error adding product:', err.response?.data || err.message);
      setError(err.response?.data?.message || 'An error occurred. Please try again.');
    }
  };

  

  return (
    <div className="p-4 min-h-screen bg-light-cream flex flex-col md:flex-row">
      <div className="w-full md:w-3/4 mx-auto">
        <h2 className="text-3xl font-bold text-dark-brown mb-6">Add New Product</h2>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        {success && <p className="text-green-500 mb-4">{success}</p>}
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl shadow-lg border-2 border-gold-accent max-w-2xl mx-auto">
          <div className="grid grid-cols-1 gap-6">
            <div>
              <label className="block text-gray-600 font-medium mb-1">Product Name *</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                onBlur={autoAssignCategory} // Auto-assign category when name is filled
                className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-gold-accent"
                placeholder="e.g., T-Shirt"
                required
              />
            </div>
            <div>
              <label className="block text-gray-600 font-medium mb-1">Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                onBlur={autoAssignCategory} // Update category when description changes
                className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-gold-accent"
                placeholder="e.g., Cotton T-Shirt, Size M"
                rows="3"
              />
            </div>
            <div>
              <label className="block text-gray-600 font-medium mb-1">Price (₹) *</label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-gold-accent"
                placeholder="e.g., 999.00"
                step="0.01"
                required
              />
            </div>
            <div>
              <label className="block text-gray-600 font-medium mb-1">Stock Quantity *</label>
              <input
                type="number"
                name="stock"
                value={formData.stock}
                onChange={handleChange}
                className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-gold-accent"
                placeholder="e.g., 100"
                required
              />
            </div>
            <div>
              <label className="block text-gray-600 font-medium mb-1">Category (Auto-assigned, editable)</label>
              <input
                type="text"
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-gold-accent bg-gray-100"
                placeholder="e.g., Clothing (edit if needed)"
              />
            </div>
            <div>
              <label className="block text-gray-600 font-medium mb-1">Product Image</label>
              <input
                type="file"
                name="image"
                accept="image/*"
                onChange={handleChange}
                className="w-full p-3 border rounded-lg"
              />
              {formData.image && (
                <img
                  src={URL.createObjectURL(formData.image)}
                  alt="Preview"
                  className="mt-2 w-32 h-32 object-cover rounded-lg"
                />
              )}
            </div>
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-gold-accent to-saffron text-white p-3 rounded-lg hover:opacity-90 font-medium transition duration-300"
            >
              Add Product
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddProduct;