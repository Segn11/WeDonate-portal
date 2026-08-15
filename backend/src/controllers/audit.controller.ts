import { Request, Response, NextFunction } from 'express';
import { AuditService } from '../services/audit.service';
import { sendSuccess } from '../utils/response';

export class AuditController {
  static async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const { userId, action, module, riskLevel, limit } = req.query;
      const logs = await AuditService.getAll({
        userId: userId as string,
        action: action as string,
        module: module as string,
        riskLevel: riskLevel as 'LOW' | 'MEDIUM' | 'HIGH',
        limit: limit ? parseInt(limit as string) : undefined,
      });
      return sendSuccess(res, logs, 'Fetched audit logs');
    } catch (error) {
      next(error);
    }
  }

  static async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const idStr = Array.isArray(id) ? id[0] : id;
      const log = await AuditService.getById(idStr);
      if (!log) {
        return res.status(404).json({ error: 'Audit log not found' });
      }
      return sendSuccess(res, log, 'Fetched audit log');
    } catch (error) {
      next(error);
    }
  }

  static async create(req: Request, res: Response, next: NextFunction) {
    try {
      const log = await AuditService.create(req.body);
      return sendSuccess(res, log, 'Audit log created successfully', 201);
    } catch (error) {
      next(error);
    }
  }

  static async getByUserId(req: Request, res: Response, next: NextFunction) {
    try {
      const { userId } = req.params;
      const userIdStr = Array.isArray(userId) ? userId[0] : userId;
      const { limit } = req.query;
      const logs = await AuditService.getByUserId(
        userIdStr,
        limit ? parseInt(limit as string) : 50
      );
      return sendSuccess(res, logs, 'Fetched user audit logs');
    } catch (error) {
      next(error);
    }
  }
}
