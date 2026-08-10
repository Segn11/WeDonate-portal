import { prisma } from '../prisma/client';

export class AnalyticsService {
  static async getMonthlyTrends() {
    const donations = await prisma.donation.findMany({
      where: {
        type: 'MONEY',
        status: 'CONFIRMED',
      },
      select: {
        amountEtb: true,
        createdAt: true,
      },
    });

    // Group by month
    const monthlyMap = new Map<string, number>();
    
    donations.forEach((donation) => {
      if (donation.amountEtb) {
        const date = new Date(donation.createdAt);
        const monthKey = date.toLocaleString('en-US', { month: 'short', year: '2-digit' });
        monthlyMap.set(monthKey, (monthlyMap.get(monthKey) || 0) + Number(donation.amountEtb));
      }
    });

    // Convert to array and sort by date
    const monthlyData = Array.from(monthlyMap.entries())
      .map(([month, total]) => ({ month, total }))
      .sort((a, b) => {
        const [aMonth, aYear] = a.month.split(' ');
        const [bMonth, bYear] = b.month.split(' ');
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        if (aYear !== bYear) return parseInt(aYear) - parseInt(bYear);
        return months.indexOf(aMonth) - months.indexOf(bMonth);
      });

    // Return last 6 months
    return monthlyData.slice(-6);
  }

  static async getCategoryDistribution() {
    const requests = await prisma.beneficiaryRequest.findMany({
      where: {
        status: {
          in: ['APPROVED_PUBLISHED', 'PARTIALLY_FUNDED', 'FULLY_FUNDED', 'IN_DISTRIBUTION', 'COMPLETED'],
        },
      },
      select: {
        category: true,
        estimatedAmountNeededEtb: true,
      },
    });

    const categoryMap = new Map<string, number>();
    const categoryColors: Record<string, string> = {
      MEDICAL_HEALTH: '#0284c7',
      FOOD_SUPPLIES: '#10b981',
      HOUSING_SHELTER: '#8b5cf6',
      EDUCATION_SCHOOLING: '#f59e0b',
      DISABILITY_ASSISTANCE: '#ec4899',
      CLOTHING_ESSENTIALS: '#06b6d4',
      EMERGENCY_RELIEF: '#ef4444',
      SKILL_TRAINING: '#8b5cf6',
    };

    const categoryNames: Record<string, string> = {
      MEDICAL_HEALTH: 'Medical',
      FOOD_SUPPLIES: 'Food Rations',
      HOUSING_SHELTER: 'Housing',
      EDUCATION_SCHOOLING: 'Education',
      DISABILITY_ASSISTANCE: 'Disability',
      CLOTHING_ESSENTIALS: 'Clothing',
      EMERGENCY_RELIEF: 'Emergency',
      SKILL_TRAINING: 'Training',
    };

    requests.forEach((request) => {
      const category = request.category;
      const amount = Number(request.estimatedAmountNeededEtb);
      categoryMap.set(category, (categoryMap.get(category) || 0) + amount);
    });

    const categoryData = Array.from(categoryMap.entries())
      .map(([category, value]) => ({
        name: categoryNames[category] || category,
        value,
        color: categoryColors[category] || '#64748b',
      }))
      .sort((a, b) => b.value - a.value);

    return categoryData;
  }

  static async getOverviewStats() {
    const [
      totalRequests,
      totalDonations,
      totalDistributions,
      pendingRequests,
      completedRequests,
    ] = await Promise.all([
      prisma.beneficiaryRequest.count(),
      prisma.donation.count(),
      prisma.distributionRecord.count(),
      prisma.beneficiaryRequest.count({
        where: {
          status: {
            in: ['SUBMITTED', 'UNDER_KEBELE_REVIEW', 'APPROVED_BY_KEBELE', 'UNDER_WOREDA_REVIEW'],
          },
        },
      }),
      prisma.beneficiaryRequest.count({
        where: { status: 'COMPLETED' },
      }),
    ]);

    const totalDonationAmount = await prisma.donation.aggregate({
      where: { type: 'MONEY' },
      _sum: { amountEtb: true },
    });

    const totalDistributionAmount = await prisma.donation.aggregate({
      _sum: { amountEtb: true },
    });

    return {
      totalRequests,
      totalDonations,
      totalDistributions,
      pendingRequests,
      completedRequests,
      totalDonationAmount: Number(totalDonationAmount._sum.amountEtb || 0),
      totalDistributionAmount: Number(totalDistributionAmount._sum.amountEtb || 0),
    };
  }

  static async getKebeleStats(kebele?: string) {
    const where: any = {};
    if (kebele) where.kebele = { contains: kebele, mode: 'insensitive' };

    const requests = await prisma.beneficiaryRequest.findMany({
      where,
      select: {
        kebele: true,
        status: true,
        estimatedAmountNeededEtb: true,
        amountRaisedEtb: true,
      },
    });

    const kebeleMap = new Map<string, { total: number; funded: number; completed: number }>();

    requests.forEach((request) => {
      const k = request.kebele;
      if (!kebeleMap.has(k)) {
        kebeleMap.set(k, { total: 0, funded: 0, completed: 0 });
      }
      const stats = kebeleMap.get(k)!;
      stats.total++;
      if (request.status === 'FULLY_FUNDED' || request.status === 'IN_DISTRIBUTION' || request.status === 'COMPLETED') {
        stats.funded++;
      }
      if (request.status === 'COMPLETED') {
        stats.completed++;
      }
    });

    return Array.from(kebeleMap.entries()).map(([kebele, stats]) => ({
      kebele,
      ...stats,
    }));
  }
}
