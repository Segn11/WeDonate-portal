import { prisma } from '../prisma/client';
import { RequestStatus, SupportCategory, UrgencyLevel } from '@prisma/client';
import { generateRequestNumber } from '../utils/codeGenerator';
import { NotificationService } from './notification.service';

export class RequestService {
  static async getAllRequests(filters: {
    status?: RequestStatus;
    kebele?: string;
    woreda?: string;
    category?: SupportCategory;
    search?: string;
    userRole?: string;
    userKebele?: string;
    userWoreda?: string;
  }) {
    const where: any = {};

    // Apply role-based access control
    if (filters.userRole === 'KEBELE_ADMIN') {
      // Single Kebele Admin manages all kebeles
    } else if (filters.userRole === 'WOREDA_ADMIN') {
      // Single Woreda Admin manages all woredas
    } else if (filters.userRole === 'BENEFICIARY') {
      // Beneficiaries can only see their own requests (handled by beneficiaryId filter)
      // This would need to be passed separately
    } else if (filters.userRole === 'DONOR') {
      // Donors can only see published requests
      where.status = 'APPROVED_PUBLISHED';
    }
    // CITY_ADMIN and SYSTEM_ADMIN can see all requests

    // Apply additional filters
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
        donations: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  static async getById(id: string, userContext?: {
    userRole?: string;
    userKebele?: string;
    userWoreda?: string;
  }) {
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

    // Apply role-based access control
    if (userContext?.userRole === 'KEBELE_ADMIN') {
      // Single Kebele Admin manages all kebeles
    } else if (userContext?.userRole === 'WOREDA_ADMIN') {
      // Single Woreda Admin manages all woredas
    } else if (userContext?.userRole === 'DONOR') {
      // Donors can only access published requests
      if (request.status !== 'APPROVED_PUBLISHED') {
        throw { statusCode: 403, message: 'You do not have permission to access this request' };
      }
    }
    // CITY_ADMIN and SYSTEM_ADMIN can access all requests

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
    rejectionReason?: string,
    userContext?: {
      userRole?: string;
      userKebele?: string;
      userWoreda?: string;
    }
  ) {
    const existing = await prisma.beneficiaryRequest.findUnique({
      where: { id: requestId },
    });

    if (!existing) {
      throw { statusCode: 404, message: 'Support request not found' };
    }

    // Single Kebele/Woreda admins can approve for any area

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

    const updated = await prisma.beneficiaryRequest.update({
      where: { id: requestId },
      data: updateData,
      include: {
        statusHistory: { orderBy: { updatedAt: 'desc' } },
      },
    });

    // Create notifications based on status change
    if (newStatus === 'APPROVED_BY_KEBELE') {
      await NotificationService.create({
        userId: existing.beneficiaryId,
        title: 'Request Approved by Kebele',
        message: `Your request "${existing.title}" has been approved by Kebele administration. It is now under Woreda review.`,
        type: 'SUCCESS',
        link: `/requests/${requestId}`,
      });
    } else if (newStatus === 'APPROVED_PUBLISHED') {
      await NotificationService.create({
        userId: existing.beneficiaryId,
        title: 'Request Published for Donations',
        message: `Your request "${existing.title}" has been approved by Woreda and is now published for public donations.`,
        type: 'SUCCESS',
        link: `/requests/${requestId}`,
      });
    } else if (newStatus === 'REJECTED') {
      await NotificationService.create({
        userId: existing.beneficiaryId,
        title: 'Request Rejected',
        message: `Your request "${existing.title}" was rejected. Reason: ${rejectionReason || comment}`,
        type: 'WARNING',
        link: `/requests/${requestId}`,
      });
    } else if (newStatus === 'FULLY_FUNDED') {
      await NotificationService.create({
        userId: existing.beneficiaryId,
        title: 'Request Fully Funded',
        message: `Your request "${existing.title}" is fully funded and ready for distribution.`,
        type: 'SUCCESS',
        link: `/requests/${requestId}`,
      });
    }

    return updated;
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
