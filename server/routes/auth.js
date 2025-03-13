// server/routes/auth.js (update)
const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const sgMail = require('@sendgrid/mail');
const User = require('../models/User');

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

// Existing routes (signup, verify, login) remain unchanged
router.post('/signup', async (req, res) => {
  const { name, email, password, phone, shopName, shopType, address } = req.body;
  try {
    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ message: 'User already exists' });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();

    user = new User({
      name,
      email,
      password: hashedPassword,
      phone,
      shopName,
      shopType,
      address,
      verificationCode,
    });

    await user.save();

    const msg = {
      to: email,
      from: process.env.EMAIL_FROM,
      subject: 'Welcome to ShopSync - Verify Your Email',
      text: `Hello ${name},\n\nThank you for joining ShopSync! Your verification code is: ${verificationCode}\n\nEnter this code in the ShopSync app to verify your email and get started.\n\nBest regards,\nThe ShopSync Team`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h1 style="color: #D4A017;">Welcome to ShopSync, ${name}!</h1>
          <p style="font-size: 16px; color: #333;">Thank you for joining ShopSync! We're excited to have you on board.</p>
          <p style="font-size: 16px; color: #333;">To get started, please verify your email address using the code below:</p>
          <div style="background-color: #F9F5EB; padding: 15px; text-align: center; border-radius: 5px; margin: 20px 0;">
            <h2 style="font-size: 24px; color: #3C2F2F; margin: 0;">${verificationCode}</h2>
          </div>
          <p style="font-size: 16px; color: #333;">Enter this code in the ShopSync app to verify your email.</p>
          <p style="font-size: 14px; color: #666;">If you didn’t sign up for ShopSync, please ignore this email.</p>
          <p style="font-size: 16px; color: #333;">Best regards,<br><strong>The ShopSync Team</strong></p>
          <hr style="border: none; border-top: 1px solid #ddd; margin: 20px 0;">
          <p style="font-size: 12px; color: #999; text-align: center;">
            ShopSync | <a href="https://shopsync.example.com" style="color: #D4A017;">Visit our website</a> | <a href="mailto:support@shopsync.example.com" style="color: #D4A017;">Contact Support</a>
          </p>
        </div>
      `,
    };

    sgMail
      .send(msg)
      .then((response) => {
        console.log('Email sent successfully:', response);
        console.log('Message ID:', response[0].headers['x-message-id']);
      })
      .catch((error) => {
        console.error('SendGrid error:', error);
        if (error.response) {
          console.error('Response body:', JSON.stringify(error.response.body, null, 2));
        }
      });

    res.status(201).json({ message: 'User registered. Please check your email for verification.' });
  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

router.post('/verify', async (req, res) => {
  const { email, code } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'User not found' });

    if (user.verificationCode !== code) return res.status(400).json({ message: 'Invalid code' });

    user.isVerified = true;
    user.verificationCode = undefined;
    await user.save();

    res.status(200).json({ message: 'Email verified successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'Invalid credentials' });

    if (!user.isVerified) return res.status(400).json({ message: 'Please verify your email' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.status(200).json({ token, user: { id: user._id, name: user.name, email: user.email, role: user.role } });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});

// Get user profile
router.get('/profile', async (req, res) => {
  const token = req.header('Authorization').replace('Bearer ', '');
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select('-password -verificationCode');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});

// Update user profile
router.put('/profile', async (req, res) => {
  const token = req.header('Authorization').replace('Bearer ', '');
  const { name, phone, shopName, shopType, address } = req.body;
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    user.name = name || user.name;
    user.phone = phone || user.phone;
    user.shopName = shopName || user.shopName;
    user.shopType = shopType || user.shopType;
    user.address = address || user.address;

    await user.save();
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});

module.exports = router;