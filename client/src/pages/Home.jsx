import React, { useEffect, useState, useContext } from 'react';
import api from '../services/api.js';
import StoryCard from '../components/StoryCard.jsx';
import StorySkeleton from '../components/StorySkeleton.jsx';
import Pagination from '../components/Pagination.jsx';
import { AuthContext } from '../context/AuthContext.jsx';

const Home = () => {
  const [stories, setStories] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user, updateUserBookmarks } = useContext(AuthContext);

  useEffect(() => {
    fetchStories(currentPage);
  }, [currentPage]);

  const fetchStories = async (page = 1) => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await api.get(`/stories?page=${page}&limit=10`);
      setStories(data.stories || []);
      setPagination(data.pagination || null);
    } catch (err) {
      console.error('Error fetching stories', err);
      setError('Failed to load stories. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (newPage) => {
    if (newPage < 1 || (pagination && newPage > pagination.totalPages)) return;
    setCurrentPage(newPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const triggerScrape = async () => {
    setLoading(true);
    setError(null);
    try {
      await api.post('/scrape');
      // After scraping, reset to page 1 to see latest
      if (currentPage === 1) {
        await fetchStories(1);
      } else {
        setCurrentPage(1);
      }
    } catch (err) {
      console.error('Error refreshing feed', err);
      setError('Failed to scrape new stories. The backend may be busy.');
      setLoading(false);
    }
  };

  const toggleBookmark = async (id) => {
    if (!user) {
      alert('Please login to bookmark stories');
      return;
    }
    try {
      const { data } = await api.post(`/stories/${id}/bookmark`);
      updateUserBookmarks(data.bookmarks);
    } catch (err) {
      console.error('Error toggling bookmark', err);
      alert('Failed to update bookmark');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-12 gap-4">
        <h1 className="text-4xl font-extrabold text-white">Top Stories</h1>
        <button 
          onClick={triggerScrape}
          className="bg-orange-600 hover:bg-orange-700 text-white px-6 py-3 rounded-lg font-bold transition-all shadow-lg hover:scale-105 disabled:opacity-50 disabled:hover:scale-100 flex items-center justify-center min-w-[160px]"
          disabled={loading}
        >
          {loading ? (
            <span className="flex items-center">
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Refreshing...
            </span>
          ) : 'Refresh Feed'}
        </button>
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500 text-red-400 px-6 py-4 rounded-xl mb-8 text-center shadow-lg">
          <p className="font-medium">{error}</p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          // Display skeletons while loading based on limit
          Array.from({ length: 9 }).map((_, i) => <StorySkeleton key={i} />)
        ) : (
          // Removed hardcoded slice(0, 10), relying on backend limit
          stories.map(story => (
            <StoryCard 
              key={story._id} 
              story={story} 
              onBookmark={toggleBookmark} 
              isBookmarked={user?.bookmarks?.includes(story._id)}
            />
          ))
        )}
      </div>
      
      {!loading && stories.length === 0 && !error && (
        <div className="text-center py-20 bg-gray-800 rounded-2xl border border-gray-700 shadow-xl">
          <p className="text-gray-400 text-xl mb-4">No stories available.</p>
          <p className="text-gray-500">Click "Refresh Feed" to scrape the latest from HackerNews.</p>
        </div>
      )}

      {!loading && stories.length > 0 && (
        <Pagination 
          pagination={pagination} 
          onPageChange={handlePageChange} 
          loading={loading} 
        />
      )}
    </div>
  );
};

export default Home;
