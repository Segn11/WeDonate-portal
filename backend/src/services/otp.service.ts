import crypto from 'crypto';
import { prisma } from '../prisma/client';

const OTP_EXPIRY_MINUTES = 5;
const OTP_LENGTH = 6;

export class OtpService {
  /**
   * Generate a 6-digit OTP code
   */
  static generateOtp(): string {
    const otp = crypto.randomInt(0, 1000000).toString().padStart(OTP_LENGTH, '0');
    return otp;
  }

  /**
   * Hash OTP for secure storage
   */
  static hashOtp(otp: string): string {
    return crypto.createHash('sha256').update(otp).digest('hex');
  }

  /**
   * Create and store OTP for a user
   */
  static async createOtp(userId: string): Promise<{ otp: string; expiresAt: Date }> {
    // Delete any existing unused OTPs for this user
    await prisma.otp.deleteMany({
      where: {
        userId,
        used: false,
        expiresAt: {
          gt: new Date(),
        },
      },
    });

    const otp = this.generateOtp();
    const otpHash = this.hashOtp(otp);
    const expiresAt = new Date(Date.now() + OTP_EXPIRY_MINUTES * 60 * 1000);

    await prisma.otp.create({
      data: {
        userId,
        otpHash,
        expiresAt,
      },
    });

    return { otp, expiresAt };
  }

  /**
   * Verify OTP code
   */
  static async verifyOtp(userId: string, otp: string): Promise<boolean> {
    const otpHash = this.hashOtp(otp);

    const otpRecord = await prisma.otp.findFirst({
      where: {
        userId,
        otpHash,
        used: false,
        expiresAt: {
          gt: new Date(),
        },
      },
    });

    if (!otpRecord) {
      return false;
    }

    // Mark OTP as used
    await prisma.otp.update({
      where: { id: otpRecord.id },
      data: { used: true },
    });

    return true;
  }

  /**
   * Clean up expired OTPs (can be run as a cron job)
   */
  static async cleanupExpiredOtps(): Promise<void> {
    await prisma.otp.deleteMany({
      where: {
        expiresAt: {
          lt: new Date(),
        },
      },
    });
  }
}
