// server/routes/customers.js (update)
const express = require('express');
const router = express.Router();
const Customer = require('../models/Customer');
const auth = require('../middleware/auth');

// Add or update customer (already exists)
router.post('/', auth, async (req, res) => {
  const { phone, pointsEarned } = req.body;
  try {
    let customer = await Customer.findOne({ phone, createdBy: req.user.id });
    if (customer) {
      customer.loyaltyPoints += pointsEarned;
    } else {
      customer = new Customer({
        phone,
        loyaltyPoints: pointsEarned,
        createdBy: req.user.id,
      });
    }
    await customer.save();
    res.status(200).json(customer);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});

// Redeem points (already exists)
router.post('/redeem', auth, async (req, res) => {
  const { phone, pointsToRedeem } = req.body;
  try {
    const customer = await Customer.findOne({ phone, createdBy: req.user.id });
    if (!customer) return res.status(404).json({ message: 'Customer not found' });
    if (customer.loyaltyPoints < pointsToRedeem) {
      return res.status(400).json({ message: 'Not enough points' });
    }
    customer.loyaltyPoints -= pointsToRedeem;
    await customer.save();
    res.status(200).json({ remainingPoints: customer.loyaltyPoints });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});

// Get all customers
router.get('/', auth, async (req, res) => {
  try {
    const customers = await Customer.find({ createdBy: req.user.id });
    res.status(200).json(customers);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});

// Delete a customer
router.delete('/:id', auth, async (req, res) => {
  try {
    const customer = await Customer.findOneAndDelete({ _id: req.params.id, createdBy: req.user.id });
    if (!customer) return res.status(404).json({ message: 'Customer not found' });
    res.status(200).json({ message: 'Customer deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});

module.exports = router;