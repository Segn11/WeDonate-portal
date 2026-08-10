import { prisma } from '../src/prisma/client';

async function debugRequests() {
  try {
    console.log('=== Checking All Users ===');
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        fullName: true,
        role: true,
        kebele: true,
        woreda: true,
      },
    });
    users.forEach(u => {
      console.log(`User: ${u.email} | Role: ${u.role} | Kebele: ${u.kebele} | Woreda: ${u.woreda}`);
    });

    console.log('\n=== Checking All Requests ===');
    const requests = await prisma.beneficiaryRequest.findMany({
      select: {
        id: true,
        requestNumber: true,
        beneficiaryId: true,
        beneficiaryName: true,
        nationalIdNumber: true,
        kebele: true,
        woreda: true,
        status: true,
        category: true,
        title: true,
      },
    });
    requests.forEach(r => {
      console.log(`Request: ${r.requestNumber} | Status: ${r.status} | Kebele: ${r.kebele} | Woreda: ${r.woreda}`);
    });

    console.log('\n=== Checking Kebele Admin User ===');
    const kebeleAdmin = await prisma.user.findUnique({
      where: { email: 'kebeleadmin@adama.com' },
      select: {
        id: true,
        email: true,
        role: true,
        kebele: true,
        woreda: true,
      },
    });
    console.log('Kebele Admin:', kebeleAdmin);

    console.log('\n=== Filtering for Kebele Admin View ===');
    const kebeleAdminRequests = requests.filter(
      (r) => kebeleAdmin?.kebele && r.kebele === kebeleAdmin.kebele
    );
    console.log(`Requests matching Kebele Admin's kebele (${kebeleAdmin?.kebele}):`, kebeleAdminRequests.length);
    kebeleAdminRequests.forEach(r => {
      console.log(`  - ${r.requestNumber} | Status: ${r.status} | Kebele: ${r.kebele}`);
    });

    const pendingVerification = kebeleAdminRequests.filter(
      (r) => r.status === 'SUBMITTED' || r.status === 'UNDER_KEBELE_REVIEW'
    );
    console.log(`Pending verification requests:`, pendingVerification.length);
    pendingVerification.forEach(r => {
      console.log(`  - ${r.requestNumber} | Status: ${r.status}`);
    });

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

debugRequests();
