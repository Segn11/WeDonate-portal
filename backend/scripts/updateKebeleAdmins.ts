import { prisma } from '../src/prisma/client';

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

async function updateKebeleAdmins() {
  console.log('Updating kebele admin accounts with full kebele names...\n');

  for (const kebeleData of ADAMA_KEBELES) {
    const email = `kebele${kebeleData.code}@adama.gov.et`;

    try {
      // Find existing admin
      const existingAdmin = await prisma.user.findUnique({
        where: { email },
      });

      if (!existingAdmin) {
        console.log(`✗ Admin for Kebele ${kebeleData.name} not found: ${email}`);
        continue;
      }

      // Update kebele field to use full name
      const updatedAdmin = await prisma.user.update({
        where: { email },
        data: {
          kebele: kebeleData.name,
          fullName: `${kebeleData.name} Admin`,
        },
      });

      console.log(`✓ Updated admin for Kebele ${kebeleData.name}: ${email}`);
      console.log(`  Old kebele: "${existingAdmin.kebele}"`);
      console.log(`  New kebele: "${updatedAdmin.kebele}"`);
    } catch (error) {
      console.error(`✗ Failed to update admin for Kebele ${kebeleData.name}:`, error);
    }
  }

  console.log('\n✅ Kebele admin update completed!');
}

updateKebeleAdmins()
  .catch((error) => {
    console.error('Error updating kebele admins:', error);
    process.exit(1);
  })
  .finally(() => {
    prisma.$disconnect();
  });
