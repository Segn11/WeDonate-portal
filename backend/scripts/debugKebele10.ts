import { prisma } from '../src/prisma/client';
import { RequestService } from '../src/services/request.service';

async function debugKebele10() {
  console.log('Debugging kebele 10 access control...\n');

  // Get all beneficiary requests
  const requests = await prisma.beneficiaryRequest.findMany({
    select: {
      id: true,
      requestNumber: true,
      kebele: true,
      beneficiaryName: true,
    },
  });

  console.log('All Beneficiary Requests Kebele Values:');
  console.log('========================================');
  requests.forEach((req) => {
    console.log(`Request: ${req.requestNumber}`);
    console.log(`  Kebele: "${req.kebele}"`);
    console.log(`  Beneficiary: ${req.beneficiaryName}`);
    console.log('');
  });

  // Get kebele 10 admin
  const kebele10Admin = await prisma.user.findFirst({
    where: { 
      email: 'kebele10@adama.gov.et',
      role: 'KEBELE_ADMIN'
    },
  });

  if (!kebele10Admin) {
    console.log('Kebele 10 admin not found');
    return;
  }

  console.log('\nKebele 10 Admin:');
  console.log('================');
  console.log(`Admin: ${kebele10Admin.fullName}`);
  console.log(`Admin kebele: "${kebele10Admin.kebele}"`);
  console.log(`Admin email: ${kebele10Admin.email}\n`);

  // Test kebele 10 matching
  console.log('Testing Kebele 10 Matching:');
  console.log('==========================');
  
  const kebele10Requests = requests.filter(req => 
    req.kebele?.toLowerCase().includes('10')
  );
  console.log(`Requests containing "10": ${kebele10Requests.length}`);
  kebele10Requests.forEach(req => {
    console.log(`  Request: ${req.requestNumber}, Kebele: "${req.kebele}"`);
  });

  // Test exact match
  const exactKebele10Requests = requests.filter(req => 
    req.kebele === 'Kebele 10'
  );
  console.log(`Requests exactly "Kebele 10": ${exactKebele10Requests.length}`);

  // Test with admin kebele value
  const adminKebeleMatch = requests.filter(req => 
    req.kebele?.toLowerCase().includes(kebele10Admin.kebele?.toLowerCase() || '')
  );
  console.log(`Requests matching admin kebele "${kebele10Admin.kebele}": ${adminKebeleMatch.length}`);

  // Test access control
  if (kebele10Requests.length > 0) {
    console.log('\nTesting Access Control:');
    console.log('=======================');
    try {
      const result = await RequestService.getById(kebele10Requests[0].id, {
        userRole: 'KEBELE_ADMIN',
        userKebele: kebele10Admin.kebele || undefined,
      });
      console.log('✅ SUCCESS: Kebele 10 admin can access request');
      console.log(`   Request kebele: "${result.kebele}"`);
      console.log(`   Documents visible: ${result.documents.length}\n`);
    } catch (error: any) {
      console.log(`❌ FAILED: ${error.message}\n`);
    }
  }

  console.log('✅ Debug completed!');
}

debugKebele10()
  .catch((error) => {
    console.error('Error debugging kebele 10:', error);
    process.exit(1);
  })
  .finally(() => {
    prisma.$disconnect();
  });
