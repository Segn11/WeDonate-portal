import { prisma } from '../src/prisma/client';
import { RequestService } from '../src/services/request.service';

async function testKebeleApprovalMatching() {
  console.log('Testing beneficiary-admin kebele matching for approval process...\n');

  // Get a kebele admin
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

  console.log('Testing with Kebele 10 Admin:');
  console.log(`Admin: ${kebele10Admin.fullName}`);
  console.log(`Admin kebele: "${kebele10Admin.kebele}"`);

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

  // Find requests from Kebele 10
  const kebele10Requests = requests.filter(req => 
    req.kebele?.toLowerCase().includes('10')
  );

  console.log(`Requests from Kebele 10: ${kebele10Requests.length}`);

  if (kebele10Requests.length > 0) {
    const testRequest = kebele10Requests[0];
    console.log(`\nTesting approval of request: ${testRequest.requestNumber}`);
    console.log(`Request kebele: "${testRequest.kebele}"`);

    try {
      // Test approval with matching kebele
      console.log('\n1. Testing approval with matching kebele...');
      const result = await RequestService.updateStatus(
        testRequest.id,
        'APPROVED_BY_KEBELE',
        kebele10Admin.fullName,
        'Approved by kebele admin',
        undefined,
        {
          userRole: 'KEBELE_ADMIN',
          userKebele: kebele10Admin.kebele || undefined,
        }
      );
      console.log('✅ SUCCESS: Kebele 10 admin can approve Kebele 10 request');
      console.log(`   Status changed to: ${result.status}`);
    } catch (error: any) {
      console.log(`❌ FAILED: ${error.message}`);
    }

    // Reset status for next test
    await prisma.beneficiaryRequest.update({
      where: { id: testRequest.id },
      data: { status: 'SUBMITTED' },
    });
  }

  // Find requests from different kebele
  const otherKebeleRequests = requests.filter(req => 
    req.kebele && !req.kebele.toLowerCase().includes('10')
  );

  if (otherKebeleRequests.length > 0) {
    const testRequest = otherKebeleRequests[0];
    console.log(`\n2. Testing approval of request from different kebele: ${testRequest.requestNumber}`);
    console.log(`Request kebele: "${testRequest.kebele}"`);

    try {
      // Test approval with non-matching kebele
      const result = await RequestService.updateStatus(
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
      console.log('❌ FAILED: Kebele 10 admin should NOT be able to approve non-Kebele 10 request');
    } catch (error: any) {
      console.log(`✅ SUCCESS: Correctly blocked with message: ${error.message}`);
    }
  }

  // Test with different kebele admin
  const kebele07Admin = await prisma.user.findFirst({
    where: { 
      email: 'kebele07@adama.gov.et',
      role: 'KEBELE_ADMIN'
    },
  });

  if (kebele07Admin && kebele10Requests.length > 0) {
    const testRequest = kebele10Requests[0];
    console.log(`\n3. Testing Kebele 07 admin attempting to approve Kebele 10 request: ${testRequest.requestNumber}`);
    console.log(`Kebele 07 admin kebele: "${kebele07Admin.kebele}"`);
    console.log(`Request kebele: "${testRequest.kebele}"`);

    try {
      const result = await RequestService.updateStatus(
        testRequest.id,
        'APPROVED_BY_KEBELE',
        kebele07Admin.fullName,
        'Attempting approval',
        undefined,
        {
          userRole: 'KEBELE_ADMIN',
          userKebele: kebele07Admin.kebele || undefined,
        }
      );
      console.log('❌ FAILED: Kebele 07 admin should NOT be able to approve Kebele 10 request');
    } catch (error: any) {
      console.log(`✅ SUCCESS: Correctly blocked with message: ${error.message}`);
    }
  }

  console.log('\n✅ Kebele approval matching test completed!');
}

testKebeleApprovalMatching()
  .catch((error) => {
    console.error('Error testing kebele approval matching:', error);
    process.exit(1);
  })
  .finally(() => {
    prisma.$disconnect();
  });
