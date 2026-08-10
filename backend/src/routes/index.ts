import { Router } from 'express';
import authRoutes from './auth.routes';
import requestRoutes from './request.routes';
import donationRoutes from './donation.routes';
import distributionRoutes from './distribution.routes';
import metaRoutes from './meta.routes';
import userRoutes from './user.routes';
import notificationRoutes from './notification.routes';
import analyticsRoutes from './analytics.routes';

const router = Router();

router.use('/auth', authRoutes);
router.use('/requests', requestRoutes);
router.use('/donations', donationRoutes);
router.use('/distributions', distributionRoutes);
router.use('/meta', metaRoutes);
router.use('/users', userRoutes);
router.use('/notifications', notificationRoutes);
router.use('/analytics', analyticsRoutes);

export default router;
