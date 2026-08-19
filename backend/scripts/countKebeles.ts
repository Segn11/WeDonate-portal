import { prisma } from '../src/prisma/client';

async function countKebeles() {
  console.log('Counting kebeles in the system...\n');

  // Count unique kebeles from beneficiary requests
  const kebelesFromRequests = await prisma.beneficiaryRequest.findMany({
    select: {
      kebele: true,
    },
    distinct: ['kebele'],
  });

  console.log(`Unique kebeles from beneficiary requests: ${kebelesFromRequests.length}`);

  if (kebelesFromRequests.length > 0) {
    console.log('\nKebele list from requests:');
    kebelesFromRequests.forEach((item) => {
      console.log(`  - ${item.kebele}`);
    });
  }

  // Count kebele admin accounts
  const kebeleAdmins = await prisma.user.findMany({
    where: { role: 'KEBELE_ADMIN' },
    select: {
      kebele: true,
    },
    distinct: ['kebele'],
  });

  console.log(`\nUnique kebeles with admin accounts: ${kebeleAdmins.length}`);

  if (kebeleAdmins.length > 0) {
    console.log('\nKebele list from admin accounts:');
    kebeleAdmins.forEach((item) => {
      console.log(`  - ${item.kebele}`);
    });
  }

  // Count total beneficiary requests per kebele
  const requestsByKebele = await prisma.beneficiaryRequest.groupBy({
    by: ['kebele'],
    _count: {
      id: true,
    },
  });

  console.log('\nBeneficiary requests per kebele:');
  requestsByKebele.forEach((item) => {
    console.log(`  ${item.kebele}: ${item._count.id} requests`);
  });

  console.log('\n✅ Count completed!');
}

countKebeles()
  .catch((error) => {
    console.error('Error counting kebeles:', error);
    process.exit(1);
  })
  .finally(() => {
    prisma.$disconnect();
  });
