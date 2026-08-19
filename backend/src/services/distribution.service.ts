import { prisma } from '../prisma/client';
import { generateDistributionNumber, generateReceiptVerificationCode } from '../utils/codeGenerator';
import { NotificationService } from './notification.service';

export class DistributionService {
  static async getAll(kebele?: string) {
    const where: any = {};
    if (kebele) where.kebele = { contains: kebele, mode: 'insensitive' };

    return prisma.distributionRecord.findMany({
      where,
      include: {
        request: true,
        donation: true,
      },
      orderBy: { completedAt: 'desc' },
    });
  }

  static async verifyReceiptCode(code: string) {
    const record = await prisma.distributionRecord.findUnique({
      where: { receiptVerificationCode: code.trim() },
      include: {
        request: true,
      },
    });

    if (!record) {
      return { isValid: false, message: 'Invalid verification code' };
    }

    return { isValid: true, record };
  }

  static async recordDistribution(data: {
    requestId: string;
    beneficiaryName: string;
    beneficiaryPhone: string;
    kebele: string;
    woreda: string;
    donationId: string;
    itemsOrAmountDistributed: string;
    distributedByKebeleAdmin: string;
    signatureMock?: string;
    deliveryPhotoUrl?: string;
  }) {
    const distributionNumber = generateDistributionNumber();
    const receiptVerificationCode = generateReceiptVerificationCode(data.kebele);

    const request = await prisma.beneficiaryRequest.findUnique({
      where: { id: data.requestId },
    });

    if (!request) {
      throw { statusCode: 404, message: 'Beneficiary request not found' };
    }

    if (!data.donationId) {
      throw { statusCode: 400, message: 'A valid donation ID is required to record a distribution.' };
    }

    const donationExists = await prisma.donation.findUnique({
      where: { id: data.donationId },
    });

    if (!donationExists) {
      throw { statusCode: 400, message: `Failed to record distribution. Donation with ID ${data.donationId} does not exist.` };
    }

    // First, mark request as IN_DISTRIBUTION
    await prisma.beneficiaryRequest.update({
      where: { id: data.requestId },
      data: {
        status: 'IN_DISTRIBUTION',
        statusHistory: {
          create: {
            status: 'IN_DISTRIBUTION',
            updatedBy: data.distributedByKebeleAdmin,
            comment: 'Distribution dispatched to Kebele for handover.',
          },
        },
      },
    });

    // Notify beneficiary about distribution
    if (request) {
      await NotificationService.create({
        userId: request.beneficiaryId,
        title: 'Distribution in Progress',
        message: `Your support items for "${request.title}" are being distributed. Receipt code: ${receiptVerificationCode}`,
        type: 'INFO',
        link: `/distributions/${distributionNumber}`,
      });
    }

    const distribution = await prisma.distributionRecord.create({
      data: {
        distributionNumber,
        requestId: data.requestId,
        beneficiaryName: data.beneficiaryName,
        beneficiaryPhone: data.beneficiaryPhone,
        kebele: data.kebele,
        woreda: data.woreda,
        donationId: data.donationId,
        itemsOrAmountDistributed: data.itemsOrAmountDistributed,
        distributedByKebeleAdmin: data.distributedByKebeleAdmin,
        confirmedByBeneficiary: true,
        deliveryPhotoUrl: data.deliveryPhotoUrl,
        signatureMock: data.signatureMock,
        receiptVerificationCode,
      },
    });

    // Mark request COMPLETED after successful distribution
    await prisma.beneficiaryRequest.update({
      where: { id: data.requestId },
      data: {
        status: 'COMPLETED',
        statusHistory: {
          create: {
            status: 'COMPLETED',
            updatedBy: data.distributedByKebeleAdmin,
            comment: 'Distribution completed and verified with receipt code.',
          },
        },
      },
    });

    // Notify beneficiary about completion
    if (request) {
      await NotificationService.create({
        userId: request.beneficiaryId,
        title: 'Distribution Completed',
        message: `Your support items for "${request.title}" have been successfully distributed. Thank you for using Adama Support Portal.`,
        type: 'SUCCESS',
        link: `/distributions/${distributionNumber}`,
      });
    }

    return distribution;
  }

  static async initiateDistribution(requestId: string, initiatedBy: string) {
    // Mark request as IN_DISTRIBUTION when Kebele admin starts dispatch
    const request = await prisma.beneficiaryRequest.update({
      where: { id: requestId },
      data: {
        status: 'IN_DISTRIBUTION',
        statusHistory: {
          create: {
            status: 'IN_DISTRIBUTION',
            updatedBy: initiatedBy,
            comment: 'Distribution dispatch initiated by Kebele Admin.',
          },
        },
      },
      include: {
        donations: true,
      },
    });

    return request;
  }

  static async confirmBeneficiaryReceipt(distributionId: string, confirmedBy: string) {
    const distribution = await prisma.distributionRecord.update({
      where: { id: distributionId },
      data: {
        confirmedByBeneficiary: true,
      },
      include: {
        request: true,
      },
    });

    // Mark request as COMPLETED
    await prisma.beneficiaryRequest.update({
      where: { id: distribution.requestId },
      data: {
        status: 'COMPLETED',
        statusHistory: {
          create: {
            status: 'COMPLETED',
            updatedBy: confirmedBy,
            comment: 'Beneficiary confirmed receipt of distributed items.',
          },
        },
      },
    });

    return distribution;
  }
}
