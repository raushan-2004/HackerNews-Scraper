import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import scraperRoutes from './routes/scraperRoutes.js';
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

app.get('/', (req, res) => {
  res.send('API is running...');
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
