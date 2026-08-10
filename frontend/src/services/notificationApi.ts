const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api/v1';

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: string;
  read: boolean;
  link?: string;
  createdAt: string;
}

export const notificationApi = {
  async getAllNotifications(): Promise<Notification[]> {
    const response = await fetch(`${API_BASE_URL}/notifications`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('auth_token')}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch notifications');
    }

    const data = await response.json();
    return data.data || data;
  },

  async getUnreadCount(): Promise<number> {
    const response = await fetch(`${API_BASE_URL}/notifications/unread-count`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('auth_token')}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch unread count');
    }

    const data = await response.json();
    return data.data?.count || 0;
  },

  async markAsRead(id: string): Promise<Notification> {
    const response = await fetch(`${API_BASE_URL}/notifications/${id}/read`, {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('auth_token')}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to mark notification as read');
    }

    const data = await response.json();
    return data.data || data;
  },

  async markAllAsRead(): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/notifications/mark-all-read`, {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('auth_token')}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to mark all notifications as read');
    }
  },

  async deleteNotification(id: string): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/notifications/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('auth_token')}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to delete notification');
    }
  },

  async createNotification(data: {
    userId: string;
    title: string;
    message: string;
    type?: string;
    link?: string;
  }): Promise<Notification> {
    const response = await fetch(`${API_BASE_URL}/notifications`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('auth_token')}`,
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error('Failed to create notification');
    }

    const result = await response.json();
    return result.data || result;
  },
};
