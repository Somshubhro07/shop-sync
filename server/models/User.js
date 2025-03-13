// server/models/User.js
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  phone: { type: String, required: true },
  shopName: { type: String, required: true },
  shopType: { type: String, enum: ['grocery', 'clothing', 'hardware', 'other'], required: true },
  address: { type: String, required: true },
  role: { type: String, enum: ['owner', 'manager', 'cashier'], default: 'owner' },
  isVerified: { type: Boolean, default: false },
  verificationCode: { type: String },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('User', userSchema);