import { Request, Response, NextFunction } from 'express';
import { OtpService } from '../services/otp.service';
import { EmailService } from '../services/email.service';
import { prisma } from '../prisma/client';
import bcrypt from 'bcryptjs';
import { sendSuccess, sendError } from '../utils/response';

export class OtpController {
  /**
   * Request OTP for password reset
   */
  static async requestOtp(req: Request, res: Response, next: NextFunction) {
    try {
      const { email } = req.body;

      if (!email) {
        return res.status(400).json({ 
          statusCode: 400, 
          message: 'Email is required' 
        });
      }

      // Find user by email
      const user = await prisma.user.findUnique({
        where: { email },
      });

      if (!user) {
        // Don't reveal if user exists for security
        return res.status(200).json({ 
          statusCode: 200, 
          message: 'If an account exists with this email, you will receive an OTP shortly' 
        });
      }

      // Generate OTP
      const { otp, expiresAt } = await OtpService.createOtp(user.id);

      // Send OTP via email
      await EmailService.sendOtpEmail(email, otp, expiresAt);

      return sendSuccess(res, null, 'OTP sent successfully to your email');
    } catch (error) {
      next(error);
    }
  }

  /**
   * Verify OTP code
   */
  static async verifyOtp(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, otp } = req.body;

      if (!email || !otp) {
        return res.status(400).json({ 
          statusCode: 400, 
          message: 'Email and OTP are required' 
        });
      }

      // Find user by email
      const user = await prisma.user.findUnique({
        where: { email },
      });

      if (!user) {
        return res.status(404).json({ 
          statusCode: 404, 
          message: 'User not found' 
        });
      }

      // Verify OTP
      const isValid = await OtpService.verifyOtp(user.id, otp);

      if (!isValid) {
        return res.status(400).json({ 
          statusCode: 400, 
          message: 'Invalid or expired OTP' 
        });
      }

      return sendSuccess(res, { userId: user.id }, 'OTP verified successfully');
    } catch (error) {
      next(error);
    }
  }

  /**
   * Reset password with verified OTP
   */
  static async resetPassword(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, otp, newPassword } = req.body;

      if (!email || !otp || !newPassword) {
        return res.status(400).json({ 
          statusCode: 400, 
          message: 'Email, OTP, and new password are required' 
        });
      }

      if (newPassword.length < 6) {
        return res.status(400).json({ 
          statusCode: 400, 
          message: 'Password must be at least 6 characters long' 
        });
      }

      // Find user by email
      const user = await prisma.user.findUnique({
        where: { email },
      });

      if (!user) {
        return res.status(404).json({ 
          statusCode: 404, 
          message: 'User not found' 
        });
      }

      // Verify OTP
      const isValid = await OtpService.verifyOtp(user.id, otp);

      if (!isValid) {
        return res.status(400).json({ 
          statusCode: 400, 
          message: 'Invalid or expired OTP' 
        });
      }

      // Hash new password
      const passwordHash = await bcrypt.hash(newPassword, 10);

      // Update user password
      await prisma.user.update({
        where: { id: user.id },
        data: { passwordHash },
      });

      return sendSuccess(res, null, 'Password reset successfully');
    } catch (error) {
      next(error);
    }
  }
}
