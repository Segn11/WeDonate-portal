import { Router } from 'express';
import { AuthController } from '../controllers/auth.controller';
import { authenticate } from '../middlewares/auth.middleware';

const router = Router();

router.post('/login', AuthController.login);
router.post('/register', AuthController.register);
router.post('/google', AuthController.googleAuth);
router.get('/me', authenticate, AuthController.me);
router.post('/logout', authenticate, AuthController.logout);
router.post('/change-password', authenticate, AuthController.changePassword);

export default router;
