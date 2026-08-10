import { prisma } from '../src/prisma/client';

async function fixRequestKebele() {
  try {
    console.log('=== Updating Request to Kebele 05 (Bole) ===');
    
    // Update the first request to Kebele 05 (Bole)
    const updated = await prisma.beneficiaryRequest.updateMany({
      where: {
        kebele: 'Kebele 08 (Demdela)',
      },
      data: {
        kebele: 'Kebele 05 (Bole)',
        woreda: 'Bole Sub-City Woreda',
      },
    });

    console.log(`Updated ${updated.count} request(s) to Kebele 05 (Bole)`);

    // Verify the update
    const requests = await prisma.beneficiaryRequest.findMany({
      where: {
        kebele: 'Kebele 05 (Bole)',
      },
      select: {
        requestNumber: true,
        status: true,
        kebele: true,
        beneficiaryName: true,
      },
    });

    console.log('\n=== Requests in Kebele 05 (Bole) ===');
    requests.forEach(r => {
      console.log(`Request: ${r.requestNumber} | Status: ${r.status} | Beneficiary: ${r.beneficiaryName}`);
    });

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

fixRequestKebele();
