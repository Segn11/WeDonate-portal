import { Request, Response, NextFunction } from 'express';
import { DonationService } from '../services/donation.service';
import { sendSuccess } from '../utils/response';

export class DonationController {
  static async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const { donorId, requestId } = req.query;
      const donations = await DonationService.getAll(
        donorId as string,
        requestId as string
      );
      return sendSuccess(res, donations, 'Fetched donations');
    } catch (error) {
      next(error);
    }
  }

  static async create(req: Request, res: Response, next: NextFunction) {
    try {
      const donation = await DonationService.createDonation(req.body);
      return sendSuccess(res, donation, 'Donation processed successfully', 201);
    } catch (error) {
      next(error);
    }
  }

  static async createGuest(req: Request, res: Response, next: NextFunction) {
    try {
      const donation = await DonationService.createDonation({
        ...req.body,
        donorId: null, // Guest donations don't have a user ID
        donorType: req.body.donorType || 'INDIVIDUAL',
      });
      return sendSuccess(res, donation, 'Guest donation processed successfully', 201);
    } catch (error) {
      next(error);
    }
  }
}
