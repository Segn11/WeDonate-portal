import { Request, Response, NextFunction } from 'express';
import { prisma } from '../prisma/client';
import { sendSuccess } from '../utils/response';

export class StatisticsController {
  static async getPublicStats(req: Request, res: Response, next: NextFunction) {
    try {
      // Get total funds raised from donations (all statuses, not just COMPLETED)
      const donations = await prisma.donation.findMany();
      const totalRaisedEtb = donations.reduce((sum, d) => {
        const amount = d.amountEtb ? Number(d.amountEtb) : 0;
        return sum + amount;
      }, 0);

      // Get unique beneficiaries from distributions
      const distributions = await prisma.distributionRecord.findMany();
      const uniqueBeneficiaries = new Set(distributions.map(d => d.beneficiaryName)).size;

      // Get unique active kebeles from requests
      const requests = await prisma.beneficiaryRequest.findMany({
        where: {
          status: {
            in: ['APPROVED_PUBLISHED', 'PARTIALLY_FUNDED', 'IN_DISTRIBUTION', 'COMPLETED']
          }
        }
      });
      const uniqueKebeles = new Set(requests.map(r => r.kebele)).size;

      const stats = {
        totalRaisedEtb,
        totalBeneficiaries: uniqueBeneficiaries,
        activeKebeles: uniqueKebeles,
        totalDistributions: distributions.length,
        totalRequests: requests.length,
      };

      return sendSuccess(res, stats, 'Public statistics fetched successfully');
    } catch (error) {
      console.error('Error fetching statistics:', error);
      // Return default values on error to prevent frontend from breaking
      const defaultStats = {
        totalRaisedEtb: 0,
        totalBeneficiaries: 0,
        activeKebeles: 0,
        totalDistributions: 0,
        totalRequests: 0,
      };
      return sendSuccess(res, defaultStats, 'Public statistics fetched (using defaults due to error)');
    }
  }
}
