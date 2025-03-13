// server/models/Sale.js
const mongoose = require('mongoose');

const saleSchema = new mongoose.Schema({
  items: [
    {
      name: { type: String, required: true },
      qty: { type: Number, required: true },
      price: { type: Number, required: true },
    },
  ],
  total: { type: Number, required: true },
  paymentMethod: {
    cash: { type: Number, default: 0 },
    card: { type: Number, default: 0 },
  },
  customerPhone: { type: String, default: null }, // Optional customer phone for loyalty points
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Sale', saleSchema);