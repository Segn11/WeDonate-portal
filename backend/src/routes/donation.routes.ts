import { Router } from 'express';
import { DonationController } from '../controllers/donation.controller';
import { authenticate, authorize } from '../middlewares/auth.middleware';

const router = Router();

// Public route - anyone can view donations for transparency
router.get('/', DonationController.getAll);

// Authenticated DONORs can create donations
router.post('/', authenticate, authorize(['DONOR']), DonationController.create);

// Guest donations (no authentication required)
router.post('/guest', DonationController.createGuest);

export default router;
