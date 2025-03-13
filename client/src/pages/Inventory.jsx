// src/pages/Inventory.jsx
import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';

const Inventory = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editingProduct, setEditingProduct] = useState(null);
  const [formData, setFormData] = useState({ name: '', description: '', price: '', stock: '' });
  const printRef = useRef();

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5000/api/products', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProducts(response.data);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching products:', err.response?.data || err.message);
      setError('Failed to load products. Please try again.');
      setLoading(false);
    }
  };

  const handleEdit = (product) => {
    setEditingProduct(product._id);
    setFormData({
      name: product.name,
      description: product.description || '',
      price: product.price,
      stock: product.stock,
    });
  };

  const handleUpdate = async (id) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.put(
        `http://localhost:5000/api/products/${id}`,
        { ...formData, price: parseFloat(formData.price), stock: parseInt(formData.stock) },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setProducts(products.map((p) => (p._id === id ? response.data : p)));
      setEditingProduct(null);
    } catch (err) {
      console.error('Error updating product:', err.response?.data || err.message);
      setError('Failed to update product. Please try again.');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        const token = localStorage.getItem('token');
        await axios.delete(`http://localhost:5000/api/products/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setProducts(products.filter((p) => p._id !== id));
      } catch (err) {
        console.error('Error deleting product:', err.response?.data || err.message);
        setError('Failed to delete product. Please try again.');
      }
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePrintBarcode = (barcodeImage, barcodeCode) => {
    const printWindow = window.open('', '_blank', 'width=300,height=200');
    printWindow.document.write(`
      <html>
        <body style="text-align: center; margin: 0;">
          <h3>Product Barcode: ${barcodeCode}</h3>
          <img src="${barcodeImage}" style="width: 200px; height: 50px;" />
          <script>
            window.onload = function() { window.print(); window.close(); };
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  return (
    <div className="p-6 min-h-screen bg-light-cream">
      <h2 className="text-3xl font-bold text-dark-brown mb-6">Inventory Management</h2>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      {loading ? (
        <p className="text-gray-600">Loading...</p>
      ) : (
        <div className="space-y-4">
          {products.length === 0 ? (
            <p className="text-gray-600">No products found. Add a product to get started.</p>
          ) : (
            products.map((product) => (
              <div
                key={product._id}
                className="bg-white p-4 rounded-xl shadow-lg border-2 border-gold-accent flex items-center justify-between"
              >
                {editingProduct === product._id ? (
                  <div className="flex-1 space-y-2">
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full p-2 border rounded-lg"
                      placeholder="Product Name"
                    />
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleChange}
                      className="w-full p-2 border rounded-lg"
                      placeholder="Description"
                    />
                    <input
                      type="number"
                      name="price"
                      value={formData.price}
                      onChange={handleChange}
                      className="w-full p-2 border rounded-lg"
                      placeholder="Price"
                      step="0.01"
                    />
                    <input
                      type="number"
                      name="stock"
                      value={formData.stock}
                      onChange={handleChange}
                      className="w-full p-2 border rounded-lg"
                      placeholder="Stock"
                    />
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleUpdate(product._id)}
                        className="bg-gradient-to-r from-gold-accent to-saffron text-white p-2 rounded-lg hover:opacity-90"
                      >
                        Save
                      </button>
                      <button
                        onClick={() => setEditingProduct(null)}
                        className="bg-gray-500 text-white p-2 rounded-lg hover:opacity-90"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-dark-brown">{product.name}</h3>
                    <p className="text-gray-600">{product.description || 'No description'}</p>
                    <p className="text-gray-600">Price: ${product.price.toFixed(2)}</p>
                    <p className="text-gray-600">Stock: {product.stock}</p>
                    <p className="text-gray-600">Barcode: {product.barcode}</p>
                    <img
                      src={product.barcodeImage}
                      alt={`Barcode for ${product.name}`}
                      className="w-32 h-12 mt-2"
                    />
                  </div>
                )}
                <div className="flex space-x-2">
                  {editingProduct !== product._id && (
                    <>
                      <button
                        onClick={() => handleEdit(product)}
                        className="bg-dark-brown text-white p-2 rounded-lg hover:opacity-90"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(product._id)}
                        className="bg-red-500 text-white p-2 rounded-lg hover:opacity-90"
                      >
                        Delete
                      </button>
                      <button
                        onClick={() => handlePrintBarcode(product.barcodeImage, product.barcode)}
                        className="bg-gold-accent text-white p-2 rounded-lg hover:opacity-90"
                      >
                        Print Barcode
                      </button>
                    </>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default Inventory;