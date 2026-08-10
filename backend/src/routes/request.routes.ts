import { Router } from 'express';
import { RequestController } from '../controllers/request.controller';
import { authenticate, authorize } from '../middlewares/auth.middleware';

const router = Router();

// Public endpoints (no auth required for viewing)
router.get('/', RequestController.getAll);
router.get('/check-duplicate', RequestController.checkDuplicate);
router.get('/:id', RequestController.getById);

// Only BENEFICIARYs can create requests
router.post(
  '/',
  authenticate,
  authorize(['BENEFICIARY']),
  RequestController.create
);

// Only admin roles can update request status
router.patch(
  '/:id/status',
  authenticate,
  authorize(['KEBELE_ADMIN', 'WOREDA_ADMIN', 'CITY_ADMIN', 'SYSTEM_ADMIN']),
  RequestController.updateStatus
);

export default router;
