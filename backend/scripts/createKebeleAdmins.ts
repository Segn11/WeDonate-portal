import { prisma } from '../src/prisma/client';
import * as bcrypt from 'bcryptjs';

const DEFAULT_PASSWORD = 'KebeleAdmin@2026';

// List of kebeles in Adama City with full names to match beneficiary requests
const ADAMA_KEBELES = [
  { code: '01', name: 'Kebele 01' },
  { code: '02', name: 'Kebele 02' },
  { code: '03', name: 'Kebele 03' },
  { code: '04', name: 'Kebele 04' },
  { code: '05', name: 'Kebele 05 (Bole)' },
  { code: '06', name: 'Kebele 06' },
  { code: '07', name: 'Kebele 07 (Melka Adama)' },
  { code: '08', name: 'Kebele 08 (Demdela)' },
  { code: '09', name: 'Kebele 09 (Goro)' },
  { code: '10', name: 'Kebele 10' },
  { code: '11', name: 'Kebele 11' },
  { code: '12', name: 'Kebele 12' },
  { code: '13', name: 'Kebele 13' },
  { code: '14', name: 'Kebele 14' },
  { code: '15', name: 'Kebele 15' },
  { code: '16', name: 'Kebele 16' },
  { code: '17', name: 'Kebele 17' },
  { code: '18', name: 'Kebele 18' },
];

async function createKebeleAdmins() {
  console.log('Creating kebele admin accounts...\n');

  const hashedPassword = await bcrypt.hash(DEFAULT_PASSWORD, 10);

  for (const kebeleData of ADAMA_KEBELES) {
    const email = `kebele${kebeleData.code}@adama.gov.et`;

    try {
      // Check if admin already exists
      const existingAdmin = await prisma.user.findUnique({
        where: { email },
      });

      if (existingAdmin) {
        console.log(`✓ Admin for Kebele ${kebeleData.name} already exists: ${email}`);
        continue;
      }

      // Create kebele admin
      const admin = await prisma.user.create({
        data: {
          email,
          passwordHash: hashedPassword,
          role: 'KEBELE_ADMIN',
          fullName: `${kebeleData.name} Admin`,
          phone: `+251911000${kebeleData.code.padStart(2, '0')}`,
          kebele: kebeleData.name,
          isVerified: true,
          status: 'ACTIVE',
        },
      });

      console.log(`✓ Created admin for Kebele ${kebeleData.name}: ${email}`);
    } catch (error) {
      console.error(`✗ Failed to create admin for Kebele ${kebeleData.name}:`, error);
    }
  }

  console.log('\n✅ Kebele admin creation completed!');
  console.log(`\nDefault password for all kebele admins: ${DEFAULT_PASSWORD}`);
  console.log('Please change passwords after first login.\n');
}

createKebeleAdmins()
  .catch((error) => {
    console.error('Error creating kebele admins:', error);
    process.exit(1);
  })
  .finally(() => {
    prisma.$disconnect();
  });
