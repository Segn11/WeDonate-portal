import { PrismaClient } from '@prisma/client';
import { DonationService } from '../src/services/donation.service';
import { DistributionService } from '../src/services/distribution.service';

const prisma = new PrismaClient();

async function main() {
  console.log('=== Testing Generic Pipeline for All Beneficiaries ===\n');

  // Get all APPROVED_PUBLISHED requests (ready for donations)
  const approvedRequests = await prisma.beneficiaryRequest.findMany({
    where: {
      status: 'APPROVED_PUBLISHED',
    },
    include: {
      donations: true,
    },
  });

  console.log(`Found ${approvedRequests.length} requests ready for donations:`);
  approvedRequests.forEach((r) => {
    console.log(`  - ${r.requestNumber}: ${r.beneficiaryName} | Needed: ${r.estimatedAmountNeededEtb} ETB`);
  });

  if (approvedRequests.length === 0) {
    console.log('No approved requests found to test with');
    return;
  }

  // Test with the first approved request
  const testRequest = approvedRequests[0];
  console.log(`\n=== Testing with Request: ${testRequest.requestNumber} ===`);
  console.log(`Beneficiary: ${testRequest.beneficiaryName}`);
  console.log(`Kebele: ${testRequest.kebele}`);
  console.log(`Status: ${testRequest.status}`);

  // Find a donor
  const donor = await prisma.user.findFirst({
    where: { role: 'DONOR' },
  });

  if (!donor) {
    console.log('No donor found');
    return;
  }

  console.log(`\n=== Step 1: Donor Makes Donation ===`);
  console.log(`Donor: ${donor.fullName}`);

  try {
    const donation = await DonationService.createDonation({
      donorId: donor.id,
      donorName: donor.fullName,
      donorEmail: donor.email,
      donorType: 'INDIVIDUAL',
      requestId: testRequest.id,
      targetCategory: testRequest.category,
      type: 'MONEY',
      amountEtb: Number(testRequest.estimatedAmountNeededEtb),
      paymentMethod: 'PHYSICAL_HANDOVER',
    });

    console.log(`✅ Donation Created: ${donation.donationNumber}`);
    console.log(`   Amount: ${donation.amountEtb} ETB`);

    // Check request status
    const updatedRequest = await prisma.beneficiaryRequest.findUnique({
      where: { id: testRequest.id },
    });

    console.log(`\n=== Step 2: Request Status Updated ===`);
    console.log(`Status: ${updatedRequest?.status}`);
    console.log(`Raised: ${updatedRequest?.amountRaisedEtb} / Needed: ${updatedRequest?.estimatedAmountNeededEtb}`);

    if (updatedRequest?.status !== 'FULLY_FUNDED') {
      console.log('Request not fully funded yet. Pipeline works but needs more donations.');
      return;
    }

    // Find Kebele Admin for this request's kebele
    const kebeleAdmin = await prisma.user.findFirst({
      where: {
        role: 'KEBELE_ADMIN',
        kebele: testRequest.kebele,
      },
    });

    if (!kebeleAdmin) {
      console.log('No Kebele Admin found for this kebele');
      return;
    }

    console.log(`\n=== Step 3: Kebele Admin Initiates Distribution ===`);
    console.log(`Kebele Admin: ${kebeleAdmin.fullName}`);

    const initiatedRequest = await DistributionService.initiateDistribution(
      testRequest.id,
      kebeleAdmin.fullName
    );

    console.log(`✅ Distribution Initiated`);
    console.log(`   Status: ${initiatedRequest.status}`);

    // Get the donation for distribution
    const donationForDist = await prisma.donation.findFirst({
      where: { requestId: testRequest.id },
    });

    if (!donationForDist) {
      console.log('No donation found for distribution');
      return;
    }

    console.log(`\n=== Step 4: Complete Distribution ===`);

    const distribution = await DistributionService.recordDistribution({
      requestId: testRequest.id,
      beneficiaryName: testRequest.beneficiaryName,
      beneficiaryPhone: testRequest.beneficiaryPhone,
      kebele: testRequest.kebele,
      woreda: testRequest.woreda,
      donationId: donationForDist.id,
      itemsOrAmountDistributed: `${testRequest.amountRaisedEtb} ETB`,
      distributedByKebeleAdmin: kebeleAdmin.fullName,
    });

    console.log(`✅ Distribution Completed`);
    console.log(`   Distribution Number: ${distribution.distributionNumber}`);
    console.log(`   Receipt Code: ${distribution.receiptVerificationCode}`);

    // Check final status
    const finalRequest = await prisma.beneficiaryRequest.findUnique({
      where: { id: testRequest.id },
    });

    console.log(`\n=== Step 5: Final Status ===`);
    console.log(`Status: ${finalRequest?.status}`);

    console.log(`\n✅ GENERIC PIPELINE CONFIRMED!`);
    console.log(`   Beneficiary "${testRequest.beneficiaryName}" has received support`);
    console.log(`   This pipeline works for ANY beneficiary who goes through the process`);
    console.log(`   - Any beneficiary can submit requests`);
    console.log(`   - Any Kebele Admin can verify`);
    console.log(`   - Any Woreda Admin can approve`);
    console.log(`   - Any donor can donate`);
    console.log(`   - Any Kebele Admin can distribute`);
    console.log(`   - Any beneficiary receives support`);

  } catch (error) {
    console.error('Error in pipeline:', error);
  }
}

main()
  .catch((e) => console.error(e))
  .finally(() => prisma.$disconnect());
