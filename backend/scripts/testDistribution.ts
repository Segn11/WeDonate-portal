import { PrismaClient } from '@prisma/client';
import { DistributionService } from '../src/services/distribution.service';

const prisma = new PrismaClient();

async function main() {
  console.log('=== Testing Distribution Initiation ===');

  // Find the FULLY_FUNDED request
  const request = await prisma.beneficiaryRequest.findFirst({
    where: {
      beneficiaryName: {
        contains: 'sos',
        mode: 'insensitive',
      },
    },
    include: {
      donations: true,
    },
  });

  if (!request) {
    console.log('No request found for SOS beneficiary');
    return;
  }

  console.log(`Found request: ${request.requestNumber}`);
  console.log(`Status: ${request.status}`);
  console.log(`Beneficiary: ${request.beneficiaryName}`);
  console.log(`Kebele: ${request.kebele}`);
  console.log(`Donations: ${request.donations.length}`);

  if (request.status !== 'FULLY_FUNDED') {
    console.log('Request is not FULLY_FUNDED yet');
    return;
  }

  // Find Kebele Admin
  const kebeleAdmin = await prisma.user.findFirst({
    where: {
      role: 'KEBELE_ADMIN',
      kebele: request.kebele,
    },
  });

  if (!kebeleAdmin) {
    console.log('No Kebele Admin found for this kebele');
    return;
  }

  console.log(`\nUsing Kebele Admin: ${kebeleAdmin.fullName}`);

  // Initiate distribution
  try {
    const updatedRequest = await DistributionService.initiateDistribution(
      request.id,
      kebeleAdmin.fullName
    );

    console.log('\n=== Distribution Initiated Successfully ===');
    console.log(`Request Status: ${updatedRequest.status}`);
    console.log(`Request ID: ${updatedRequest.id}`);

    // Check the donation to use for distribution
    const donation = request.donations[0];
    if (!donation) {
      console.log('No donation found for this request');
      return;
    }

    console.log(`\n=== Recording Distribution ===`);
    const distribution = await DistributionService.recordDistribution({
      requestId: request.id,
      beneficiaryName: request.beneficiaryName,
      beneficiaryPhone: request.beneficiaryPhone,
      kebele: request.kebele,
      woreda: request.woreda,
      donationId: donation.id,
      itemsOrAmountDistributed: `${request.amountRaisedEtb} ETB`,
      distributedByKebeleAdmin: kebeleAdmin.fullName,
    });

    console.log(`Distribution Number: ${distribution.distributionNumber}`);
    console.log(`Receipt Verification Code: ${distribution.receiptVerificationCode}`);

    // Check final request status
    const finalRequest = await prisma.beneficiaryRequest.findUnique({
      where: { id: request.id },
    });

    console.log(`\n=== Final Request Status ===`);
    console.log(`Status: ${finalRequest?.status}`);
    console.log(`\n✅ End-to-End Pipeline Complete!`);
    console.log(`Beneficiary: ${request.beneficiaryName} has received the support!`);
  } catch (error) {
    console.error('Error during distribution:', error);
  }
}

main()
  .catch((e) => console.error(e))
  .finally(() => prisma.$disconnect());
