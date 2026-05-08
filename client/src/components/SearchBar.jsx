import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api.js';
import { useDebounce } from '../hooks/useDebounce.jsx';

const SearchBar = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [error, setError] = useState(null);
  
  const debouncedQuery = useDebounce(query, 500);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  // Handle click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Perform search when debounced query changes
  useEffect(() => {
    const fetchSearchResults = async () => {
      if (!debouncedQuery.trim()) {
        setResults([]);
        setIsSearching(false);
        return;
      }

      setIsSearching(true);
      setError(null);
      
      try {
        const { data } = await api.get(`/stories/search?q=${encodeURIComponent(debouncedQuery)}`);
        setResults(data.stories || []);
        setShowDropdown(true);
      } catch (err) {
        console.error('Search error', err);
        setError('Failed to fetch results');
        setResults([]);
      } finally {
        setIsSearching(false);
      }
    };

    fetchSearchResults();
  }, [debouncedQuery]);

  const handleResultClick = (storyId) => {
    setShowDropdown(false);
    setQuery('');
    // For now we just open original URL or can implement logic as needed
    // Usually, clicking would navigate to a detailed view if one exists.
    // If not, we can just log or open the original URL.
  };

  return (
    <div className="relative w-full max-w-md mx-4" ref={dropdownRef}>
      <div className="relative">
        <input
          type="text"
          className="w-full bg-gray-700 text-white border border-gray-600 rounded-full py-2 pl-10 pr-10 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
          placeholder="Search stories by title or author..."
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setShowDropdown(true);
          }}
          onFocus={() => {
            if (query.trim()) setShowDropdown(true);
          }}
        />
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        
        {query && (
          <button 
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-white"
            onClick={() => {
              setQuery('');
              setResults([]);
              setShowDropdown(false);
            }}
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>

      {showDropdown && query.trim() && (
        <div className="absolute mt-2 w-full bg-gray-800 border border-gray-700 rounded-xl shadow-2xl overflow-hidden z-50 max-h-96 flex flex-col">
          {isSearching ? (
            <div className="p-4 flex justify-center items-center text-gray-400">
              <svg className="animate-spin h-5 w-5 mr-3 text-orange-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Searching...
            </div>
          ) : error ? (
            <div className="p-4 text-center text-red-400">
              {error}
            </div>
          ) : results.length === 0 ? (
            <div className="p-4 text-center text-gray-400">
              No stories found for "{query}"
            </div>
          ) : (
            <ul className="overflow-y-auto">
              {results.map((story) => (
                <li key={story._id} className="border-b border-gray-700 last:border-0 hover:bg-gray-700 transition-colors">
                  <a 
                    href={story.url} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="block p-4"
                    onClick={() => handleResultClick(story._id)}
                  >
                    <h4 className="text-sm font-semibold text-white mb-1 line-clamp-2">{story.title}</h4>
                    <div className="flex items-center text-xs text-gray-400 space-x-3">
                      <span className="text-orange-400 font-medium">{story.points} points</span>
                      <span>by {story.author}</span>
                      <span>{story.postedAt}</span>
                    </div>
                  </a>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchBar;
