// src/components/BillingForm.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { jsPDF } from 'jspdf';

const BillingForm = () => {
  const [items, setItems] = useState([{ name: '', qty: 1, price: 0 }]);
  const [total, setTotal] = useState(0);
  const [suggestions, setSuggestions] = useState([]);
  const [paymentMethod, setPaymentMethod] = useState({ cash: 0, card: 0 });
  const [heldSales, setHeldSales] = useState([]);
  const [currentSaleId, setCurrentSaleId] = useState(null);
  const [barcode, setBarcode] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [redeemPoints, setRedeemPoints] = useState(0);
  const [customerPoints, setCustomerPoints] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      const token = localStorage.getItem('token');
      const { data } = await axios.get('http://localhost:5000/api/products', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSuggestions(data);
    };
    fetchProducts();
  }, []);

  useEffect(() => {
    setTotal(items.reduce((sum, item) => sum + item.qty * item.price, 0));
  }, [items]);

  const handleAddItem = () => {
    setItems([...items, { name: '', qty: 1, price: 0 }]);
  };

  const handleInputChange = (index, field, value) => {
    const newItems = [...items];
    newItems[index][field] = value;

    if (field === 'name') {
      const filtered = suggestions.filter((product) =>
        product.name.toLowerCase().startsWith(value.toLowerCase())
      );
      setSuggestions(filtered);
      if (filtered.length === 1 && filtered[0].name === value) {
        newItems[index].price = filtered[0].price;
      }
    }

    setItems(newItems);
  };

  const handleSuggestionClick = (index, suggestion) => {
    const newItems = [...items];
    newItems[index].name = suggestion.name;
    newItems[index].price = suggestion.price;
    setItems(newItems);
    setSuggestions([]);
  };

  const handleBarcodeScan = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const { data } = await axios.get('http://localhost:5000/api/products', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const product = data.find((p) => p._id === barcode);
      if (product) {
        const newItems = [...items];
        newItems[newItems.length - 1] = { name: product.name, qty: 1, price: product.price };
        setItems(newItems);
      }
      setBarcode('');
    } catch (err) {
      console.error('Error scanning barcode:', err);
    }
  };

  const handleCustomerPhoneSubmit = async () => {
    if (!customerPhone) return;
    try {
      const token = localStorage.getItem('token');
      const pointsEarned = Math.floor(total / 100); // 1 point per ₹100
      const { data } = await axios.post(
        'http://localhost:5000/api/customers',
        { phone: customerPhone, pointsEarned },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setCustomerPoints(data.loyaltyPoints);
    } catch (err) {
      console.error('Error adding customer:', err);
    }
  };

  const handleRedeemPoints = async () => {
    if (!customerPhone || !redeemPoints) return;
    try {
      const token = localStorage.getItem('token');
      const { data } = await axios.post(
        'http://localhost:5000/api/customers/redeem',
        { phone: customerPhone, pointsToRedeem: redeemPoints },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setCustomerPoints(data.remainingPoints);
      setTotal((prev) => prev - redeemPoints * 10); // 1 point = ₹10 discount
      setRedeemPoints(0);
    } catch (err) {
      console.error('Error redeeming points:', err);
    }
  };

  const handlePaymentChange = (method, value) => {
    setPaymentMethod((prev) => ({
      ...prev,
      [method]: parseFloat(value) || 0,
    }));
  };

  const handleHoldSale = () => {
    if (items.some((item) => item.name)) {
      setHeldSales([...heldSales, { id: Date.now(), items, total }]);
      setItems([{ name: '', qty: 1, price: 0 }]);
      setTotal(0);
      setPaymentMethod({ cash: 0, card: 0 });
      setCurrentSaleId(null);
    }
  };

  const handleResumeSale = (sale) => {
    setItems(sale.items);
    setTotal(sale.total);
    setCurrentSaleId(sale.id);
  };

  const completeSale = async () => {
    try {
      const token = localStorage.getItem('token');
      const saleData = {
        items,
        total,
        paymentMethod,
        customerPhone: customerPhone || null,
      };
      await axios.post('http://localhost:5000/api/sales', saleData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log('Sale saved successfully');
    } catch (error) {
      console.error('Error saving sale:', error);
    }
  };

  const generatePDFBill = async () => {
    await completeSale(); // Save the sale before generating the PDF

    const doc = new jsPDF();
    doc.setFontSize(20);
    doc.text('ShopSync Bill', 20, 20);
    doc.setFontSize(12);
    doc.text(`Date: ${new Date().toLocaleDateString()}`, 20, 30);
    doc.text(`Customer Phone: ${customerPhone || 'N/A'}`, 20, 40);
    doc.text('Items:', 20, 50);
    items.forEach((item, index) => {
      doc.text(`${index + 1}. ${item.name} x ${item.qty} @ ₹${item.price} = ₹${(item.qty * item.price).toFixed(2)}`, 20, 60 + index * 10);
    });
    doc.text(`Total: ₹${total.toFixed(2)}`, 20, 60 + items.length * 10);
    doc.text(`Payment: Cash ₹${paymentMethod.cash}, Card ₹${paymentMethod.card}`, 20, 70 + items.length * 10);
    doc.text('Thank you for shopping with us!', 20, 80 + items.length * 10);
    doc.save('bill.pdf');

    // Reset the form after completing the sale
    setItems([{ name: '', qty: 1, price: 0 }]);
    setTotal(0);
    setPaymentMethod({ cash: 0, card: 0 });
    setCustomerPhone('');
    setCustomerPoints(null);
    setRedeemPoints(0);
  };

  return (
    <div className="p-6 bg-light-cream rounded-xl border-2 border-gold-accent shadow-lg">
      <h3 className="text-2xl font-bold text-dark-brown mb-4">Billing</h3>
      {heldSales.length > 0 && (
        <div className="mb-4">
          <h4 className="text-lg font-semibold text-dark-brown">Held Sales</h4>
          <div className="flex space-x-2">
            {heldSales.map((sale) => (
              <button
                key={sale.id}
                onClick={() => handleResumeSale(sale)}
                className="bg-gradient-to-r from-gold-accent to-saffron text-white p-2 rounded-lg hover:opacity-90"
              >
                Sale #{sale.id}
              </button>
            ))}
          </div>
        </div>
      )}
      <div className="mb-4">
        <h4 className="text-lg font-semibold text-dark-brown">Scan Barcode</h4>
        <form onSubmit={handleBarcodeScan} className="flex space-x-2">
          <input
            type="text"
            value={barcode}
            onChange={(e) => setBarcode(e.target.value)}
            placeholder="Enter Barcode"
            className="p-2 border rounded-lg w-full"
          />
          <button type="submit" className="bg-gradient-to-r from-gold-accent to-saffron text-white p-2 rounded-lg">
            Scan
          </button>
        </form>
      </div>
      {items.map((item, index) => (
        <div key={index} className="mb-4 flex space-x-4 relative">
          <div className="relative flex-1">
            <input
              type="text"
              placeholder="Item Name"
              value={item.name}
              onChange={(e) => handleInputChange(index, 'name', e.target.value)}
              className="p-2 border rounded-lg w-full"
            />
            {suggestions.length > 0 && index === items.length - 1 && (
              <ul className="absolute bg-white border rounded-lg w-full mt-1 z-10">
                {suggestions.map((suggestion) => (
                  <li
                    key={suggestion._id}
                    onClick={() => handleSuggestionClick(index, suggestion)}
                    className="p-2 hover:bg-gray-100 cursor-pointer"
                  >
                    {suggestion.name} (₹{suggestion.price})
                  </li>
                ))}
              </ul>
            )}
          </div>
          <input
            type="number"
            placeholder="Qty"
            value={item.qty}
            onChange={(e) => handleInputChange(index, 'qty', e.target.value)}
            className="p-2 border rounded-lg w-20"
          />
          <input
            type="number"
            placeholder="Price (₹)"
            value={item.price}
            onChange={(e) => handleInputChange(index, 'price', e.target.value)}
            className="p-2 border rounded-lg w-20"
            readOnly
          />
        </div>
      ))}
      <button
        onClick={handleAddItem}
        className="bg-gradient-to-r from-gold-accent to-saffron text-white p-2 rounded-lg hover:opacity-90 mb-4"
      >
        Add Item
      </button>
      <div className="mb-4">
        <h4 className="text-lg font-semibold text-dark-brown">Customer Details</h4>
        <div className="flex space-x-4">
          <div className="flex-1">
            <label className="block text-gray-600">Phone Number (optional)</label>
            <input
              type="text"
              value={customerPhone}
              onChange={(e) => setCustomerPhone(e.target.value)}
              onBlur={handleCustomerPhoneSubmit}
              className="p-2 border rounded-lg w-full"
            />
          </div>
          {customerPoints !== null && (
            <div>
              <label className="block text-gray-600">Redeem Points ({customerPoints} available)</label>
              <input
                type="number"
                value={redeemPoints}
                onChange={(e) => setRedeemPoints(parseInt(e.target.value) || 0)}
                className="p-2 border rounded-lg w-20"
              />
              <button
                onClick={handleRedeemPoints}
                className="bg-gradient-to-r from-gold-accent to-saffron text-white p-2 rounded-lg ml-2"
              >
                Redeem
              </button>
            </div>
          )}
        </div>
      </div>
      <p className="text-lg text-dark-brown mb-4">Total: ₹{total.toFixed(2)}</p>
      <div className="mb-4">
        <h4 className="text-lg font-semibold text-dark-brown">Split Payment</h4>
        <div className="flex space-x-4">
          <div>
            <label className="block text-gray-600">Cash (₹)</label>
            <input
              type="number"
              value={paymentMethod.cash}
              onChange={(e) => handlePaymentChange('cash', e.target.value)}
              className="p-2 border rounded-lg w-32"
            />
          </div>
          <div>
            <label className="block text-gray-600">Card (₹)</label>
            <input
              type="number"
              value={paymentMethod.card}
              onChange={(e) => handlePaymentChange('card', e.target.value)}
              className="p-2 border rounded-lg w-32"
            />
          </div>
        </div>
        <p className="text-gray-600 mt-2">
          Total Paid: ₹{(paymentMethod.cash + paymentMethod.card).toFixed(2)} | Change: ₹{Math.max((paymentMethod.cash + paymentMethod.card - total).toFixed(2), 0)}
        </p>
      </div>
      <div className="flex space-x-4">
        <button
          onClick={handleHoldSale}
          className="bg-gray-500 text-white p-2 rounded-lg hover:bg-gray-600"
        >
          Hold Sale
        </button>
        <button
          onClick={generatePDFBill}
          className="bg-gradient-to-r from-gold-accent to-saffron text-white p-2 rounded-lg hover:opacity-90"
        >
          Complete Sale & Generate Bill
        </button>
      </div>
    </div>
  );
};

export default BillingForm;