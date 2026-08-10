import { Router } from 'express';
import { UserController } from '../controllers/user.controller';
import { authenticate, authorize } from '../middlewares/auth.middleware';

const router = Router();

// Get current user profile
router.get('/me', authenticate, UserController.getMe);

// Update current user profile
router.patch('/me', authenticate, UserController.updateProfile);

// Get user by ID (own profile or admin)
router.get('/:id', authenticate, UserController.getUserById);

// Update user by ID (own profile or admin)
router.patch('/:id', authenticate, UserController.updateUserById);

// Delete user (admin only)
router.delete(
  '/:id',
  authenticate,
  authorize(['CITY_ADMIN', 'SYSTEM_ADMIN']),
  UserController.deleteUser
);

// Get all users (admin only)
router.get(
  '/',
  authenticate,
  authorize(['CITY_ADMIN', 'SYSTEM_ADMIN']),
  UserController.getAllUsers
);

// Update user status (admin only)
router.patch(
  '/:id/status',
  authenticate,
  authorize(['CITY_ADMIN', 'SYSTEM_ADMIN']),
  UserController.updateUserStatus
);

// Update user role (SYSTEM_ADMIN only)
router.patch(
  '/:id/role',
  authenticate,
  authorize(['SYSTEM_ADMIN']),
  UserController.updateUserRole
);

// Verify beneficiary (KEBELE_ADMIN and above)
router.patch(
  '/:id/verify',
  authenticate,
  authorize(['KEBELE_ADMIN', 'WOREDA_ADMIN', 'CITY_ADMIN', 'SYSTEM_ADMIN']),
  UserController.verifyBeneficiary
);

// Get beneficiaries by kebele (admin only)
router.get(
  '/beneficiaries/by-kebele',
  authenticate,
  authorize(['KEBELE_ADMIN', 'WOREDA_ADMIN', 'CITY_ADMIN', 'SYSTEM_ADMIN']),
  UserController.getBeneficiariesByKebele
);

export default router;
