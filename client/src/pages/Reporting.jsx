// src/pages/Reporting.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, LineElement, CategoryScale, LinearScale, PointElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement, Title, Tooltip, Legend);

const Reporting = () => {
  const [reportData, setReportData] = useState({
    totalSales: 0,
    totalRevenue: 0,
    salesByDay: [],
    topSellingProducts: [],
  });
  const [dateRange, setDateRange] = useState({
    startDate: '',
    endDate: '',
  });
  const [loading, setLoading] = useState(true);
  const [salesDetails, setSalesDetails] = useState([]); // Add state for detailed sales

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const fetchReportData = async () => {
    try {
      const token = localStorage.getItem('token');
      const params = {};
      if (dateRange.startDate && dateRange.endDate) {
        params.startDate = dateRange.startDate;
        params.endDate = dateRange.endDate;
      }
      const reportResponse = await axios.get('http://localhost:5000/api/sales/report', {
        headers: { Authorization: `Bearer ${token}` },
        params,
      });
      setReportData(reportResponse.data);

      // Fetch detailed sales for the table
      const salesResponse = await axios.get('http://localhost:5000/api/sales', {
        headers: { Authorization: `Bearer ${token}` },
        params,
      });
      setSalesDetails(salesResponse.data);

      setLoading(false);
    } catch (error) {
      console.error('Error fetching report data:', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReportData();
  }, [dateRange, fetchReportData]);

  const handleDateChange = (e) => {
    setDateRange({ ...dateRange, [e.target.name]: e.target.value });
  };

  // Chart Data for Sales by Day
  const chartData = {
    labels: reportData.salesByDay.map((entry) => entry.date),
    datasets: [
      {
        label: 'Daily Revenue (₹)',
        data: reportData.salesByDay.map((entry) => entry.revenue),
        borderColor: '#D4A017',
        backgroundColor: 'rgba(212, 160, 23, 0.2)',
        fill: true,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { position: 'top' },
      title: { display: true, text: 'Sales Over Time' },
    },
  };

  return (
    <div className="p-6">
      <h2 className="text-3xl font-bold text-dark-brown mb-6">Reporting</h2>
      {loading ? (
        <p className="text-gray-600">Loading...</p>
      ) : (
        <>
          {/* Date Range Filter */}
          <div className="mb-6 flex space-x-4">
            <div>
              <label className="block text-gray-600 mb-1">Start Date</label>
              <input
                type="date"
                name="startDate"
                value={dateRange.startDate}
                onChange={handleDateChange}
                className="p-2 border rounded-lg"
              />
            </div>
            <div>
              <label className="block text-gray-600 mb-1">End Date</label>
              <input
                type="date"
                name="endDate"
                value={dateRange.endDate}
                onChange={handleDateChange}
                className="p-2 border rounded-lg"
              />
            </div>
          </div>

          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="bg-light-cream p-6 rounded-xl shadow-lg border-2 border-gold-accent">
              <h3 className="text-xl font-bold text-dark-brown">Total Sales</h3>
              <p className="text-3xl text-gold-accent">{reportData.totalSales}</p>
            </div>
            <div className="bg-light-cream p-6 rounded-xl shadow-lg border-2 border-gold-accent">
              <h3 className="text-xl font-bold text-dark-brown">Total Revenue</h3>
              <p className="text-3xl text-gold-accent">₹{reportData.totalRevenue.toFixed(2)}</p>
            </div>
          </div>

          {/* Sales Over Time Chart */}
          <div className="bg-light-cream p-6 rounded-xl shadow-lg border-2 border-gold-accent mb-6">
            <Line data={chartData} options={chartOptions} />
          </div>

          {/* Top-Selling Products */}
          <div className="bg-light-cream p-6 rounded-xl shadow-lg border-2 border-gold-accent mb-6">
            <h3 className="text-xl font-bold text-dark-brown mb-4">Top-Selling Products</h3>
            {reportData.topSellingProducts.length === 0 ? (
              <p className="text-gray-600">No sales data available.</p>
            ) : (
              <div className="space-y-4">
                {reportData.topSellingProducts.map((product, index) => (
                  <div
                    key={index}
                    className="flex justify-between items-center p-3 bg-gray-100 rounded-lg"
                  >
                    <div>
                      <p className="text-dark-brown font-semibold">{product.name}</p>
                      <p className="text-gray-600 text-sm">{product.qty} units sold</p>
                    </div>
                    <p className="text-gold-accent font-bold">₹{product.revenue.toFixed(2)}</p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Detailed Sales Table */}
          <div className="bg-light-cream p-6 rounded-xl shadow-lg border-2 border-gold-accent">
            <h3 className="text-xl font-bold text-dark-brown mb-4">Sales Details</h3>
            {salesDetails.length === 0 ? (
              <p className="text-gray-600">No sales recorded yet.</p>
            ) : (
              <div className="space-y-4">
                {salesDetails.map((sale, index) => (
                  <div key={index} className="p-3 bg-gray-100 rounded-lg">
                    <p className="font-medium">Sale ID: {sale._id}</p>
                    <p className="text-sm text-gray-600">Date: {new Date(sale.createdAt).toLocaleString()}</p>
                    <p className="text-sm text-gray-600">Total: ₹{sale.total.toFixed(2)}</p>
                    <p className="text-sm text-gray-600">
                      Payment: Cash ₹{sale.paymentMethod.cash.toFixed(2)}, Card ₹{sale.paymentMethod.card.toFixed(2)}
                    </p>
                    {sale.customerPhone && (
                      <p className="text-sm text-gray-600">Customer Phone: {sale.customerPhone}</p>
                    )}
                    <div className="mt-2">
                      <p className="font-medium">Items:</p>
                      {sale.items.map((item, i) => (
                        <p key={i} className="text-sm">
                          {item.name} (x{item.qty}) - ₹{(item.price * item.qty).toFixed(2)}
                        </p>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default Reporting;