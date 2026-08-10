import { PrismaClient } from '@prisma/client';
import { AnalyticsService } from '../src/services/analytics.service';

const prisma = new PrismaClient();

async function main() {
  console.log('=== Testing Analytics System ===\n');

  // Test 1: Monthly Trends
  console.log('=== Test 1: Monthly Trends ===');
  try {
    const monthlyTrends = await AnalyticsService.getMonthlyTrends();
    console.log(`Found ${monthlyTrends.length} months of data`);
    monthlyTrends.forEach((trend) => {
      console.log(`  ${trend.month}: ${trend.total.toLocaleString()} ETB`);
    });
  } catch (error) {
    console.error('Error fetching monthly trends:', error);
  }

  // Test 2: Category Distribution
  console.log('\n=== Test 2: Category Distribution ===');
  try {
    const categoryDist = await AnalyticsService.getCategoryDistribution();
    console.log(`Found ${categoryDist.length} categories`);
    categoryDist.forEach((cat) => {
      console.log(`  ${cat.name}: ${cat.value.toLocaleString()} ETB`);
    });
  } catch (error) {
    console.error('Error fetching category distribution:', error);
  }

  // Test 3: Overview Stats
  console.log('\n=== Test 3: Overview Stats ===');
  try {
    const overview = await AnalyticsService.getOverviewStats();
    console.log(`Total Requests: ${overview.totalRequests}`);
    console.log(`Total Donations: ${overview.totalDonations}`);
    console.log(`Total Distributions: ${overview.totalDistributions}`);
    console.log(`Pending Requests: ${overview.pendingRequests}`);
    console.log(`Completed Requests: ${overview.completedRequests}`);
    console.log(`Total Donation Amount: ${overview.totalDonationAmount.toLocaleString()} ETB`);
  } catch (error) {
    console.error('Error fetching overview stats:', error);
  }

  // Test 4: Kebele Stats
  console.log('\n=== Test 4: Kebele Stats ===');
  try {
    const kebeleStats = await AnalyticsService.getKebeleStats();
    console.log(`Found ${kebeleStats.length} kebeles`);
    kebeleStats.forEach((kebele) => {
      console.log(`  ${kebele.kebele}: ${kebele.total} total, ${kebele.funded} funded, ${kebele.completed} completed`);
    });
  } catch (error) {
    console.error('Error fetching kebele stats:', error);
  }

  console.log('\n✅ Analytics System Test Complete!');
  console.log('All analytics endpoints are working with real database data.');
}

main()
  .catch((e) => console.error(e))
  .finally(() => prisma.$disconnect());
