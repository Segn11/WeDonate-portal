import { Router } from 'express';
import { AuditController } from '../controllers/audit.controller';
import { authenticate, authorize } from '../middlewares/auth.middleware';

const router = Router();

// Only CITY_ADMIN and SYSTEM_ADMIN can view all audit logs
router.get(
  '/',
  authenticate,
  authorize(['CITY_ADMIN', 'SYSTEM_ADMIN']),
  AuditController.getAll
);

// Only CITY_ADMIN and SYSTEM_ADMIN can view specific audit logs
router.get(
  '/:id',
  authenticate,
  authorize(['CITY_ADMIN', 'SYSTEM_ADMIN']),
  AuditController.getById
);

// Only CITY_ADMIN and SYSTEM_ADMIN can view user-specific audit logs
router.get(
  '/user/:userId',
  authenticate,
  authorize(['CITY_ADMIN', 'SYSTEM_ADMIN']),
  AuditController.getByUserId
);

// Only SYSTEM_ADMIN can create audit logs (typically done internally)
router.post(
  '/',
  authenticate,
  authorize(['SYSTEM_ADMIN']),
  AuditController.create
);

export default router;
