import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('=== Testing Guest Donation API ===\n');

  // Create a test beneficiary user if none exists
  let beneficiary = await prisma.user.findFirst({
    where: {
      role: 'BENEFICIARY',
    },
  });

  if (!beneficiary) {
    console.log('Creating test beneficiary user...');
    beneficiary = await prisma.user.create({
      data: {
        email: 'test.beneficiary@adama.gov.et',
        fullName: 'Test Beneficiary',
        role: 'BENEFICIARY',
        kebele: 'Test Kebele',
        phone: '0912345678',
      },
    });
    console.log(`✅ Created beneficiary: ${beneficiary.fullName}`);
  }

  // Create a test beneficiary request
  let request = await prisma.beneficiaryRequest.findFirst({
    where: {
      status: 'APPROVED_PUBLISHED',
    },
  });

  if (!request) {
    console.log('Creating test beneficiary request...');
    request = await prisma.beneficiaryRequest.create({
      data: {
        requestNumber: `REQ-${Date.now()}`,
        beneficiaryId: beneficiary.id,
        beneficiaryName: beneficiary.fullName,
        beneficiaryPhone: beneficiary.phone || '0912345678',
        kebele: beneficiary.kebele || 'Test Kebele',
        woreda: 'Test Woreda',
        nationalIdNumber: '1234567890',
        title: 'Test Request for Guest Donation',
        description: 'This is a test request for testing guest donations',
        category: 'FOOD_SUPPLIES',
        estimatedAmountNeededEtb: 15000,
        amountRaisedEtb: 0,
        status: 'APPROVED_PUBLISHED',
      },
    });
    console.log(`✅ Created request: ${request.title}`);
  }

  console.log(`Testing guest donation for request: ${request.title}`);
  console.log(`Beneficiary: ${request.beneficiaryName}\n`);

  // Simulate guest donation
  const API_BASE_URL = 'http://localhost:5000/api/v1';

  try {
    const response = await fetch(`${API_BASE_URL}/donations/guest`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        donorName: 'Guest Test Donor',
        donorEmail: 'guest@test.com',
        requestId: request.id,
        targetCategory: request.category,
        type: 'MONEY',
        amountEtb: 5000,
        paymentMethod: 'TELEBIRR',
        transactionRef: 'GUEST-TEST-12345',
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error('Failed to create guest donation:', error);
      return;
    }

    const data: any = await response.json();
    console.log('✅ Guest donation created successfully!');
    console.log(`   Donation ID: ${data.data.id}`);
    console.log(`   Donation Number: ${data.data.donationNumber}`);
    console.log(`   Donor Name: ${data.data.donorName}`);
    console.log(`   Amount: ${data.data.amountEtb} ETB`);
    console.log(`   Donor Type: ${data.data.donorType}`);
    console.log(`   Status: ${data.data.status}`);

    // Check if request was updated
    const updatedRequest = await prisma.beneficiaryRequest.findUnique({
      where: { id: request.id },
    });

    console.log('\n✅ Request funding updated:');
    console.log(`   Previous raised: ${request.amountRaisedEtb} ETB`);
    console.log(`   New raised: ${updatedRequest?.amountRaisedEtb} ETB`);
    console.log(`   Status: ${updatedRequest?.status}`);

  } catch (error) {
    console.error('Error testing guest donation:', error);
  }
}

main()
  .catch((e) => console.error(e))
  .finally(() => prisma.$disconnect());
