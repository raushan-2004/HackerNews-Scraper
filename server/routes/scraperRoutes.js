import express from 'express';
import { triggerScrape } from '../controllers/scraperController.js';

const router = express.Router();

router.post('/', triggerScrape);

export default router;
