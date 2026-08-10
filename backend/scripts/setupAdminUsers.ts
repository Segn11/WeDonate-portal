import bcrypt from 'bcryptjs';
import { prisma } from '../src/prisma/client';

async function setupAdminUsers() {
  try {
    const passwordHash = await bcrypt.hash('admin123', 10);
    console.log('Generated hash for "admin123":', passwordHash);

    // Setup Kebele Admin
    const kebeleAdmin = await prisma.user.upsert({
      where: { email: 'kebeleadmin@adama.com' },
      update: {
        passwordHash,
        kebele: 'Kebele 05 (Bole)',
        woreda: 'Bole Sub-City Woreda',
        status: 'ACTIVE',
        isVerified: true,
      },
      create: {
        fullName: 'Kebele Admin',
        email: 'kebeleadmin@adama.com',
        phone: '+251910000000',
        role: 'KEBELE_ADMIN',
        passwordHash,
        kebele: 'Kebele 05 (Bole)',
        woreda: 'Bole Sub-City Woreda',
        city: 'Adama',
        isVerified: true,
        status: 'ACTIVE',
      },
    });

    console.log('\n✅ Kebele Admin configured:');
    console.log('Email:', kebeleAdmin.email);
    console.log('Kebele:', kebeleAdmin.kebele);
    console.log('Woreda:', kebeleAdmin.woreda);

    // Setup Woreda Admin
    const woredaAdmin = await prisma.user.upsert({
      where: { email: 'woredaadmin@adama.com' },
      update: {
        passwordHash,
        woreda: 'Bole Sub-City Woreda',
        status: 'ACTIVE',
        isVerified: true,
      },
      create: {
        fullName: 'Woreda Admin',
        email: 'woredaadmin@adama.com',
        phone: '+251920000000',
        role: 'WOREDA_ADMIN',
        passwordHash,
        woreda: 'Bole Sub-City Woreda',
        city: 'Adama',
        isVerified: true,
        status: 'ACTIVE',
      },
    });

    console.log('\n✅ Woreda Admin configured:');
    console.log('Email:', woredaAdmin.email);
    console.log('Woreda:', woredaAdmin.woreda);

    console.log('\n✅ All admin users setup complete!');
    console.log('Password for both: admin123');
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

setupAdminUsers();
