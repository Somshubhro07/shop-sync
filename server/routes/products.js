// server/routes/products.js
const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const auth = require('../middleware/auth');
const { generateBarcode } = require('../utils/generateBarcode');

// Add a new product (used by /add-product page)
router.post('/', auth, async (req, res) => {
  const { name, description, price, stock } = req.body;
  try {
    const productCount = await Product.countDocuments({ userId: req.user.id });
    const barcode = `PROD-${req.user.id}-${productCount + 1}`; // Generate a unique barcode code

    const barcodeImage = await generateBarcode(barcode); // Generate barcode image as base64

    const product = new Product({
      name,
      description,
      price,
      stock,
      barcode,
      barcodeImage,
      userId: req.user.id,
    });

    await product.save();
    res.status(201).json(product);
  } catch (error) {
    console.error('Error adding product:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get all products for the user (used by Inventory page)
router.get('/', auth, async (req, res) => {
  try {
    const products = await Product.find({ userId: req.user.id });
    res.status(200).json(products);
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Update a product
router.put('/:id', auth, async (req, res) => {
  const { name, description, price, stock } = req.body;
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    if (product.userId.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    product.name = name || product.name;
    product.description = description || product.description;
    product.price = price || product.price;
    product.stock = stock || product.stock;

    await product.save();
    res.status(200).json(product);
  } catch (error) {
    console.error('Error updating product:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Delete a product
router.delete('/:id', auth, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    if (product.userId.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    await product.deleteOne();
    res.status(200).json({ message: 'Product deleted' });
  } catch (error) {
    console.error('Error deleting product:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;