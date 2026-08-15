import { Request, Response, NextFunction } from 'express';
import { RequestService } from '../services/request.service';
import { sendSuccess, sendError } from '../utils/response';

export class RequestController {
  static async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const { status, kebele, woreda, category, search } = req.query;
      const requests = await RequestService.getAllRequests({
        status: status as any,
        kebele: kebele as string,
        woreda: woreda as string,
        category: category as any,
        search: search as string,
      });
      return sendSuccess(res, requests, 'Fetched support requests');
    } catch (error) {
      next(error);
    }
  }

  static async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const idStr = Array.isArray(id) ? id[0] : id;
      const request = await RequestService.getById(idStr);
      return sendSuccess(res, request, 'Fetched request details');
    } catch (error: any) {
      if (error.statusCode) {
        return sendError(res, error.message, error.statusCode);
      }
      next(error);
    }
  }

  static async create(req: Request, res: Response, next: NextFunction) {
    try {
      const newReq = await RequestService.createRequest(req.body);
      return sendSuccess(res, newReq, 'Support request submitted successfully', 201);
    } catch (error) {
      next(error);
    }
  }

  static async updateStatus(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const idStr = Array.isArray(id) ? id[0] : id;
      const { status, comment, rejectionReason } = req.body;
      const updatedBy = req.user?.fullName || 'Official Admin';

      const updated = await RequestService.updateStatus(
        idStr,
        status,
        updatedBy,
        comment,
        rejectionReason
      );

      return sendSuccess(res, updated, `Request status updated to ${status}`);
    } catch (error: any) {
      if (error.statusCode) {
        return sendError(res, error.message, error.statusCode);
      }
      next(error);
    }
  }

  static async checkDuplicate(req: Request, res: Response, next: NextFunction) {
    try {
      const { nationalId, currentRequestId } = req.query;
      if (!nationalId) {
        return sendError(res, 'nationalId query parameter is required', 400);
      }

      const result = await RequestService.checkDuplicateNationalId(
        nationalId as string,
        currentRequestId as string
      );

      return sendSuccess(res, result, 'Duplicate national ID check completed');
    } catch (error) {
      next(error);
    }
  }
}
