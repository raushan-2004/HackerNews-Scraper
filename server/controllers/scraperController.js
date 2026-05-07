import { scrapeHackerNews } from '../services/scraperService.js';

// @desc    Trigger HackerNews Scrape manually
// @route   POST /api/scrape
// @access  Public (or could be protected)
export const triggerScrape = async (req, res) => {
  try {
    const stories = await scrapeHackerNews();
    res.status(200).json({
      message: 'Scraping completed successfully',
      count: stories.length,
      data: stories
    });
  } catch (error) {
    console.error('Scrape trigger failed:', error.message);
    res.status(500).json({ message: 'Server error during scraping' });
  }
};
