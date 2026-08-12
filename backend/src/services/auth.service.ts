import bcrypt from 'bcryptjs';
import { prisma } from '../prisma/client';
import { generateToken } from '../utils/jwt';
import { UserRole } from '@prisma/client';
import { OAuth2Client } from 'google-auth-library';

export class AuthService {
  static async login(email: string, passwordHashInput?: string) {
    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    });

    if (!user) {
      throw { statusCode: 401, message: 'Account credentials not found' };
    }

    if (passwordHashInput && user.passwordHash) {
      const isMatch = await bcrypt.compare(passwordHashInput, user.passwordHash);
      if (!isMatch) {
        throw { statusCode: 401, message: 'Invalid password' };
      }
    }

    const token = generateToken({
      id: user.id,
      email: user.email,
      fullName: user.fullName,
      role: user.role,
      kebele: user.kebele,
      woreda: user.woreda,
    });

    return { token, user };
  }

  static async register(data: {
    fullName: string;
    email: string;
    phone: string;
    role: UserRole;
    password?: string;
    kebele?: string;
    woreda?: string;
    nationalIdNumber?: string;
  }) {
    if (!data.email || !data.fullName) {
      throw { statusCode: 400, message: 'Email and fullName are required' };
    }

    const existing = await prisma.user.findUnique({
      where: { email: data.email.toLowerCase() },
    });

    if (existing) {
      throw { statusCode: 400, message: 'User with this email already exists' };
    }

    let passwordHash = null;
    if (data.password) {
      passwordHash = await bcrypt.hash(data.password, 10);
    }

    const isVerified = data.role === 'DONOR';
    const status = isVerified ? 'ACTIVE' : 'PENDING_VERIFICATION';

    const user = await prisma.user.create({
      data: {
        fullName: data.fullName,
        email: data.email.toLowerCase(),
        phone: data.phone,
        role: data.role,
        passwordHash,
        kebele: data.kebele,
        woreda: data.woreda,
        nationalIdNumber: data.nationalIdNumber,
        isVerified,
        status,
      },
    });

    const token = generateToken({
      id: user.id,
      email: user.email,
      fullName: user.fullName,
      role: user.role,
      kebele: user.kebele,
      woreda: user.woreda,
    });

    return { token, user };
  }

  static async googleAuth(data: {
    idToken: string;
    role?: UserRole;
  }) {
    console.log('Google Auth - Starting verification...');
    console.log('Google Client ID:', process.env.GOOGLE_CLIENT_ID);
    console.log('Google Client Secret:', process.env.GOOGLE_CLIENT_SECRET ? 'Set' : 'Not set');

    const client = new OAuth2Client(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET
    );

    try {
      const ticket = await client.verifyIdToken({
        idToken: data.idToken,
        audience: process.env.GOOGLE_CLIENT_ID,
      });

      const payload = ticket.getPayload();
      console.log('Google Token Payload:', payload);
      
      if (!payload || !payload.email) {
        throw { statusCode: 400, message: 'Invalid Google token payload' };
      }

      const googleId = payload.sub;
      const email = payload.email.toLowerCase();
      const fullName = payload.name || 'Google User';
      const avatarUrl = payload.picture;

      let user = await prisma.user.findUnique({
        where: { email },
      });

      if (user) {
        user = await prisma.user.update({
          where: { id: user.id },
          data: {
            googleConnected: true,
            googleId: googleId,
            avatarUrl: user.avatarUrl || avatarUrl,
          },
        });
      } else {
        const isVerified = data.role === 'DONOR';
        const status = isVerified ? 'ACTIVE' : 'PENDING_VERIFICATION';

        user = await prisma.user.create({
          data: {
            fullName,
            email,
            phone: '+251900000000',
            role: data.role || 'DONOR',
            avatarUrl,
            googleConnected: true,
            googleId,
            isVerified,
            status,
          },
        });
      }

      const token = generateToken({
        id: user.id,
        email: user.email,
        fullName: user.fullName,
        role: user.role,
        kebele: user.kebele,
        woreda: user.woreda,
      });

      return { token, user };
    } catch (error: any) {
      console.error('Google Auth Error Details:', error);
      throw { statusCode: 401, message: 'Google token verification failed' };
    }
  }

  static async changePassword(userId: string, currentPassword: string, newPassword: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw { statusCode: 404, message: 'User not found' };
    }

    if (!user.passwordHash) {
      throw { statusCode: 400, message: 'User does not have a password set' };
    }

    const isMatch = await bcrypt.compare(currentPassword, user.passwordHash);
    if (!isMatch) {
      throw { statusCode: 401, message: 'Current password is incorrect' };
    }

    const newPasswordHash = await bcrypt.hash(newPassword, 10);

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { passwordHash: newPasswordHash },
    });

    return { user: updatedUser };
  }
}
