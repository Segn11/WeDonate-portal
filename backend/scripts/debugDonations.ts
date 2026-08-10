import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('=== All Donations ===');
  const donations = await prisma.donation.findMany({
    include: {
      request: true,
    },
  });

  donations.forEach((d) => {
    console.log(`Donation: ${d.donationNumber} | Amount: ${d.amountEtb} ETB | Request: ${d.requestId} | Status: ${d.status}`);
    if (d.request) {
      console.log(`  Request Status: ${d.request.status} | Raised: ${d.request.amountRaisedEtb} / Needed: ${d.request.estimatedAmountNeededEtb}`);
    }
  });

  console.log('\n=== All Requests with Funding Status ===');
  const requests = await prisma.beneficiaryRequest.findMany();
  requests.forEach((r) => {
    console.log(`Request: ${r.requestNumber} | Status: ${r.status} | Raised: ${r.amountRaisedEtb} / Needed: ${r.estimatedAmountNeededEtb}`);
  });
}

main()
  .catch((e) => console.error(e))
  .finally(() => prisma.$disconnect());
