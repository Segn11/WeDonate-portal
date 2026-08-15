import { Request, Response, NextFunction } from 'express';
import { AuthService } from '../services/auth.service';
import { sendSuccess, sendError } from '../utils/response';

export class AuthController {
  static async login(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, password } = req.body;
      const result = await AuthService.login(email, password);
      return sendSuccess(res, result, 'Login successful');
    } catch (error: any) {
      if (error.statusCode) {
        return sendError(res, error.message, error.statusCode);
      }
      next(error);
    }
  }

  static async register(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await AuthService.register(req.body);
      return sendSuccess(res, result, 'Registration successful', 201);
    } catch (error: any) {
      if (error.statusCode) {
        return sendError(res, error.message, error.statusCode);
      }
      next(error);
    }
  }

  static async googleAuth(req: Request, res: Response, next: NextFunction) {
    try {
      const { idToken, role } = req.body;
      const result = await AuthService.googleAuth({ idToken, role });
      return sendSuccess(res, result, 'Google authentication successful');
    } catch (error: any) {
      if (error.statusCode) {
        return sendError(res, error.message, error.statusCode);
      }
      next(error);
    }
  }

  static async me(req: Request, res: Response, next: NextFunction) {
    try {
      return sendSuccess(res, req.user, 'Current user profile fetched');
    } catch (error) {
      next(error);
    }
  }

  static async logout(req: Request, res: Response, next: NextFunction) {
    try {
      return sendSuccess(res, null, 'Logout successful');
    } catch (error) {
      next(error);
    }
  }

  static async changePassword(req: Request, res: Response, next: NextFunction) {
    try {
      const { currentPassword, newPassword } = req.body;
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({ success: false, message: 'Unauthorized' });
      }
      const result = await AuthService.changePassword(userId, currentPassword, newPassword);
      return sendSuccess(res, result, 'Password changed successfully');
    } catch (error: any) {
      if (error.statusCode) {
        return sendError(res, error.message, error.statusCode);
      }
      next(error);
    }
  }
}
