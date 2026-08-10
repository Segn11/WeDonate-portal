import { Router } from 'express';
import { AnalyticsController } from '../controllers/analytics.controller';
import { authenticate, authorize } from '../middlewares/auth.middleware';

const router = Router();

// All authenticated users can view analytics
router.get('/monthly-trends', authenticate, AnalyticsController.getMonthlyTrends);
router.get('/category-distribution', authenticate, AnalyticsController.getCategoryDistribution);
router.get('/overview-stats', authenticate, AnalyticsController.getOverviewStats);
router.get('/kebele-stats', authenticate, AnalyticsController.getKebeleStats);

export default router;
