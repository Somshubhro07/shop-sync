// src/components/BillingForm.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const BillingForm = () => {
  const [cart, setCart] = useState([]);
  const [barcode, setBarcode] = useState('');
  const [total, setTotal] = useState(0);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showBill, setShowBill] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState({ cash: 0, card: 0 });
  const [customerPhone, setCustomerPhone] = useState('');
  const navigate = useNavigate();

  const fetchProductByBarcode = async (barcode) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`http://localhost:5000/api/products/by-barcode/${barcode}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    } catch (err) {
      setError('Product not found or invalid barcode.');
      return null;
    }
  };

  const handleBarcodeScan = async (e) => {
    if (e.key === 'Enter' && barcode.trim()) {
      const product = await fetchProductByBarcode(barcode);
      if (product) {
        const existingItem = cart.find(item => item.barcode === product.barcode);
        if (existingItem) {
          setCart(cart.map(item =>
            item.barcode === product.barcode ? { ...item, quantity: item.quantity + 1 } : item
          ));
        } else {
          setCart([...cart, { ...product, quantity: 1 }]);
        }
      }
      setBarcode('');
    }
  };

  const handleDeleteItem = (index) => {
    setCart(cart.filter((_, i) => i !== index));
  };

  const handlePaymentChange = (e) => {
    const { name, value } = e.target;
    const updatedPayment = { ...paymentMethod, [name]: parseFloat(value) || 0 };
    setPaymentMethod(updatedPayment);
  };

  const handleFinalizeSale = async () => {
    if (cart.length === 0) {
      setError('No items in cart to process.');
      return;
    }

    const finalTotal = total * 1.05; // Including 5% tax
    const paymentSum = paymentMethod.cash + paymentMethod.card;
    if (paymentSum < finalTotal) {
      setError(`Payment amount (₹${paymentSum.toFixed(2)}) is less than total (₹${finalTotal.toFixed(2)}).`);
      return;
    }

    try {
      const token = localStorage.getItem('token');

      // Record the sale (stock update is handled in the backend)
      const saleData = {
        items: cart.map(item => ({
          name: item.name,
          qty: item.quantity, // Use 'qty' to match the Sale model
          price: item.price,
        })),
        total: finalTotal,
        paymentMethod,
        customerPhone: customerPhone || null,
      };
      const saleResponse = await axios.post('http://localhost:5000/api/sales', saleData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log('Sale recorded:', saleResponse.data);

      // Show success and bill
      setSuccess('Sale completed successfully! Stock updated.');
      setShowBill(true);
    } catch (err) {
      setError('Failed to process sale: ' + (err.response?.data?.message || err.message));
      console.error('Error in handleFinalizeSale:', err);
    }
  };

  const handlePrint = () => {
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
      <html>
        <head>
          <title>ShopSync Bill</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 20px; }
            .bill-container { max-width: 600px; margin: 0 auto; border: 1px solid #ccc; padding: 20px; border-radius: 10px; }
            .bill-header { text-align: center; margin-bottom: 20px; }
            .bill-header h1 { font-size: 24px; color: #3c2f2f; }
            .bill-details { margin-bottom: 20px; }
            .bill-details p { margin: 5px 0; }
            .bill-items { margin-bottom: 20px; }
            .bill-item { display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px dashed #ccc; }
            .bill-footer { margin-top: 20px; text-align: center; }
            .bill-footer p { margin: 5px 0; }
            .bill-footer .total { font-size: 18px; font-weight: bold; }
          </style>
        </head>
        <body>
          <div class="bill-container">
            <div class="bill-header">
              <h1>ShopSync</h1>
              <p>ID: NO${Math.floor(Math.random() * 1000000)}</p>
              <p>${new Date().toLocaleString()}</p>
            </div>
            <div class="bill-details">
              <p><strong>Transaction Success!</strong></p>
              <p>Thank you for shopping with ShopSync.</p>
              ${customerPhone ? `<p>Customer Phone: ${customerPhone}</p>` : ''}
              <p>Payment: Cash ₹${paymentMethod.cash.toFixed(2)}, Card ₹${paymentMethod.card.toFixed(2)}</p>
            </div>
            <div class="bill-items">
              ${cart.map(item => `
                <div class="bill-item">
                  <div>
                    <p>${item.name}</p>
                    <p>${item.quantity} item${item.quantity > 1 ? 's' : ''}</p>
                  </div>
                  <p>₹${(item.price * item.quantity).toFixed(2)}</p>
                </div>
              `).join('')}
            </div>
            <div class="bill-footer">
              <p>Subtotal: ₹${total.toFixed(2)}</p>
              <p>Tax (5%): ₹${(total * 0.05).toFixed(2)}</p>
              <p class="total">Total: ₹${(total * 1.05).toFixed(2)}</p>
            </div>
          </div>
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.print();
  };

  useEffect(() => {
    setTotal(cart.reduce((sum, item) => sum + item.price * item.quantity, 0));
  }, [cart]);

  return (
    <div className="p-6 min-h-screen bg-light-cream">
      <h2 className="text-3xl font-bold text-dark-brown mb-6">Sell Products</h2>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      {success && !showBill && <p className="text-green-500 mb-4">{success}</p>}
      <div className="mb-6">
        <label className="block text-gray-600 font-medium mb-1">Scan Barcode</label>
        <input
          type="text"
          value={barcode}
          onChange={(e) => setBarcode(e.target.value)}
          onKeyPress={handleBarcodeScan}
          className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-gold-accent"
          placeholder="Scan or enter barcode, then press Enter"
          autoFocus
        />
      </div>
      <div className="mb-6">
        <h3 className="text-xl font-semibold text-dark-brown mb-2">Cart</h3>
        {cart.length === 0 ? (
          <p className="text-gray-500">No items in cart.</p>
        ) : (
          <div className="space-y-4">
            {cart.map((item, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-white rounded-lg shadow border border-gold-accent">
                <div>
                  <p className="font-medium">{item.name} (x{item.quantity})</p>
                  <p className="text-sm text-gray-600">₹{item.price.toFixed(2)} each</p>
                  {item.image && (
                    <img src={item.image} alt={item.name} className="mt-2 w-16 h-16 object-cover rounded" />
                  )}
                </div>
                <button
                  onClick={() => handleDeleteItem(index)}
                  className="text-red-500 hover:text-red-700"
                >
                  Delete
                </button>
              </div>
            ))}
            <p className="text-lg font-bold mt-4">Total (with 5% tax): ₹{(total * 1.05).toFixed(2)}</p>
          </div>
        )}
      </div>
      {cart.length > 0 && (
        <div className="mb-6">
          <h3 className="text-xl font-semibold text-dark-brown mb-2">Payment Details</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-600 font-medium mb-1">Cash (₹)</label>
              <input
                type="number"
                name="cash"
                value={paymentMethod.cash}
                onChange={handlePaymentChange}
                className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-gold-accent"
                placeholder="e.g., 1000"
                step="0.01"
              />
            </div>
            <div>
              <label className="block text-gray-600 font-medium mb-1">Card (₹)</label>
              <input
                type="number"
                name="card"
                value={paymentMethod.card}
                onChange={handlePaymentChange}
                className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-gold-accent"
                placeholder="e.g., 2000"
                step="0.01"
              />
            </div>
            <div>
              <label className="block text-gray-600 font-medium mb-1">Customer Phone (Optional)</label>
              <input
                type="text"
                value={customerPhone}
                onChange={(e) => setCustomerPhone(e.target.value)}
                className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-gold-accent"
                placeholder="e.g., +919876543210"
              />
            </div>
          </div>
        </div>
      )}
      <button
        onClick={handleFinalizeSale}
        className="w-full bg-gradient-to-r from-gold-accent to-saffron text-white p-3 rounded-lg hover:opacity-90 font-medium transition duration-300"
        disabled={cart.length === 0}
      >
        Finalize Sale
      </button>

      {showBill && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-xl shadow-lg max-w-md w-full">
            <div className="text-center mb-4">
              <h1 className="text-2xl font-bold text-dark-brown">ShopSync</h1>
              <p className="text-sm text-gray-500">ID: NO{Math.floor(Math.random() * 1000000)}</p>
              <p className="text-sm text-gray-500">{new Date().toLocaleString()}</p>
            </div>
            <div className="mb-4">
              <p className="text-green-500 font-medium">Transaction Success!</p>
              <p className="text-gray-600 text-sm">Thank you for shopping with ShopSync.</p>
              {customerPhone && <p className="text-gray-600 text-sm">Customer Phone: {customerPhone}</p>}
              <p className="text-gray-600 text-sm">Payment: Cash ₹{paymentMethod.cash.toFixed(2)}, Card ₹{paymentMethod.card.toFixed(2)}</p>
            </div>
            <div className="space-y-2 mb-4">
              {cart.map((item, index) => (
                <div key={index} className="flex justify-between border-b border-dashed pb-2">
                  <div>
                    <p className="font-medium">{item.name}</p>
                    <p className="text-sm text-gray-500">{item.quantity} item{item.quantity > 1 ? 's' : ''}</p>
                  </div>
                  <p>₹{(item.price * item.quantity).toFixed(2)}</p>
                </div>
              ))}
            </div>
            <div className="text-right">
              <p className="text-sm">Subtotal: ₹{total.toFixed(2)}</p>
              <p className="text-sm">Tax (5%): ₹{(total * 0.05).toFixed(2)}</p>
              <p className="text-lg font-bold">Total: ₹{(total * 1.05).toFixed(2)}</p>
            </div>
            <div className="flex justify-between mt-6">
              <button
                onClick={() => navigate('/dashboard')}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
              >
                Back to Home
              </button>
              <button
                onClick={handlePrint}
                className="px-4 py-2 bg-gold-accent text-white rounded-lg hover:bg-opacity-90"
              >
                Print Bill
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BillingForm;