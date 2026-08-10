import { prisma } from '../prisma/client';

export class NotificationService {
  static async getAll(userId: string) {
    return prisma.notification.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
  }

  static async create(data: {
    userId: string;
    title: string;
    message: string;
    type?: string;
    link?: string;
  }) {
    return prisma.notification.create({
      data: {
        userId: data.userId,
        title: data.title,
        message: data.message,
        type: data.type || 'INFO',
        link: data.link,
      },
    });
  }

  static async markAsRead(id: string) {
    return prisma.notification.update({
      where: { id },
      data: { read: true },
    });
  }

  static async markAllAsRead(userId: string) {
    return prisma.notification.updateMany({
      where: { userId, read: false },
      data: { read: true },
    });
  }

  static async delete(id: string) {
    return prisma.notification.delete({
      where: { id },
    });
  }

  static async getUnreadCount(userId: string) {
    return prisma.notification.count({
      where: { userId, read: false },
    });
  }
}
