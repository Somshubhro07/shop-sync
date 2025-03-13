// src/components/Navbar.jsx
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Navbar = ({ setPage }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/'); // Redirect to landing page on logout
  };

  return (
    <nav className="w-64 h-screen p-4 bg-gradient-to-b from-dark-black to-gray-800 text-white rounded-r-xl shadow-lg fixed top-0 left-0">
      <h1 className="text-3xl font-bold mb-8 text-gold-accent">ShopSync</h1>
      <ul>
        {['Home', 'Sell', 'Reporting', 'Catalog', 'Inventory', 'Customers', 'Setup'].map((item) => (
          <li key={item} className="mb-3">
            <Link
              to={item === 'Home' ? '/dashboard' : `/${item.toLowerCase()}`}
              onClick={() => setPage && setPage(item.toLowerCase())} // Keep setPage for compatibility
              className="p-3 text-lg hover:bg-gold-accent hover:bg-opacity-20 rounded-lg w-full text-left transition-all duration-300 block"
            >
              {item}
            </Link>
          </li>
        ))}
        <li className="mb-3">
          <Link
            to="/add-product"
            className="p-3 text-lg hover:bg-gold-accent hover:bg-opacity-20 rounded-lg w-full text-left transition-all duration-300 block"
          >
            Add Product
          </Link>
        </li>
        <li className="mb-3">
          <button
            onClick={handleLogout}
            className="p-3 text-lg hover:bg-gold-accent hover:bg-opacity-20 rounded-lg w-full text-left transition-all duration-300 block"
          >
            Logout
          </button>
        </li>
      </ul>
      <div className="mt-auto">
        <p className="text-sm flex items-center">
          <span className="w-4 h-4 bg-saffron rounded-full mr-2"></span> Sasha Merkel
        </p>
      </div>
    </nav>
  );
};

export default Navbar;