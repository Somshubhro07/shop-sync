/* eslint-disable no-unused-vars */
// src/pages/Landing.jsx
import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const Landing = () => {
  const features = [
    { title: 'Smart Billing', desc: 'Fast, intuitive billing with split payments.' },
    { title: 'Inventory Management', desc: 'Track stock with ease and get low-stock alerts.' },
    { title: 'ShopPulse', desc: 'Live dashboard with animated insights.' },
  ];

  return (
    <div className="h-screen bg-gradient-to-r from-dark-black to-gray-800 text-white flex flex-col justify-center items-center p-6 relative overflow-hidden">
      {/* Mandala Background */}
      <div
        className="absolute inset-0 opacity-20 pointer-events-none" // Add pointer-events-none to prevent clicks on the background
        style={{ backgroundImage: 'url(/mandala-bg.png)', backgroundSize: 'cover' }}
      />
      {/* Header */}
      <motion.h1
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        className="text-5xl font-bold mb-4 text-gold-accent z-10"
      >
        Welcome to ShopSync
      </motion.h1>
      <motion.p
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 0.5 }}
        className="text-xl mb-8 z-10"
      >
        Your all-in-one retail management solution
      </motion.p>
      {/* Features */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 z-10">
        {features.map((feature, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: index * 0.3 }}
            className="bg-light-cream bg-opacity-90 p-6 rounded-xl shadow-lg border-2 border-gold-accent"
          >
            <h3 className="text-xl font-bold text-dark-brown">{feature.title}</h3>
            <p className="text-gray-600">{feature.desc}</p>
          </motion.div>
        ))}
      </div>
      {/* CTA Buttons */}
      <div className="flex space-x-4 z-10">
        <Link to="/signup">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="bg-gradient-to-r from-gold-accent to-saffron text-white p-3 rounded-lg"
          >
            Get Started
          </motion.button>
        </Link>
        <Link to="/login">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="bg-gray-500 text-white p-3 rounded-lg"
          >
            Login
          </motion.button>
        </Link>
      </div>
    </div>
  );
};

export default Landing;