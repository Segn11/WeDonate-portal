import { prisma } from '../src/prisma/client';
import { RequestService } from '../src/services/request.service';

async function testKebele07Access() {
  console.log('Testing Kebele 07 access control specifically...\n');

  // Get the Kebele 07 request
  const kebele07Request = await prisma.beneficiaryRequest.findFirst({
    where: { kebele: { contains: '07', mode: 'insensitive' } },
    include: { documents: true },
  });

  if (!kebele07Request) {
    console.log('No request found for Kebele 07');
    return;
  }

  console.log(`Test Request: ${kebele07Request.requestNumber}`);
  console.log(`Kebele: "${kebele07Request.kebele}"`);
  console.log(`Beneficiary: ${kebele07Request.beneficiaryName}`);
  console.log(`Documents: ${kebele07Request.documents.length} files\n`);

  // Get Kebele 07 admin
  const kebele07Admin = await prisma.user.findFirst({
    where: { 
      email: 'kebele07@adama.gov.et',
      role: 'KEBELE_ADMIN'
    },
  });

  if (!kebele07Admin) {
    console.log('Kebele 07 admin not found');
    return;
  }

  console.log(`Kebele 07 Admin: ${kebele07Admin.fullName}`);
  console.log(`Admin kebele: "${kebele07Admin.kebele}"`);
  console.log(`Admin email: ${kebele07Admin.email}\n`);

  // Test 1: Kebele 07 admin accessing their own kebele's request
  console.log('Test 1: Kebele 07 admin accessing their own kebele request');
  try {
    const result = await RequestService.getById(kebele07Request.id, {
      userRole: 'KEBELE_ADMIN',
      userKebele: kebele07Admin.kebele || undefined,
    });
    console.log('✅ SUCCESS: Kebele 07 admin can access their kebele request');
    console.log(`   Request kebele: "${result.kebele}"`);
    console.log(`   Documents visible: ${result.documents.length}\n`);
  } catch (error: any) {
    console.log(`❌ FAILED: ${error.message}\n`);
  }

  // Test 2: Get all requests for Kebele 07 admin
  console.log('Test 2: Get all requests for Kebele 07 admin');
  try {
    const requests = await RequestService.getAllRequests({
      userRole: 'KEBELE_ADMIN',
      userKebele: kebele07Admin.kebele || undefined,
    });
    console.log(`✅ SUCCESS: Kebele 07 admin can see ${requests.length} requests`);
    requests.forEach(req => {
      console.log(`   - ${req.requestNumber}: "${req.kebele}"`);
    });
    const allFromKebele07 = requests.every(req => 
      req.kebele?.toLowerCase().includes('07')
    );
    console.log(`   All requests from Kebele 07: ${allFromKebele07 ? 'Yes' : 'No'}\n`);
  } catch (error: any) {
    console.log(`❌ FAILED: ${error.message}\n`);
  }

  console.log('✅ Kebele 07 specific testing completed!');
}

testKebele07Access()
  .catch((error) => {
    console.error('Error testing Kebele 07 access:', error);
    process.exit(1);
  })
  .finally(() => {
    prisma.$disconnect();
  });
