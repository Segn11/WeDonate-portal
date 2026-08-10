import { Router } from 'express';
import { DonationController } from '../controllers/donation.controller';
import { authenticate, authorize } from '../middlewares/auth.middleware';

const router = Router();

// All authenticated users can view donations
router.get('/', authenticate, DonationController.getAll);

// Authenticated DONORs can create donations
router.post('/', authenticate, authorize(['DONOR']), DonationController.create);

// Guest donations (no authentication required)
router.post('/guest', DonationController.createGuest);

export default router;
