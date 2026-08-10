import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('=== Users with SOS in name ===');
  const users = await prisma.user.findMany({
    where: {
      fullName: {
        contains: 'sos',
        mode: 'insensitive',
      },
    },
  });

  users.forEach((u) => {
    console.log(`User: ${u.fullName} | Email: ${u.email} | Role: ${u.role}`);
  });

  console.log('\n=== Requests with SOS in beneficiary name ===');
  const requests = await prisma.beneficiaryRequest.findMany({
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

  requests.forEach((r) => {
    console.log(`Request: ${r.requestNumber}`);
    console.log(`  Beneficiary: ${r.beneficiaryName}`);
    console.log(`  Status: ${r.status}`);
    console.log(`  Raised: ${r.amountRaisedEtb} / Needed: ${r.estimatedAmountNeededEtb}`);
    console.log(`  Donations: ${r.donations.length}`);
    r.donations.forEach((d) => {
      console.log(`    - ${d.donationNumber}: ${d.amountEtb} ETB from ${d.donorName}`);
    });
  });

  console.log('\n=== All Donations ===');
  const allDonations = await prisma.donation.findMany({
    include: {
      request: true,
    },
  });

  allDonations.forEach((d) => {
    console.log(`Donation: ${d.donationNumber} | Amount: ${d.amountEtb} ETB | Request: ${d.requestId} | Status: ${d.status}`);
    if (d.request) {
      console.log(`  Request Status: ${d.request.status} | Raised: ${d.request.amountRaisedEtb} / Needed: ${d.request.estimatedAmountNeededEtb}`);
    }
  });
}

main()
  .catch((e) => console.error(e))
  .finally(() => prisma.$disconnect());
