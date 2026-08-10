import { Request, Response, NextFunction } from 'express';
import { NotificationService } from '../services/notification.service';
import { sendSuccess } from '../utils/response';

export class NotificationController {
  static async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      const notifications = await NotificationService.getAll(userId);
      return sendSuccess(res, notifications, 'Fetched notifications');
    } catch (error) {
      next(error);
    }
  }

  static async create(req: Request, res: Response, next: NextFunction) {
    try {
      const notification = await NotificationService.create(req.body);
      return sendSuccess(res, notification, 'Notification created', 201);
    } catch (error) {
      next(error);
    }
  }

  static async markAsRead(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const notification = await NotificationService.markAsRead(id);
      return sendSuccess(res, notification, 'Notification marked as read');
    } catch (error) {
      next(error);
    }
  }

  static async markAllAsRead(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      await NotificationService.markAllAsRead(userId);
      return sendSuccess(res, null, 'All notifications marked as read');
    } catch (error) {
      next(error);
    }
  }

  static async delete(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      await NotificationService.delete(id);
      return sendSuccess(res, null, 'Notification deleted');
    } catch (error) {
      next(error);
    }
  }

  static async getUnreadCount(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      const count = await NotificationService.getUnreadCount(userId);
      return sendSuccess(res, { count }, 'Fetched unread count');
    } catch (error) {
      next(error);
    }
  }
}
