import bcrypt from 'bcryptjs';
import { prisma } from '../src/prisma/client';

async function setupAdminUsers() {
  try {
    const commonPassword = 'Admin@123';
    const passwordHash = await bcrypt.hash(commonPassword, 10);
    console.log('Generated hash for "' + commonPassword + '":', passwordHash);

    // Setup System Admin
    const systemAdmin = await prisma.user.upsert({
      where: { email: 'systemadmin@adama.gov.et' },
      update: {
        passwordHash,
        status: 'ACTIVE',
        isVerified: true,
      },
      create: {
        fullName: 'System Administrator',
        email: 'systemadmin@adama.gov.et',
        phone: '+251900000000',
        role: 'SYSTEM_ADMIN',
        passwordHash,
        city: 'Adama',
        isVerified: true,
        status: 'ACTIVE',
      },
    });

    console.log('\n✅ System Admin configured:');
    console.log('Email:', systemAdmin.email);
    console.log('Role:', systemAdmin.role);

    // Setup City Admin
    const cityAdmin = await prisma.user.upsert({
      where: { email: 'cityadmin@adama.gov.et' },
      update: {
        passwordHash,
        status: 'ACTIVE',
        isVerified: true,
      },
      create: {
        fullName: 'City Administrator',
        email: 'cityadmin@adama.gov.et',
        phone: '+251901000000',
        role: 'CITY_ADMIN',
        passwordHash,
        city: 'Adama',
        isVerified: true,
        status: 'ACTIVE',
      },
    });

    console.log('\n✅ City Admin configured:');
    console.log('Email:', cityAdmin.email);
    console.log('Role:', cityAdmin.role);

    // Setup Woreda Admin
    const woredaAdmin = await prisma.user.upsert({
      where: { email: 'woredaadmin@adama.gov.et' },
      update: {
        passwordHash,
        woreda: 'Bole Sub-City Woreda',
        status: 'ACTIVE',
        isVerified: true,
      },
      create: {
        fullName: 'Woreda Administrator',
        email: 'woredaadmin@adama.gov.et',
        phone: '+251902000000',
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
    console.log('Role:', woredaAdmin.role);
    console.log('Woreda:', woredaAdmin.woreda);

    // Setup Kebele Admin
    const kebeleAdmin = await prisma.user.upsert({
      where: { email: 'kebeleadmin@adama.gov.et' },
      update: {
        passwordHash,
        kebele: 'Kebele 05 (Bole)',
        woreda: 'Bole Sub-City Woreda',
        status: 'ACTIVE',
        isVerified: true,
      },
      create: {
        fullName: 'Kebele Administrator',
        email: 'kebeleadmin@adama.gov.et',
        phone: '+251903000000',
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
    console.log('Role:', kebeleAdmin.role);
    console.log('Kebele:', kebeleAdmin.kebele);
    console.log('Woreda:', kebeleAdmin.woreda);

    console.log('\n✅ All admin users setup complete!');
    console.log('Common password for all administrators:', commonPassword);
    console.log('\nAdmin Accounts:');
    console.log('1. System Admin: systemadmin@adama.gov.et');
    console.log('2. City Admin: cityadmin@adama.gov.et');
    console.log('3. Woreda Admin: woredaadmin@adama.gov.et');
    console.log('4. Kebele Admin: kebeleadmin@adama.gov.et');
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

setupAdminUsers();
