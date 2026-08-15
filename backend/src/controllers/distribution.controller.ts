import { Request, Response, NextFunction } from 'express';
import { DistributionService } from '../services/distribution.service';
import { sendSuccess } from '../utils/response';

export class DistributionController {
  static async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const { kebele } = req.query;
      const records = await DistributionService.getAll(kebele as string);
      return sendSuccess(res, records, 'Fetched distribution records');
    } catch (error) {
      next(error);
    }
  }

  static async verifyCode(req: Request, res: Response, next: NextFunction) {
    try {
      const { code } = req.params;
      const codeStr = Array.isArray(code) ? code[0] : code;
      const result = await DistributionService.verifyReceiptCode(codeStr);
      return sendSuccess(res, result, 'Verification check completed');
    } catch (error) {
      next(error);
    }
  }

  static async create(req: Request, res: Response, next: NextFunction) {
    try {
      const record = await DistributionService.recordDistribution(req.body);
      return sendSuccess(res, record, 'Distribution recorded successfully', 201);
    } catch (error) {
      next(error);
    }
  }

  static async initiateDistribution(req: Request, res: Response, next: NextFunction) {
    try {
      const { requestId } = req.params;
      const requestIdStr = Array.isArray(requestId) ? requestId[0] : requestId;
      const { initiatedBy } = req.body;
      const request = await DistributionService.initiateDistribution(requestIdStr, initiatedBy);
      return sendSuccess(res, request, 'Distribution initiated successfully');
    } catch (error) {
      next(error);
    }
  }

  static async confirmReceipt(req: Request, res: Response, next: NextFunction) {
    try {
      const { distributionId } = req.params;
      const distributionIdStr = Array.isArray(distributionId) ? distributionId[0] : distributionId;
      const { confirmedBy } = req.body;
      const distribution = await DistributionService.confirmBeneficiaryReceipt(distributionIdStr, confirmedBy);
      return sendSuccess(res, distribution, 'Beneficiary receipt confirmed successfully');
    } catch (error) {
      next(error);
    }
  }
}
