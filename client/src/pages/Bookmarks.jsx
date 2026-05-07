import React, { useEffect, useState, useContext } from 'react';
import api from '../services/api.js';
import StoryCard from '../components/StoryCard.jsx';
import Loader from '../components/Loader.jsx';
import { AuthContext } from '../context/AuthContext.jsx';

const Bookmarks = () => {
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    fetchBookmarkedStories();
  }, []);

  const fetchBookmarkedStories = async () => {
    try {
      const { data } = await api.get('/stories');
      // Filter stories that are in user's bookmarks
      const bookmarked = data.filter(story => user?.bookmarks?.includes(story._id));
      setStories(bookmarked);
    } catch (error) {
      console.error('Error fetching stories', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleBookmark = async (id) => {
    try {
      await api.post(`/stories/${id}/bookmark`);
      // Update local UI immediately
      setStories(stories.filter(s => s._id !== id));
    } catch (error) {
      console.error('Error toggling bookmark', error);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-4xl font-extrabold text-white mb-12">My Bookmarks</h1>

      {loading ? <Loader /> : stories.length === 0 ? (
        <div className="text-center py-20 bg-gray-800 rounded-2xl border border-gray-700">
          <p className="text-gray-400 text-xl">You haven't bookmarked any stories yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {stories.map(story => (
            <StoryCard 
              key={story._id} 
              story={story} 
              onBookmark={toggleBookmark} 
              isBookmarked={true}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Bookmarks;
