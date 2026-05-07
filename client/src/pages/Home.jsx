import React, { useEffect, useState, useContext } from 'react';
import api from '../services/api.js';
import StoryCard from '../components/StoryCard.jsx';
import Loader from '../components/Loader.jsx';
import { AuthContext } from '../context/AuthContext.jsx';

const Home = () => {
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    fetchStories();
  }, []);

  const fetchStories = async () => {
    try {
      const { data } = await api.get('/stories');
      setStories(data);
    } catch (error) {
      console.error('Error fetching stories', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleBookmark = async (id) => {
    if (!user) {
      alert('Please login to bookmark stories');
      return;
    }
    try {
      await api.post(`/stories/${id}/bookmark`);
      // Update local state or re-fetch user info if bookmarks are needed
      // For now, we'll just show an alert or you could re-fetch
      alert('Bookmark updated!');
    } catch (error) {
      console.error('Error toggling bookmark', error);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-12">
        <h1 className="text-4xl font-extrabold text-white">Top Stories</h1>
        <button 
          onClick={() => { setLoading(true); api.post('/scrape').then(fetchStories); }}
          className="bg-orange-600 hover:bg-orange-700 text-white px-6 py-2 rounded-lg font-medium transition-all shadow-lg hover:scale-105"
        >
          Refresh Feed
        </button>
      </div>

      {loading ? <Loader /> : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {stories.map(story => (
            <StoryCard 
              key={story._id} 
              story={story} 
              onBookmark={toggleBookmark} 
              isBookmarked={user?.bookmarks?.includes(story._id)}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Home;
