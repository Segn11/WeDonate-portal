import { prisma } from '../prisma/client';
import { RequestStatus, SupportCategory, UrgencyLevel } from '@prisma/client';
import { generateRequestNumber } from '../utils/codeGenerator';

export class RequestService {
  static async getAllRequests(filters: {
    status?: RequestStatus;
    kebele?: string;
    woreda?: string;
    category?: SupportCategory;
    search?: string;
  }) {
    const where: any = {};

    if (filters.status) where.status = filters.status;
    if (filters.kebele) where.kebele = { contains: filters.kebele, mode: 'insensitive' };
    if (filters.woreda) where.woreda = { contains: filters.woreda, mode: 'insensitive' };
    if (filters.category) where.category = filters.category;
    if (filters.search) {
      where.OR = [
        { title: { contains: filters.search, mode: 'insensitive' } },
        { description: { contains: filters.search, mode: 'insensitive' } },
        { beneficiaryName: { contains: filters.search, mode: 'insensitive' } },
        { requestNumber: { contains: filters.search, mode: 'insensitive' } },
      ];
    }

    return prisma.beneficiaryRequest.findMany({
      where,
      include: {
        documents: true,
        statusHistory: { orderBy: { updatedAt: 'desc' } },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  static async getById(id: string) {
    const request = await prisma.beneficiaryRequest.findUnique({
      where: { id },
      include: {
        documents: true,
        statusHistory: { orderBy: { updatedAt: 'desc' } },
        donations: true,
      },
    });

    if (!request) {
      throw { statusCode: 404, message: 'Support request not found' };
    }

    return request;
  }

  static async createRequest(data: {
    beneficiaryId: string;
    beneficiaryName: string;
    beneficiaryPhone: string;
    nationalIdNumber: string;
    kebele: string;
    woreda: string;
    category: SupportCategory;
    urgency?: UrgencyLevel;
    title: string;
    description: string;
    householdSize?: number;
    estimatedAmountNeededEtb: number;
    documents?: { name: string; type: string; url: string; sizeKb: number }[];
  }) {
    const requestNumber = generateRequestNumber();

    return prisma.beneficiaryRequest.create({
      data: {
        requestNumber,
        beneficiaryId: data.beneficiaryId,
        beneficiaryName: data.beneficiaryName,
        beneficiaryPhone: data.beneficiaryPhone,
        nationalIdNumber: data.nationalIdNumber,
        kebele: data.kebele,
        woreda: data.woreda,
        category: data.category,
        urgency: data.urgency || 'MEDIUM',
        title: data.title,
        description: data.description,
        householdSize: data.householdSize || 1,
        estimatedAmountNeededEtb: data.estimatedAmountNeededEtb,
        amountRaisedEtb: 0,
        status: 'SUBMITTED',
        statusHistory: {
          create: {
            status: 'SUBMITTED',
            updatedBy: data.beneficiaryName,
            comment: 'New support request submitted for Kebele verification.',
          },
        },
        documents: data.documents
          ? {
              create: data.documents.map((doc) => ({
                name: doc.name,
                type: doc.type,
                url: doc.url,
                sizeKb: doc.sizeKb,
              })),
            }
          : undefined,
      },
      include: {
        documents: true,
        statusHistory: true,
      },
    });
  }

  static async updateStatus(
    requestId: string,
    newStatus: RequestStatus,
    updatedBy: string,
    comment?: string,
    rejectionReason?: string
  ) {
    const existing = await prisma.beneficiaryRequest.findUnique({
      where: { id: requestId },
    });

    if (!existing) {
      throw { statusCode: 404, message: 'Support request not found' };
    }

    const updateData: any = {
      status: newStatus,
      statusHistory: {
        create: {
          status: newStatus,
          updatedBy,
          comment: comment || rejectionReason,
        },
      },
    };

    if (newStatus === 'APPROVED_BY_KEBELE') {
      updateData.kebeleApprovedBy = updatedBy;
      updateData.kebeleApprovalDate = new Date();
    } else if (newStatus === 'APPROVED_PUBLISHED') {
      updateData.woredaApprovedBy = updatedBy;
      updateData.woredaApprovalDate = new Date();
    } else if (newStatus === 'REJECTED') {
      updateData.rejectionReason = rejectionReason || comment;
    }

    return prisma.beneficiaryRequest.update({
      where: { id: requestId },
      data: updateData,
      include: {
        statusHistory: { orderBy: { updatedAt: 'desc' } },
      },
    });
  }

  static async checkDuplicateNationalId(nationalId: string, currentRequestId?: string) {
    const where: any = {
      nationalIdNumber: { equals: nationalId.trim(), mode: 'insensitive' },
      status: { notIn: ['REJECTED', 'COMPLETED'] },
    };

    if (currentRequestId) {
      where.id = { not: currentRequestId };
    }

    const existing = await prisma.beneficiaryRequest.findMany({
      where,
      select: {
        id: true,
        requestNumber: true,
        beneficiaryName: true,
        kebele: true,
        status: true,
        createdAt: true,
      },
    });

    return {
      isDuplicate: existing.length > 0,
      existingRequests: existing,
    };
  }
}
