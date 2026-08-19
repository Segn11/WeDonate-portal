import { prisma } from '../src/prisma/client';
import { RequestService } from '../src/services/request.service';

async function testKebele13() {
  console.log('Testing beneficiary kebele 13 access control and approval...\n');

  // Get kebele 13 admin
  const kebele13Admin = await prisma.user.findFirst({
    where: { 
      email: 'kebele13@adama.gov.et',
      role: 'KEBELE_ADMIN'
    },
  });

  if (!kebele13Admin) {
    console.log('❌ Kebele 13 admin not found');
    return;
  }

  console.log('Kebele 13 Admin Details:');
  console.log(`Admin: ${kebele13Admin.fullName}`);
  console.log(`Email: ${kebele13Admin.email}`);
  console.log(`Kebele: "${kebele13Admin.kebele}"`);

  // Get all requests
  const requests = await prisma.beneficiaryRequest.findMany({
    select: {
      id: true,
      requestNumber: true,
      kebele: true,
      beneficiaryName: true,
      status: true,
    },
  });

  console.log(`\nTotal requests in system: ${requests.length}`);

  // Find requests from Kebele 13
  const kebele13Requests = requests.filter(req => 
    req.kebele?.toLowerCase().includes('13')
  );

  console.log(`Requests from Kebele 13: ${kebele13Requests.length}`);

  if (kebele13Requests.length === 0) {
    console.log('❌ No requests found from Kebele 13');
    return;
  }

  const testRequest = kebele13Requests[0];
  console.log(`\nTesting with request: ${testRequest.requestNumber}`);
  console.log(`Request kebele: "${testRequest.kebele}"`);
  console.log(`Beneficiary: ${testRequest.beneficiaryName}`);
  console.log(`Current status: ${testRequest.status}`);

  // Test 1: Access control - Kebele 13 admin can view Kebele 13 request
  console.log('\n1. Testing access control (view request)...');
  try {
    const request = await RequestService.getById(testRequest.id, {
      userRole: 'KEBELE_ADMIN',
      userKebele: kebele13Admin.kebele || undefined,
    });
    console.log('✅ SUCCESS: Kebele 13 admin can access Kebele 13 beneficiary request');
    console.log(`   Documents visible: ${request.documents.length}`);
  } catch (error: any) {
    console.log(`❌ FAILED: ${error.message}`);
  }

  // Test 2: Get all requests for Kebele 13 admin
  console.log('\n2. Testing getAllRequests for Kebele 13 admin...');
  try {
    const adminRequests = await RequestService.getAllRequests({
      userRole: 'KEBELE_ADMIN',
      userKebele: kebele13Admin.kebele || undefined,
    });
    console.log(`✅ SUCCESS: Kebele 13 admin can see ${adminRequests.length} requests`);
    
    const allFromKebele13 = adminRequests.every(req => 
      req.kebele?.toLowerCase().includes('13')
    );
    console.log(`   All from Kebele 13: ${allFromKebele13 ? 'Yes' : 'No'}`);
  } catch (error: any) {
    console.log(`❌ FAILED: ${error.message}`);
  }

  // Test 3: Approval - Kebele 13 admin can approve Kebele 13 request
  console.log('\n3. Testing approval process...');
  try {
    const result = await RequestService.updateStatus(
      testRequest.id,
      'APPROVED_BY_KEBELE',
      kebele13Admin.fullName,
      'Approved by Kebele 13 admin',
      undefined,
      {
        userRole: 'KEBELE_ADMIN',
        userKebele: kebele13Admin.kebele || undefined,
      }
    );
    console.log('✅ SUCCESS: Kebele 13 admin can approve Kebele 13 beneficiary request');
    console.log(`   Status changed to: ${result.status}`);
    
    // Reset status for next test
    await prisma.beneficiaryRequest.update({
      where: { id: testRequest.id },
      data: { status: 'SUBMITTED' },
    });
  } catch (error: any) {
    console.log(`❌ FAILED: ${error.message}`);
  }

  // Test 4: Cross-kebele restriction
  const otherKebeleRequests = requests.filter(req => 
    req.kebele && !req.kebele.toLowerCase().includes('13')
  );

  if (otherKebeleRequests.length > 0) {
    const otherRequest = otherKebeleRequests[0];
    console.log(`\n4. Testing cross-kebele restriction with request: ${otherRequest.requestNumber}`);
    console.log(`Request kebele: "${otherRequest.kebele}"`);

    try {
      // Try to approve non-Kebele 13 request
      await RequestService.updateStatus(
        otherRequest.id,
        'APPROVED_BY_KEBELE',
        kebele13Admin.fullName,
        'Attempting approval',
        undefined,
        {
          userRole: 'KEBELE_ADMIN',
          userKebele: kebele13Admin.kebele || undefined,
        }
      );
      console.log('❌ FAILED: Kebele 13 admin should NOT be able to approve non-Kebele 13 request');
    } catch (error: any) {
      console.log(`✅ SUCCESS: Correctly blocked with message: ${error.message}`);
    }
  }

  // Test 5: Different admin trying to approve Kebele 13 request
  const kebele10Admin = await prisma.user.findFirst({
    where: { 
      email: 'kebele10@adama.gov.et',
      role: 'KEBELE_ADMIN'
    },
  });

  if (kebele10Admin) {
    console.log(`\n5. Testing Kebele 10 admin attempting to approve Kebele 13 request: ${testRequest.requestNumber}`);
    console.log(`Kebele 10 admin kebele: "${kebele10Admin.kebele}"`);
    console.log(`Request kebele: "${testRequest.kebele}"`);

    try {
      await RequestService.updateStatus(
        testRequest.id,
        'APPROVED_BY_KEBELE',
        kebele10Admin.fullName,
        'Attempting approval',
        undefined,
        {
          userRole: 'KEBELE_ADMIN',
          userKebele: kebele10Admin.kebele || undefined,
        }
      );
      console.log('❌ FAILED: Kebele 10 admin should NOT be able to approve Kebele 13 request');
    } catch (error: any) {
      console.log(`✅ SUCCESS: Correctly blocked with message: ${error.message}`);
    }
  }

  console.log('\n✅ Kebele 13 testing completed!');
}

testKebele13()
  .catch((error) => {
    console.error('Error testing kebele 13:', error);
    process.exit(1);
  })
  .finally(() => {
    prisma.$disconnect();
  });
