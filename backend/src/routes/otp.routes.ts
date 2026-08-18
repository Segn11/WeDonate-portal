import { Router } from 'express';
import { OtpController } from '../controllers/otp.controller';
import { rateLimiter } from '../middleware/rateLimiter';

const router = Router();

/**
 * @route   POST /api/otp/request
 * @desc    Request OTP for password reset
 * @access  Public
 */
router.post('/request', rateLimiter(5, 15), OtpController.requestOtp);

/**
 * @route   POST /api/otp/verify
 * @desc    Verify OTP code
 * @access  Public
 */
router.post('/verify', rateLimiter(10, 15), OtpController.verifyOtp);

/**
 * @route   POST /api/otp/reset-password
 * @desc    Reset password with verified OTP
 * @access  Public
 */
router.post('/reset-password', rateLimiter(3, 60), OtpController.resetPassword);

export default router;
