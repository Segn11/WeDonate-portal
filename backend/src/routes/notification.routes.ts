import { Router } from 'express';
import { NotificationController } from '../controllers/notification.controller';
import { authenticate } from '../middlewares/auth.middleware';

const router = Router();

// All authenticated users can access their notifications
router.get('/', authenticate, NotificationController.getAll);
router.get('/unread-count', authenticate, NotificationController.getUnreadCount);

// Mark notifications as read
router.patch('/:id/read', authenticate, NotificationController.markAsRead);
router.patch('/mark-all-read', authenticate, NotificationController.markAllAsRead);

// Delete notification
router.delete('/:id', authenticate, NotificationController.delete);

// Create notification (typically called by other services internally)
router.post('/', authenticate, NotificationController.create);

export default router;
