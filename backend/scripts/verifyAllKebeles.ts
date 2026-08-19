import { prisma } from '../src/prisma/client';
import { RequestService } from '../src/services/request.service';

async function verifyAllKebeles() {
  console.log('Verifying kebele access control for all kebeles...\n');

  // Get all kebele admins
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

  console.log('All Kebele Admin Accounts:');
  console.log('==========================');
  kebeleAdmins.forEach((admin) => {
    console.log(`Admin: ${admin.fullName}`);
    console.log(`  Email: ${admin.email}`);
    console.log(`  Kebele: "${admin.kebele}"`);
    console.log('');
  });

  // Get all beneficiary requests
  const requests = await prisma.beneficiaryRequest.findMany({
    select: {
      id: true,
      requestNumber: true,
      kebele: true,
      beneficiaryName: true,
    },
  });

  console.log('\nAll Beneficiary Requests:');
  console.log('==========================');
  requests.forEach((req) => {
    console.log(`Request: ${req.requestNumber}`);
    console.log(`  Kebele: "${req.kebele}"`);
    console.log(`  Beneficiary: ${req.beneficiaryName}`);
    console.log('');
  });

  // Test each kebele admin
  console.log('\nTesting Access Control for Each Kebele Admin:');
  console.log('===============================================');
  
  for (const admin of kebeleAdmins) {
    console.log(`\nTesting ${admin.fullName}:`);
    
    try {
      // Get all requests for this admin
      const adminRequests = await RequestService.getAllRequests({
        userRole: 'KEBELE_ADMIN',
        userKebele: admin.kebele || undefined,
      });
      
      console.log(`  ✅ Can see ${adminRequests.length} requests`);
      
      // Extract kebele number
      const kebeleNumber = admin.kebele?.match(/\d+/)?.[0];
      if (kebeleNumber) {
        const allFromCorrectKebele = adminRequests.every(req => 
          req.kebele?.toLowerCase().includes(kebeleNumber.toLowerCase())
        );
        console.log(`  All from kebele ${kebeleNumber}: ${allFromCorrectKebele ? 'Yes' : 'No'}`);
      }
      
      // Test individual request access if they have requests
      if (adminRequests.length > 0) {
        try {
          const singleRequest = await RequestService.getById(adminRequests[0].id, {
            userRole: 'KEBELE_ADMIN',
            userKebele: admin.kebele || undefined,
          });
          console.log(`  ✅ Can access individual request: ${singleRequest.requestNumber}`);
          console.log(`  Documents visible: ${singleRequest.documents.length}`);
        } catch (error: any) {
          console.log(`  ❌ Cannot access individual request: ${error.message}`);
        }
      }
    } catch (error: any) {
      console.log(`  ❌ Error: ${error.message}`);
    }
  }

  console.log('\n✅ Verification completed!');
}

verifyAllKebeles()
  .catch((error) => {
    console.error('Error verifying kebeles:', error);
    process.exit(1);
  })
  .finally(() => {
    prisma.$disconnect();
  });
