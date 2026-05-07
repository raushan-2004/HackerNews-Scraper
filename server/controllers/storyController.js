import Story from '../models/Story.js';
import User from '../models/User.js';

// @desc    Get all stories
// @route   GET /api/stories
// @access  Public
export const getStories = async (req, res) => {
  try {
    const stories = await Story.find({}).sort({ points: -1 });
    res.json(stories);
  } catch (error) {
    console.error('Error fetching stories:', error.message);
    res.status(500).json({ message: 'Server error while fetching stories' });
  }
};

// @desc    Get a single story by ID
// @route   GET /api/stories/:id
// @access  Public
export const getStoryById = async (req, res) => {
  try {
    const story = await Story.findById(req.params.id);

    if (story) {
      res.json(story);
    } else {
      res.status(404).json({ message: 'Story not found' });
    }
  } catch (error) {
    console.error('Error fetching story by ID:', error.message);
    // If id is not a valid ObjectId, it throws a CastError
    if (error.name === 'CastError') {
      return res.status(404).json({ message: 'Story not found' });
    }
    res.status(500).json({ message: 'Server error while fetching story' });
  }
};

// @desc    Toggle bookmark for a story
// @route   POST /api/stories/:id/bookmark
// @access  Private
export const toggleBookmark = async (req, res) => {
  try {
    const storyId = req.params.id;
    const userId = req.user._id;

    // Verify story exists
    const story = await Story.findById(storyId);
    if (!story) {
      return res.status(404).json({ message: 'Story not found' });
    }

    const user = await User.findById(userId);

    // Check if already bookmarked
    const isBookmarked = user.bookmarks.includes(storyId);

    if (isBookmarked) {
      // Remove bookmark
      user.bookmarks = user.bookmarks.filter(
        (id) => id.toString() !== storyId.toString()
      );
    } else {
      // Add bookmark
      user.bookmarks.push(storyId);
    }

    await user.save();

    res.json({ 
      message: isBookmarked ? 'Bookmark removed' : 'Bookmark added',
      bookmarks: user.bookmarks 
    });
  } catch (error) {
    console.error('Error toggling bookmark:', error.message);
    if (error.name === 'CastError') {
      return res.status(404).json({ message: 'Story not found' });
    }
    res.status(500).json({ message: 'Server error while toggling bookmark' });
  }
};
