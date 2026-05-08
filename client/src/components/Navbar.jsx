import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext.jsx';

import SearchBar from './SearchBar.jsx';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);

  return (
    <nav className="bg-gray-800 border-b border-gray-700 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center shrink-0">
            <Link to="/" className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-orange-400 to-red-500">
              HN Scraper
            </Link>
          </div>
          
          {/* Search Bar - hidden on very small screens or flex-1 */}
          <div className="flex-1 flex justify-center max-w-2xl px-2">
            <SearchBar />
          </div>
          <div className="flex space-x-4">
            <Link to="/" className="text-gray-300 hover:text-white px-3 py-2 rounded-md font-medium">Home</Link>
            {user ? (
              <>
                <Link to="/bookmarks" className="text-gray-300 hover:text-white px-3 py-2 rounded-md font-medium">Bookmarks</Link>
                <button 
                  onClick={logout}
                  className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md font-medium transition-colors"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="text-gray-300 hover:text-white px-3 py-2 rounded-md font-medium">Login</Link>
                <Link to="/register" className="bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-md font-medium transition-colors">
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
