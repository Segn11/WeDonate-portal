import { prisma } from '../src/prisma/client';

async function verifyKebeleAdmins() {
  console.log('Verifying kebele admin accounts...\n');

  const kebeleAdmins = await prisma.user.findMany({
    where: { role: 'KEBELE_ADMIN' },
    select: {
      id: true,
      email: true,
      fullName: true,
      kebele: true,
      phone: true,
      status: true,
      isVerified: true,
      createdAt: true,
    },
    orderBy: { kebele: 'asc' },
  });

  console.log(`Found ${kebeleAdmins.length} kebele admin accounts:\n`);

  kebeleAdmins.forEach((admin) => {
    console.log(`Kebele ${admin.kebele}:`);
    console.log(`  Email: ${admin.email}`);
    console.log(`  Name: ${admin.fullName}`);
    console.log(`  Phone: ${admin.phone}`);
    console.log(`  Status: ${admin.status}`);
    console.log(`  Verified: ${admin.isVerified ? 'Yes' : 'No'}`);
    console.log(`  Created: ${admin.createdAt.toISOString()}`);
    console.log('');
  });

  console.log('✅ Verification completed!');
}

verifyKebeleAdmins()
  .catch((error) => {
    console.error('Error verifying kebele admins:', error);
    process.exit(1);
  })
  .finally(() => {
    prisma.$disconnect();
  });
