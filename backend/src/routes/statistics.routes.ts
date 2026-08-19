import { Router } from 'express';
import { StatisticsController } from '../controllers/statistics.controller';

const router = Router();

// Public statistics endpoint (no authentication required)
router.get('/public', StatisticsController.getPublicStats);

export default router;
