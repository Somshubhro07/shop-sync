// server/routes/sales.js
const express = require('express');
const router = express.Router();
const Sale = require('../models/Sale');
const Product = require('../models/Product');
const auth = require('../middleware/auth');

// Save a Sale (called when a user completes a sale)
router.post('/', auth, async (req, res) => {
  const { items, total, paymentMethod, customerPhone } = req.body;
  try {
    console.log('Received sale data:', req.body); // Log the incoming data

    const sale = new Sale({
      items,
      total,
      paymentMethod,
      customerPhone,
      createdBy: req.user.id,
    });
    await sale.save();
    console.log('Sale saved successfully:', sale);

    // Update stock for each product
    for (const item of items) {
      console.log(`Updating stock for product: ${item.name}, qty: ${item.qty}`);
      const product = await Product.findOne({ name: item.name, createdBy: req.user.id });
      if (product) {
        if (product.stock < item.qty) {
          return res.status(400).json({ message: `Insufficient stock for ${item.name}. Only ${product.stock} items left.` });
        }
        product.stock -= item.qty;
        await product.save();
        console.log(`Stock updated for ${item.name}: ${product.stock}`);
      } else {
        return res.status(404).json({ message: `Product ${item.name} not found.` });
      }
    }

    res.status(201).json(sale);
  } catch (error) {
    console.error('Error saving sale:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get Dashboard Data (total sales, total revenue, recent transactions, low stock alerts)
router.get('/dashboard', auth, async (req, res) => {
  try {
    // Total Sales (number of transactions)
    const totalSales = await Sale.countDocuments({ createdBy: req.user.id });

    // Total Revenue (sum of all sales totals)
    const sales = await Sale.find({ createdBy: req.user.id });
    const totalRevenue = sales.reduce((sum, sale) => sum + sale.total, 0);

    // Recent Transactions (last 5 sales)
    const recentTransactions = await Sale.find({ createdBy: req.user.id })
      .sort({ createdAt: -1 })
      .limit(5);

    // Low Stock Alerts (products with stock <= 5)
    const lowStockAlerts = await Product.find({ createdBy: req.user.id, stock: { $lte: 5 } });

    res.status(200).json({
      totalSales,
      totalRevenue,
      recentTransactions,
      lowStockAlerts,
    });
  } catch (error) {
    console.error('Error fetching dashboard data:', error);
    res.status(500).json({ message: 'Server error', error });
  }
});

// Get Sales Report (for Reporting page)
router.get('/report', auth, async (req, res) => {
  const { startDate, endDate } = req.query;
  try {
    // Filter sales by date range (if provided) and user
    const query = { createdBy: req.user.id };
    if (startDate && endDate) {
      query.createdAt = {
        $gte: new Date(startDate),
        $lte: new Date(new Date(endDate).setHours(23, 59, 59, 999)),
      };
    }

    const sales = await Sale.find(query);

    // Total Sales and Revenue in the date range
    const totalSales = sales.length;
    const totalRevenue = sales.reduce((sum, sale) => sum + sale.total, 0);

    // Sales by Day (for line chart)
    const salesByDay = sales.reduce((acc, sale) => {
      const date = new Date(sale.createdAt).toISOString().split('T')[0];
      acc[date] = (acc[date] || 0) + sale.total;
      return acc;
    }, {});
    const salesByDayArray = Object.entries(salesByDay).map(([date, revenue]) => ({
      date,
      revenue,
    }));

    // Top-Selling Products
    const productSales = {};
    sales.forEach((sale) => {
      sale.items.forEach((item) => {
        if (!productSales[item.name]) {
          productSales[item.name] = { qty: 0, revenue: 0 };
        }
        productSales[item.name].qty += item.qty;
        productSales[item.name].revenue += item.qty * item.price;
      });
    });
    const topSellingProducts = Object.entries(productSales)
      .map(([name, data]) => ({ name, ...data }))
      .sort((a, b) => b.qty - a.qty)
      .slice(0, 5);

    res.status(200).json({
      totalSales,
      totalRevenue,
      salesByDay: salesByDayArray,
      topSellingProducts,
    });
  } catch (error) {
    console.error('Error fetching report data:', error);
    res.status(500).json({ message: 'Server error', error });
  }
});

// Get All Sales (for detailed sales table in Reporting page)
router.get('/', auth, async (req, res) => {
  const { startDate, endDate } = req.query;
  try {
    const query = { createdBy: req.user.id };
    if (startDate && endDate) {
      query.createdAt = {
        $gte: new Date(startDate),
        $lte: new Date(new Date(endDate).setHours(23, 59, 59, 999)),
      };
    }
    const sales = await Sale.find(query).sort({ createdAt: -1 });
    res.status(200).json(sales);
  } catch (error) {
    console.error('Error fetching sales:', error);
    res.status(500).json({ message: 'Server error', error });
  }
});

module.exports = router;