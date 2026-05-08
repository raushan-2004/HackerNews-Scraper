import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import scraperRoutes from './routes/scraperRoutes.js';
import storyRoutes from './routes/storyRoutes.js';
import { notFound, errorHandler } from './middleware/errorMiddleware.js';
import { scrapeHackerNews } from './services/scraperService.js';

// Load env vars
dotenv.config();

// Connect to database
connectDB().then(() => {
  // Automatically run the scraper when the server starts and DB connects
  scrapeHackerNews().catch(err => console.error("Initial scrape failed:", err.message));
});

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/scrape', scraperRoutes);
app.use('/api/stories', storyRoutes);

app.get('/api', (req, res) => {
  res.json({ message: 'HackerNews Scraper API is running...' });
});

app.get('/', (req, res) => {
  res.send('API is running...');
});

// Error Handling Middlewares (Must be defined after routes)
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
