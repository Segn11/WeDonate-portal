import { prisma } from '../src/prisma/client';

async function debugKebeleValues() {
  console.log('Debugging kebele values in database...\n');

  // Check beneficiary requests kebele values
  const requests = await prisma.beneficiaryRequest.findMany({
    select: {
      id: true,
      requestNumber: true,
      kebele: true,
      beneficiaryName: true,
    },
  });

  console.log('Beneficiary Requests Kebele Values:');
  console.log('====================================');
  requests.forEach((req) => {
    console.log(`Request: ${req.requestNumber}`);
    console.log(`  Kebele: "${req.kebele}"`);
    console.log(`  Beneficiary: ${req.beneficiaryName}`);
    console.log('');
  });

  // Check kebele admin accounts
  const kebeleAdmins = await prisma.user.findMany({
    where: { role: 'KEBELE_ADMIN' },
    select: {
      id: true,
      email: true,
      fullName: true,
      kebele: true,
    },
    orderBy: { kebele: 'asc' },
  });

  console.log('\nKebele Admin Accounts Kebele Values:');
  console.log('====================================');
  kebeleAdmins.forEach((admin) => {
    console.log(`Admin: ${admin.fullName}`);
    console.log(`  Email: ${admin.email}`);
    console.log(`  Kebele: "${admin.kebele}"`);
    console.log('');
  });

  // Test specific kebele 07 matching
  console.log('\nTesting Kebele 07 Matching:');
  console.log('==========================');
  
  const kebele07Admin = kebeleAdmins.find(admin => admin.kebele === '07');
  console.log(`Kebele 07 admin found: ${kebele07Admin ? 'Yes' : 'No'}`);
  if (kebele07Admin) {
    console.log(`  Admin kebele value: "${kebele07Admin.kebele}"`);
  }

  const kebele07Requests = requests.filter(req => 
    req.kebele?.toLowerCase().includes('07')
  );
  console.log(`Requests containing "07": ${kebele07Requests.length}`);
  kebele07Requests.forEach(req => {
    console.log(`  Request: ${req.requestNumber}, Kebele: "${req.kebele}"`);
  });

  // Test exact match
  const exactKebele07Requests = requests.filter(req => 
    req.kebele === '07'
  );
  console.log(`Requests exactly "07": ${exactKebele07Requests.length}`);

  console.log('\n✅ Debug completed!');
}

debugKebeleValues()
  .catch((error) => {
    console.error('Error debugging kebele values:', error);
    process.exit(1);
  })
  .finally(() => {
    prisma.$disconnect();
  });
