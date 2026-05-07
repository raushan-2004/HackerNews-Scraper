const mongoose = require('mongoose');

const storySchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    url: {
      type: String,
      required: true,
    },
    points: {
      type: Number,
      default: 0,
    },
    author: {
      type: String,
    },
    postedAt: {
      type: String, // String allows storing raw HN time format (e.g., "3 hours ago")
    },
  },
  {
    timestamps: true,
  }
);

const Story = mongoose.model('Story', storySchema);

module.exports = Story;
