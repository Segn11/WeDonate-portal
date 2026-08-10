import { PrismaClient } from '@prisma/client';
import { DonationService } from '../src/services/donation.service';

const prisma = new PrismaClient();

async function main() {
  console.log('=== Testing Donation Creation ===');

  // Find a beneficiary request
  const request = await prisma.beneficiaryRequest.findFirst({
    where: {
      beneficiaryName: {
        contains: 'sos',
        mode: 'insensitive',
      },
    },
  });

  if (!request) {
    console.log('No request found for SOS beneficiary');
    return;
  }

  console.log(`Found request: ${request.requestNumber}`);
  console.log(`Status: ${request.status}`);
  console.log(`Needed: ${request.estimatedAmountNeededEtb}`);
  console.log(`Raised: ${request.amountRaisedEtb}`);

  // Find a real donor user
  const donor = await prisma.user.findFirst({
    where: {
      role: 'DONOR',
    },
  });

  if (!donor) {
    console.log('No donor user found in database');
    return;
  }

  console.log(`\nUsing donor: ${donor.fullName} (${donor.email})`);

  // Create a test donation
  try {
    const donation = await DonationService.createDonation({
      donorId: donor.id,
      donorName: donor.fullName,
      donorEmail: donor.email,
      donorType: 'INDIVIDUAL',
      requestId: request.id,
      targetCategory: request.category,
      type: 'MONEY',
      amountEtb: Number(request.estimatedAmountNeededEtb),
      paymentMethod: 'PHYSICAL_HANDOVER',
    });

    console.log('\n=== Donation Created Successfully ===');
    console.log(`Donation Number: ${donation.donationNumber}`);
    console.log(`Amount: ${donation.amountEtb} ETB`);

    // Check request status after donation
    const updatedRequest = await prisma.beneficiaryRequest.findUnique({
      where: { id: request.id },
    });

    console.log(`\n=== Updated Request Status ===`);
    console.log(`Status: ${updatedRequest?.status}`);
    console.log(`Raised: ${updatedRequest?.amountRaisedEtb} / Needed: ${updatedRequest?.estimatedAmountNeededEtb}`);
  } catch (error) {
    console.error('Error creating donation:', error);
  }
}

main()
  .catch((e) => console.error(e))
  .finally(() => prisma.$disconnect());
