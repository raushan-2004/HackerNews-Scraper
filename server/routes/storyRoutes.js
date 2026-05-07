import express from 'express';
import { getStories, getStoryById, toggleBookmark } from '../controllers/storyController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/').get(getStories);
router.route('/:id').get(getStoryById);
router.route('/:id/bookmark').post(protect, toggleBookmark);

export default router;
