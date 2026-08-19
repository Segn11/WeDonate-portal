import { prisma } from '../src/prisma/client';
import { RequestService } from '../src/services/request.service';

async function testKebeleAccessControl() {
  console.log('Testing kebele-based access control...\n');

  // Get a sample request from Kebele 08
  const kebele08Request = await prisma.beneficiaryRequest.findFirst({
    where: { kebele: { contains: '08', mode: 'insensitive' } },
    include: { documents: true },
  });

  if (!kebele08Request) {
    console.log('No request found for Kebele 08');
    return;
  }

  console.log(`Test Request: ${kebele08Request.requestNumber}`);
  console.log(`Kebele: ${kebele08Request.kebele}`);
  console.log(`Documents: ${kebele08Request.documents.length} files\n`);

  // Test 1: Kebele 08 admin accessing their own kebele's request
  console.log('Test 1: Kebele 08 admin accessing their own kebele request');
  try {
    const result = await RequestService.getById(kebele08Request.id, {
      userRole: 'KEBELE_ADMIN',
      userKebele: '08',
    });
    console.log('✅ SUCCESS: Kebele 08 admin can access their kebele request');
    console.log(`   Documents visible: ${result.documents.length}\n`);
  } catch (error: any) {
    console.log(`❌ FAILED: ${error.message}\n`);
  }

  // Test 2: Kebele 05 admin trying to access Kebele 08 request
  console.log('Test 2: Kebele 05 admin trying to access Kebele 08 request');
  try {
    const result = await RequestService.getById(kebele08Request.id, {
      userRole: 'KEBELE_ADMIN',
      userKebele: '05',
    });
    console.log('❌ FAILED: Kebele 05 admin should NOT be able to access Kebele 08 request\n');
  } catch (error: any) {
    console.log(`✅ SUCCESS: Access denied as expected - ${error.message}\n`);
  }

  // Test 3: System admin accessing any request
  console.log('Test 3: System admin accessing any request');
  try {
    const result = await RequestService.getById(kebele08Request.id, {
      userRole: 'SYSTEM_ADMIN',
    });
    console.log('✅ SUCCESS: System admin can access any request');
    console.log(`   Documents visible: ${result.documents.length}\n`);
  } catch (error: any) {
    console.log(`❌ FAILED: ${error.message}\n`);
  }

  // Test 4: Get all requests for Kebele 08 admin
  console.log('Test 4: Get all requests for Kebele 08 admin');
  try {
    const requests = await RequestService.getAllRequests({
      userRole: 'KEBELE_ADMIN',
      userKebele: '08',
    });
    console.log(`✅ SUCCESS: Kebele 08 admin can see ${requests.length} requests`);
    const allFromKebele08 = requests.every(req => 
      req.kebele?.toLowerCase().includes('08')
    );
    console.log(`   All requests from Kebele 08: ${allFromKebele08 ? 'Yes' : 'No'}\n`);
  } catch (error: any) {
    console.log(`❌ FAILED: ${error.message}\n`);
  }

  console.log('✅ Access control testing completed!');
}

testKebeleAccessControl()
  .catch((error) => {
    console.error('Error testing access control:', error);
    process.exit(1);
  })
  .finally(() => {
    prisma.$disconnect();
  });
