import { prisma } from '../src/prisma/client';

async function checkUserRoles() {
  console.log('Checking user roles in the system...\n');

  const users = await prisma.user.findMany({
    select: {
      id: true,
      fullName: true,
      email: true,
      role: true,
      kebele: true,
      woreda: true,
      nationalIdNumber: true,
      isVerified: true,
      status: true,
      createdAt: true,
    },
    orderBy: { role: 'asc' },
  });

  console.log('All Users by Role:');
  console.log('==================');
  
  const roleGroups: any = {};
  
  users.forEach((user) => {
    if (!roleGroups[user.role]) {
      roleGroups[user.role] = [];
    }
    roleGroups[user.role].push(user);
  });

  Object.keys(roleGroups).forEach((role) => {
    console.log(`\n${role} (${roleGroups[role].length} users):`);
    roleGroups[role].forEach((user: any) => {
      console.log(`  - ${user.fullName} (${user.email})`);
      console.log(`    Kebele: ${user.kebele || 'N/A'}`);
      console.log(`    Status: ${user.status}, Verified: ${user.isVerified}`);
    });
  });

  // Check for potential issues
  console.log('\n\nPotential Issues:');
  console.log('==================');
  
  // Beneficiaries with admin roles
  const beneficiariesWithAdminRoles = users.filter(user => 
    user.role === 'BENEFICIARY' && (user.kebele?.includes('Admin') || user.fullName?.includes('Admin'))
  );
  if (beneficiariesWithAdminRoles.length > 0) {
    console.log(`❌ Beneficiaries with admin-like names/kebeles: ${beneficiariesWithAdminRoles.length}`);
    beneficiariesWithAdminRoles.forEach((user: any) => {
      console.log(`  - ${user.fullName} (${user.email}) - Role: ${user.role}, Kebele: ${user.kebele}`);
    });
  }

  // Admins with beneficiary-like data
  const adminsWithBeneficiaryData = users.filter(user => 
    (user.role === 'KEBELE_ADMIN' || user.role === 'WOREDA_ADMIN') && 
    user.nationalIdNumber && 
    !user.kebele?.includes('Kebele')
  );
  if (adminsWithBeneficiaryData.length > 0) {
    console.log(`❌ Admins with beneficiary-like data: ${adminsWithBeneficiaryData.length}`);
    adminsWithBeneficiaryData.forEach((user: any) => {
      console.log(`  - ${user.fullName} (${user.email}) - Role: ${user.role}, National ID: ${user.nationalIdNumber}`);
    });
  }

  console.log('\n✅ User role check completed!');
}

checkUserRoles()
  .catch((error) => {
    console.error('Error checking user roles:', error);
    process.exit(1);
  })
  .finally(() => {
    prisma.$disconnect();
  });
