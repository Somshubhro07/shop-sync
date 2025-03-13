import React, { useState, useEffect } from 'react';

const ShopPulse = () => {
  const [salesToday, setSalesToday] = useState(500); // Placeholder
  const [pulseSpeed, setPulseSpeed] = useState(1); // Controls animation speed

  useEffect(() => {
    // Simulate sales updates
    const interval = setInterval(() => {
      setSalesToday((prev) => prev + Math.floor(Math.random() * 100));
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    // Adjust pulse speed based on sales
    setPulseSpeed(salesToday > 1000 ? 0.5 : 1);
  }, [salesToday]);

  return (
    <div className="p-6 bg-gradient-to-r from-dark-black to-gray-800 rounded-xl shadow-lg text-white text-center relative overflow-hidden">
      {/* Mandala Overlay */}
      <div
        className="absolute inset-0 opacity-10"
        style={{ backgroundImage: 'url(/mandala-bg.png)', backgroundSize: 'cover' }}
      />
      <h3 className="text-2xl font-bold mb-4 text-gold-accent">ShopPulse</h3>
      {/* Heartbeat Pulse */}
      <div className="relative w-40 h-40 mx-auto mb-6">
        <div
          className="absolute inset-0 rounded-full bg-gradient-to-r from-gold-accent to-saffron bg-opacity-50"
          style={{
            animation: `pulse ${pulseSpeed}s infinite`,
          }}
        />
        <div className="absolute inset-6 rounded-full bg-gradient-to-r from-gold-accent to-saffron flex items-center justify-center shadow-inner">
          <p className="text-xl font-bold text-white">₹{salesToday}</p>
        </div>
      </div>
      {/* Avatar */}
      <div className="mb-6">
        <div className="w-20 h-20 mx-auto bg-saffron rounded-full flex items-center justify-center animate-bounce">
          {/* Replace with SVG or image */}
          <svg className="w-12 h-12 text-dark-brown" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm0-14c-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4-1.79-4-4-4zm0 6c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2z" />
          </svg>
        </div>
        <p className="mt-2 text-lg">Your shop is thriving!</p>
      </div>
      {/* Stats Bubbles */}
      <div className="flex justify-center space-x-6">
        <div
          className="w-24 h-24 rounded-full bg-gradient-to-r from-gold-accent to-saffron flex items-center justify-center animate-[bounce_2s_infinite] shadow-lg"
          style={{ animationDelay: '0s' }}
        >
          <p className="text-sm">₹{salesToday} Today</p>
        </div>
        <div
          className="w-24 h-24 rounded-full bg-gradient-to-r from-saffron to-gold-accent flex items-center justify-center animate-[bounce_2s_infinite] shadow-lg"
          style={{ animationDelay: '0.5s' }}
        >
          <p className="text-sm">5 Sales/Hour</p>
        </div>
      </div>
      <style>
        {`
          @keyframes pulse {
            0% { transform: scale(1); opacity: 1; }
            100% { transform: scale(1.5); opacity: 0; }
          }
        `}
      </style>
    </div>
  );
};

export default ShopPulse;