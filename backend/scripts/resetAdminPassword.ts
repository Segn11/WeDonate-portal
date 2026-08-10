import bcrypt from 'bcryptjs';
import { prisma } from '../src/prisma/client';

async function resetAdminPassword() {
  const email = 'kebeleadmin@adama.com';
  const newPassword = 'admin123';

  try {
    // Hash the new password
    const passwordHash = await bcrypt.hash(newPassword, 10);
    console.log('Generated hash for "admin123":', passwordHash);

    // Find the user
    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    });

    if (!user) {
      console.log('User not found. Creating new admin user...');
      
      const newUser = await prisma.user.create({
        data: {
          fullName: 'Kebele Admin',
          email: email.toLowerCase(),
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
      
      console.log('Created new admin user:', newUser.email);
    } else {
      console.log('Found user:', user.email, 'Role:', user.role, 'Status:', user.status);
      console.log('Current Kebele:', user.kebele, 'Current Woreda:', user.woreda);
      
      // Update the user
      const updated = await prisma.user.update({
        where: { email: email.toLowerCase() },
        data: {
          passwordHash,
          status: 'ACTIVE',
          isVerified: true,
          kebele: 'Kebele 05 (Bole)',
          woreda: 'Bole Sub-City Woreda',
        },
      });
      
      console.log('Updated user password hash and location');
      console.log('Email:', updated.email);
      console.log('Kebele:', updated.kebele);
      console.log('Woreda:', updated.woreda);
      console.log('Status:', updated.status);
      console.log('Is Verified:', updated.isVerified);
    }

    console.log('\n✅ Admin credentials reset successfully!');
    console.log('Email:', email);
    console.log('Password:', newPassword);
    console.log('Kebele: Kebele 05 (Bole)');
    console.log('Woreda: Bole Sub-City Woreda');
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

resetAdminPassword();
