import { PrismaClient } from '@prisma/client';
import { NotificationService } from '../src/services/notification.service';

const prisma = new PrismaClient();

async function main() {
  console.log('=== Creating Test Notifications for Users ===\n');

  // Get all users
  const users = await prisma.user.findMany();

  console.log(`Found ${users.length} users`);

  // Create a notification for each user
  for (const user of users) {
    const notification = await NotificationService.create({
      userId: user.id,
      title: 'Welcome to Adama Support System',
      message: `Hello ${user.fullName}, the notification system is now live!`,
      type: 'INFO',
    });

    console.log(`✅ Created notification for ${user.fullName} (${user.role})`);
  }

  console.log('\n✅ Test notifications created for all users');
  console.log('Login as any user to see the notification badge on the bell icon');
}

main()
  .catch((e) => console.error(e))
  .finally(() => prisma.$disconnect());
