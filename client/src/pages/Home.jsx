// src/pages/Home.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Home = () => {
  const [dashboardData, setDashboardData] = useState({
    totalSales: 0,
    totalRevenue: 0,
    recentTransactions: [],
    lowStockAlerts: [],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:5000/api/sales/dashboard', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setDashboardData(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  return (
    <div className="p-6 min-h-screen bg-light-cream">
      <h2 className="text-3xl font-bold text-dark-brown mb-6">Welcome to ShopSync</h2>
      {loading ? (
        <p className="text-gray-600">Loading...</p>
      ) : (
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-xl shadow-lg border-2 border-gold-accent">
            <h3 className="text-xl font-bold text-dark-brown">Total Sales</h3>
            <p className="text-3xl text-gold-accent">{dashboardData.totalSales}</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-lg border-2 border-gold-accent">
            <h3 className="text-xl font-bold text-dark-brown">Recent Transactions</h3>
            {dashboardData.recentTransactions.length === 0 ? (
              <p className="text-gray-600">No recent transactions.</p>
            ) : (
              <div className="space-y-2">
                {dashboardData.recentTransactions.map((sale) => (
                  <div key={sale._id} className="text-gray-600">
                    Sale #{sale._id.slice(-5)} - {new Date(sale.createdAt).toLocaleString()}
                  </div>
                ))}
              </div>
            )}
          </div>
          <div className="bg-white p-6 rounded-xl shadow-lg border-2 border-gold-accent">
            <h3 className="text-xl font-bold text-dark-brown">Low Stock Alerts</h3>
            {dashboardData.lowStockAlerts.length === 0 ? (
              <p className="text-gray-600">No low stock items.</p>
            ) : (
              <div className="space-y-2">
                {dashboardData.lowStockAlerts.map((product) => (
                  <div key={product._id} className="text-gray-600">
                    {product.name} - Stock: {product.stock}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;