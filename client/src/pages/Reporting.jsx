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

  const fetchReportData = async () => {
    try {
      const token = localStorage.getItem('token');
      const params = {};
      if (dateRange.startDate && dateRange.endDate) {
        params.startDate = dateRange.startDate;
        params.endDate = dateRange.endDate;
      }
      const response = await axios.get('http://localhost:5000/api/sales/report', {
        headers: { Authorization: `Bearer ${token}` },
        params,
      });
      setReportData(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching report data:', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReportData();
  }, [dateRange]);

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
          <div className="bg-light-cream p-6 rounded-xl shadow-lg border-2 border-gold-accent">
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
        </>
      )}
    </div>
  );
};

export default Reporting;