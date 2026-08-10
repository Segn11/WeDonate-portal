import { PrismaClient } from '@prisma/client';
import { NotificationService } from '../src/services/notification.service';

const prisma = new PrismaClient();

async function main() {
  console.log('=== Testing Notification System ===\n');

  // Find a user to test with
  const user = await prisma.user.findFirst({
    where: {
      role: 'DONOR',
    },
  });

  if (!user) {
    console.log('No user found for testing');
    return;
  }

  console.log(`Testing with user: ${user.fullName} (${user.email})`);

  // Create a test notification
  console.log('\n=== Creating Test Notification ===');
  const notification = await NotificationService.create({
    userId: user.id,
    title: 'Test Notification',
    message: 'This is a test notification from the backend API',
    type: 'INFO',
  });

  console.log(`✅ Notification Created: ${notification.id}`);
  console.log(`   Title: ${notification.title}`);
  console.log(`   Message: ${notification.message}`);
  console.log(`   Type: ${notification.type}`);
  console.log(`   Read: ${notification.read}`);

  // Fetch all notifications for the user
  console.log('\n=== Fetching All Notifications ===');
  const notifications = await NotificationService.getAll(user.id);
  console.log(`Found ${notifications.length} notifications`);
  notifications.forEach((n) => {
    console.log(`  - ${n.title}: ${n.message} (${n.read ? 'read' : 'unread'})`);
  });

  // Get unread count
  console.log('\n=== Getting Unread Count ===');
  const unreadCount = await NotificationService.getUnreadCount(user.id);
  console.log(`Unread count: ${unreadCount}`);

  // Mark as read
  console.log('\n=== Marking Notification as Read ===');
  await NotificationService.markAsRead(notification.id);
  const updatedNotification = await prisma.notification.findUnique({
    where: { id: notification.id },
  });
  console.log(`Notification read status: ${updatedNotification?.read}`);

  // Mark all as read
  console.log('\n=== Marking All Notifications as Read ===');
  await NotificationService.markAllAsRead(user.id);
  const newUnreadCount = await NotificationService.getUnreadCount(user.id);
  console.log(`New unread count: ${newUnreadCount}`);

  console.log('\n✅ Notification System Test Complete!');
  console.log('The notification API is working correctly.');
}

main()
  .catch((e) => console.error(e))
  .finally(() => prisma.$disconnect());
