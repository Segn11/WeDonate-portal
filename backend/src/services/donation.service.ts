import { prisma } from '../prisma/client';
import { DonationType, PaymentMethod, SupportCategory, DonorClassification } from '@prisma/client';
import { generateDonationNumber } from '../utils/codeGenerator';

export class DonationService {
  static async getAll(donorId?: string, requestId?: string) {
    const where: any = {};
    if (donorId) where.donorId = donorId;
    if (requestId) where.requestId = requestId;

    return prisma.donation.findMany({
      where,
      include: {
        request: true,
        donor: { select: { id: true, fullName: true, email: true, role: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  static async createDonation(data: {
    donorId: string | null;
    donorName: string;
    donorEmail: string;
    donorType?: DonorClassification;
    requestId?: string;
    targetCategory?: SupportCategory;
    type: DonationType;
    amountEtb?: number;
    itemsDescription?: string;
    quantity?: number;
    unit?: string;
    paymentMethod?: PaymentMethod;
    transactionRef?: string;
  }) {
    const donationNumber = generateDonationNumber();

    const donationData: any = {
      donationNumber,
      donorName: data.donorName,
      donorEmail: data.donorEmail,
      donorType: data.donorType || 'INDIVIDUAL',
      requestId: data.requestId,
      targetCategory: data.targetCategory,
      type: data.type,
      amountEtb: data.amountEtb,
      itemsDescription: data.itemsDescription,
      quantity: data.quantity,
      unit: data.unit,
      paymentMethod: data.paymentMethod,
      transactionRef: data.transactionRef,
      status: data.requestId ? 'CONFIRMED' : 'PENDING',
      assignedToRequestId: data.requestId,
    };

    // Only include donorId if provided (for authenticated users)
    if (data.donorId) {
      donationData.donorId = data.donorId;
    }

    const donation = await prisma.donation.create({
      data: donationData,
      include: {
        request: true,
      },
    });

    // Update target request raised amount if monetary donation
    if (data.requestId && data.amountEtb) {
      const targetReq = await prisma.beneficiaryRequest.findUnique({
        where: { id: data.requestId },
      });

      if (targetReq) {
        const newRaised = Number(targetReq.amountRaisedEtb) + data.amountEtb;
        let newStatus = targetReq.status;
        
        if (newRaised >= Number(targetReq.estimatedAmountNeededEtb)) {
          newStatus = 'FULLY_FUNDED';
          
          // Add status history for funding completion
          await prisma.requestStatusHistory.create({
            data: {
              requestId: data.requestId,
              status: 'FULLY_FUNDED',
              updatedBy: data.donorName,
              comment: `Target goal met. Total raised: ${newRaised.toLocaleString()} ETB. Ready for distribution dispatch.`,
            },
          });
        } else if (newRaised > 0 && targetReq.status === 'APPROVED_PUBLISHED') {
          newStatus = 'PARTIALLY_FUNDED';
          
          await prisma.requestStatusHistory.create({
            data: {
              requestId: data.requestId,
              status: 'PARTIALLY_FUNDED',
              updatedBy: data.donorName,
              comment: `Partial funding received. Raised: ${newRaised.toLocaleString()} ETB of ${targetReq.estimatedAmountNeededEtb.toLocaleString()} ETB.`,
            },
          });
        }

        await prisma.beneficiaryRequest.update({
          where: { id: data.requestId },
          data: {
            amountRaisedEtb: newRaised,
            status: newStatus,
          },
        });
      }
    }

    return donation;
  }
}
