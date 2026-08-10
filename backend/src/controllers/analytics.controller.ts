import { Request, Response, NextFunction } from 'express';
import { AnalyticsService } from '../services/analytics.service';
import { sendSuccess } from '../utils/response';

export class AnalyticsController {
  static async getMonthlyTrends(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await AnalyticsService.getMonthlyTrends();
      return sendSuccess(res, data, 'Fetched monthly trends');
    } catch (error) {
      next(error);
    }
  }

  static async getCategoryDistribution(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await AnalyticsService.getCategoryDistribution();
      return sendSuccess(res, data, 'Fetched category distribution');
    } catch (error) {
      next(error);
    }
  }

  static async getOverviewStats(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await AnalyticsService.getOverviewStats();
      return sendSuccess(res, data, 'Fetched overview stats');
    } catch (error) {
      next(error);
    }
  }

  static async getKebeleStats(req: Request, res: Response, next: NextFunction) {
    try {
      const { kebele } = req.query;
      const data = await AnalyticsService.getKebeleStats(kebele as string);
      return sendSuccess(res, data, 'Fetched kebele stats');
    } catch (error) {
      next(error);
    }
  }
}
