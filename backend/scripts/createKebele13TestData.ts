import { prisma } from '../src/prisma/client';
import { RequestService } from '../src/services/request.service';
import bcrypt from 'bcryptjs';

async function createKebele13TestData() {
  console.log('Creating test beneficiary data for Kebele 13...\n');

  // Create a test beneficiary user for Kebele 13
  const testBeneficiaryEmail = 'kebele13.beneficiary@test.com';
  const testPassword = 'Test@123';

  // Check if beneficiary already exists
  let beneficiary = await prisma.user.findUnique({
    where: { email: testBeneficiaryEmail },
  });

  if (!beneficiary) {
    console.log('Creating test beneficiary user for Kebele 13...');
    const passwordHash = await bcrypt.hash(testPassword, 10);
    
    beneficiary = await prisma.user.create({
      data: {
        fullName: 'Kebele 13 Test Beneficiary',
        email: testBeneficiaryEmail,
        phone: '+251911000013',
        role: 'BENEFICIARY',
        passwordHash,
        kebele: 'Kebele 13',
        woreda: 'Adama',
        nationalIdNumber: '13-1234567890',
        isVerified: false,
        status: 'PENDING_VERIFICATION',
      },
    });
    console.log('✅ Test beneficiary created successfully');
    console.log(`   Email: ${testBeneficiaryEmail}`);
    console.log(`   Password: ${testPassword}`);
  } else {
    console.log('✅ Test beneficiary already exists');
  }

  // Create a test beneficiary request for Kebele 13
  console.log('\nCreating test beneficiary request for Kebele 13...');
  
  const requestNumber = `REQ-${Date.now()}`;
  const request = await prisma.beneficiaryRequest.create({
    data: {
      requestNumber,
      beneficiaryId: beneficiary.id,
      beneficiaryName: beneficiary.fullName,
      beneficiaryPhone: beneficiary.phone,
      nationalIdNumber: beneficiary.nationalIdNumber!,
      kebele: 'Kebele 13',
      woreda: 'Adama',
      category: 'FOOD_SUPPLIES',
      urgency: 'HIGH',
      title: 'Test Request from Kebele 13',
      description: 'This is a test request from Kebele 13 for testing access control and approval functionality.',
      householdSize: 5,
      estimatedAmountNeededEtb: 5000,
      amountRaisedEtb: 0,
      status: 'SUBMITTED',
      statusHistory: {
        create: {
          status: 'SUBMITTED',
          updatedBy: beneficiary.fullName,
          comment: 'New support request submitted for Kebele verification.',
        },
      },
    },
  });

  console.log('✅ Test beneficiary request created successfully');
  console.log(`   Request Number: ${requestNumber}`);
  console.log(`   Kebele: ${request.kebele}`);
  console.log(`   Status: ${request.status}`);

  // Get kebele 13 admin
  const kebele13Admin = await prisma.user.findFirst({
    where: { 
      email: 'kebele13@adama.gov.et',
      role: 'KEBELE_ADMIN'
    },
  });

  if (!kebele13Admin) {
    console.log('\n❌ Kebele 13 admin not found');
    return;
  }

  console.log('\nKebele 13 Admin Details:');
  console.log(`Admin: ${kebele13Admin.fullName}`);
  console.log(`Email: ${kebele13Admin.email}`);
  console.log(`Kebele: "${kebele13Admin.kebele}"`);

  // Test 1: Access control
  console.log('\n1. Testing access control (view request)...');
  try {
    const retrievedRequest = await RequestService.getById(request.id, {
      userRole: 'KEBELE_ADMIN',
      userKebele: kebele13Admin.kebele || undefined,
    });
    console.log('✅ SUCCESS: Kebele 13 admin can access Kebele 13 beneficiary request');
    console.log(`   Request: ${retrievedRequest.requestNumber}`);
    console.log(`   Beneficiary: ${retrievedRequest.beneficiaryName}`);
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
    
    const kebele13RequestCount = adminRequests.filter(req => 
      req.kebele?.toLowerCase().includes('13')
    ).length;
    console.log(`   Requests from Kebele 13: ${kebele13RequestCount}`);
  } catch (error: any) {
    console.log(`❌ FAILED: ${error.message}`);
  }

  // Test 3: Approval process
  console.log('\n3. Testing approval process...');
  try {
    const approvedRequest = await RequestService.updateStatus(
      request.id,
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
    console.log(`   Status changed to: ${approvedRequest.status}`);
    console.log(`   Approved by: ${approvedRequest.kebeleApprovedBy}`);
  } catch (error: any) {
    console.log(`❌ FAILED: ${error.message}`);
  }

  // Test 4: Cross-kebele restriction
  const kebele10Admin = await prisma.user.findFirst({
    where: { 
      email: 'kebele10@adama.gov.et',
      role: 'KEBELE_ADMIN'
    },
  });

  if (kebele10Admin) {
    console.log('\n4. Testing cross-kebele restriction (Kebele 10 admin trying to approve Kebele 13 request)...');
    try {
      await RequestService.updateStatus(
        request.id,
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

  console.log('\n✅ Kebele 13 test data creation and testing completed!');
  console.log('\nTest Beneficiary Credentials:');
  console.log(`Email: ${testBeneficiaryEmail}`);
  console.log(`Password: ${testPassword}`);
  console.log(`Request Number: ${requestNumber}`);
}

createKebele13TestData()
  .catch((error) => {
    console.error('Error creating Kebele 13 test data:', error);
    process.exit(1);
  })
  .finally(() => {
    prisma.$disconnect();
  });
