import mongoose from 'mongoose';
import Story from '../models/Story.js';
import User from '../models/User.js';

// @desc    Get all stories
// @route   GET /api/stories
// @access  Public
export const getStories = async (req, res) => {
  try {
    let page = parseInt(req.query.page, 10);
    let limit = parseInt(req.query.limit, 10);

    // Validation
    if (isNaN(page) || page < 1) page = 1;
    if (isNaN(limit) || limit < 1) limit = 10;
    if (limit > 50) limit = 50;

    const skip = (page - 1) * limit;

    // Use Promise.all to fetch count and stories in parallel
    const [totalStories, stories] = await Promise.all([
      Story.countDocuments({}),
      Story.find({})
        .sort({ points: -1, createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean() // Optimize query performance
    ]);

    const totalPages = Math.ceil(totalStories / limit);

    // Return response in the required format
    res.json({
      success: true,
      pagination: {
        totalStories,
        totalPages,
        currentPage: page,
        limit,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1
      },
      stories: stories
    });
  } catch (error) {
    console.error('Error fetching stories:', error.message);
    res.status(500).json({ success: false, message: 'Server error while fetching stories' });
  }
};

// @desc    Get a single story by ID
// @route   GET /api/stories/:id
// @access  Public
export const getStoryById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: 'Invalid story ID format' });
    }

    const story = await Story.findById(id);

    if (story) {
      res.json({
        success: true,
        story: {
          _id: story._id,
          title: story.title,
          url: story.url,
          points: story.points,
          author: story.author,
          postedAt: story.postedAt
        }
      });
    } else {
      res.status(404).json({ success: false, message: 'Story not found' });
    }
  } catch (error) {
    console.error('Error fetching story by ID:', error.message);
    res.status(500).json({ success: false, message: 'Server error while fetching story' });
  }
};

// @desc    Toggle bookmark for a story
// @route   POST /api/stories/:id/bookmark
// @access  Private
export const toggleBookmark = async (req, res) => {
  try {
    const storyId = req.params.id;
    const userId = req.user._id;

    if (!mongoose.Types.ObjectId.isValid(storyId)) {
      return res.status(400).json({ success: false, message: 'Invalid story ID format' });
    }

    // Verify story exists
    const story = await Story.findById(storyId);
    if (!story) {
      return res.status(404).json({ success: false, message: 'Story not found' });
    }

    const user = await User.findById(userId);

    // Check if already bookmarked
    const isBookmarked = user.bookmarks.includes(storyId);

    if (isBookmarked) {
      // Remove bookmark using $pull
      await User.findByIdAndUpdate(userId, { $pull: { bookmarks: storyId } });
      const updatedBookmarks = user.bookmarks.filter(id => id.toString() !== storyId.toString());
      res.json({ 
        success: true,
        message: 'Bookmark removed',
        bookmarked: false,
        bookmarks: updatedBookmarks // To keep frontend working
      });
    } else {
      // Add bookmark using $addToSet
      await User.findByIdAndUpdate(userId, { $addToSet: { bookmarks: storyId } });
      const updatedBookmarks = [...user.bookmarks, storyId];
      res.json({ 
        success: true,
        message: 'Story bookmarked',
        bookmarked: true,
        bookmarks: updatedBookmarks // To keep frontend working
      });
    }
  } catch (error) {
    console.error('Error toggling bookmark:', error.message);
    res.status(500).json({ success: false, message: 'Server error while toggling bookmark' });
  }
};

// @desc    Search stories by keyword
// @route   GET /api/stories/search
// @access  Public
export const searchStories = async (req, res) => {
  try {
    const { q } = req.query;

    if (!q || q.trim() === '') {
      return res.status(400).json({ success: false, message: 'Story not found' });
    }

    const query = q.trim();

    const stories = await Story.find({
      $or: [
        { title: { $regex: query, $options: 'i' } },
        { author: { $regex: query, $options: 'i' } }
      ]
    })
      .sort({ points: -1, createdAt: -1 })
      .limit(20)
      .lean();

    if (stories.length === 0) {
      return res.json({ success: true, count: 0, stories: [] });
    }

    res.json({
      success: true,
      count: stories.length,
      stories: stories
    });
  } catch (error) {
    console.error('Error searching stories:', error.message);
    res.status(500).json({ success: false, message: 'Server error while searching stories' });
  }
};
