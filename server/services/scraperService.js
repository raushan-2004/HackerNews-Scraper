import axios from 'axios';
import * as cheerio from 'cheerio';
import Story from '../models/Story.js';

export const scrapeHackerNews = async () => {
  try {
    console.log('Starting HackerNews scrape...');
    const { data } = await axios.get('https://news.ycombinator.com/');
    const $ = cheerio.load(data);
    
    const stories = [];
    
    // HackerNews uses tr.athing for the main story row
    $('.athing').slice(0, 10).each((index, element) => {
      const titleElement = $(element).find('.titleline > a').first();
      const title = titleElement.text();
      let url = titleElement.attr('href');
      
      // If URL is relative (e.g. "item?id=..."), prepend the base URL
      if (url && !url.startsWith('http')) {
        url = `https://news.ycombinator.com/${url}`;
      }
      
      // The subtext row contains points, author, and time
      const subtextRow = $(element).next();
      const pointsText = subtextRow.find('.score').text() || '0 points';
      const points = parseInt(pointsText.replace(/[^0-9]/g, '')) || 0;
      const author = subtextRow.find('.hnuser').text() || 'Unknown';
      const postedAt = subtextRow.find('.age').attr('title') || subtextRow.find('.age').text() || 'Unknown';
      
      stories.push({
        title,
        url,
        points,
        author,
        postedAt
      });
    });

    console.log(`Scraped ${stories.length} stories. Saving to database...`);

    // Upsert stories to avoid duplicates (using url as unique identifier)
    let savedCount = 0;
    for (const storyData of stories) {
      if (storyData.url && storyData.title) {
        await Story.findOneAndUpdate(
          { url: storyData.url },      // Find by URL
          { $set: storyData },         // Update fields
          { upsert: true, returnDocument: 'after' }  // Create if doesn't exist
        );
        savedCount++;
      }
    }
    
    console.log(`Successfully saved/updated ${savedCount} stories.`);
    return stories;
    
  } catch (error) {
    console.error('Error scraping HackerNews:', error.message);
    throw error;
  }
};
