import { Router } from 'express';
import { DistributionController } from '../controllers/distribution.controller';
import { authenticate, authorize } from '../middlewares/auth.middleware';

const router = Router();

// All authenticated users can view distributions
router.get('/', authenticate, DistributionController.getAll);

// Public verification endpoint (no auth required)
router.get('/verify/:code', DistributionController.verifyCode);

// Only KEBELE_ADMIN, CITY_ADMIN, and SYSTEM_ADMIN can create distributions
router.post(
  '/',
  authenticate,
  authorize(['KEBELE_ADMIN', 'CITY_ADMIN', 'SYSTEM_ADMIN']),
  DistributionController.create
);

// Initiate distribution (mark request as IN_DISTRIBUTION)
router.post(
  '/initiate/:requestId',
  authenticate,
  authorize(['KEBELE_ADMIN', 'CITY_ADMIN', 'SYSTEM_ADMIN']),
  DistributionController.initiateDistribution
);

// Confirm beneficiary receipt
router.post(
  '/confirm/:distributionId',
  authenticate,
  authorize(['KEBELE_ADMIN', 'CITY_ADMIN', 'SYSTEM_ADMIN']),
  DistributionController.confirmReceipt
);

export default router;
