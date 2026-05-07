import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

const Home = () => (
  <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
    <div className="p-8 max-w-lg w-full bg-gray-800 rounded-2xl shadow-xl border border-gray-700">
      <h1 className="text-4xl font-extrabold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-emerald-400">
        MERN Mini App
      </h1>
      <p className="text-gray-300 text-lg mb-6">
        Welcome to your new full-stack application! This project uses MongoDB, Express, React, Node.js, and Tailwind CSS.
      </p>
      <div className="flex gap-4">
        <button className="px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg font-medium transition-colors">
          Get Started
        </button>
        <button className="px-6 py-3 bg-gray-700 hover:bg-gray-600 rounded-lg font-medium transition-colors">
          Learn More
        </button>
      </div>
    </div>
  </div>
);

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
      </Routes>
    </Router>
  );
}

export default App;
