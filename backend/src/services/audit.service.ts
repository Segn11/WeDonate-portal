import { prisma } from '../prisma/client';

export class AuditService {
  static async getAll(filters?: {
    userId?: string;
    action?: string;
    module?: string;
    riskLevel?: 'LOW' | 'MEDIUM' | 'HIGH';
    limit?: number;
  }) {
    const where: any = {};
    
    if (filters?.userId) where.userId = filters.userId;
    if (filters?.action) where.action = filters.action;
    if (filters?.module) where.module = filters.module;
    if (filters?.riskLevel) where.riskLevel = filters.riskLevel;

    return await prisma.auditLog.findMany({
      where,
      orderBy: { timestamp: 'desc' },
      take: filters?.limit || 100,
    });
  }

  static async create(data: {
    userId: string;
    userName: string;
    role: string;
    action: string;
    module: string;
    ipAddress: string;
    details: string;
    riskLevel?: 'LOW' | 'MEDIUM' | 'HIGH';
  }) {
    return await prisma.auditLog.create({
      data: {
        userId: data.userId,
        userName: data.userName,
        role: data.role as any,
        action: data.action,
        module: data.module,
        ipAddress: data.ipAddress,
        details: data.details,
        riskLevel: data.riskLevel || 'LOW',
      },
    });
  }

  static async getById(id: string) {
    return await prisma.auditLog.findUnique({
      where: { id },
    });
  }

  static async getByUserId(userId: string, limit: number = 50) {
    return await prisma.auditLog.findMany({
      where: { userId },
      orderBy: { timestamp: 'desc' },
      take: limit,
    });
  }
}
