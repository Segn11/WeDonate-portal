export type UserRole = 
  | 'DONOR'
  | 'BENEFICIARY'
  | 'KEBELE_ADMIN'
  | 'WOREDA_ADMIN'
  | 'CITY_ADMIN'
  | 'SYSTEM_ADMIN';

export type RequestStatus = 
  | 'DRAFT'
  | 'SUBMITTED'
  | 'UNDER_KEBELE_REVIEW'
  | 'APPROVED_BY_KEBELE'
  | 'UNDER_WOREDA_REVIEW'
  | 'APPROVED_PUBLISHED'
  | 'PARTIALLY_FUNDED'
  | 'FULLY_FUNDED'
  | 'IN_DISTRIBUTION'
  | 'COMPLETED'
  | 'REJECTED';

export type SupportCategory = 
  | 'FOOD_SUPPLIES'
  | 'MEDICAL_HEALTH'
  | 'EDUCATION_SCHOOLING'
  | 'HOUSING_SHELTER'
  | 'CLOTHING_ESSENTIALS'
  | 'DISABILITY_ASSISTANCE'
  | 'EMERGENCY_RELIEF'
  | 'SKILL_TRAINING';

export type UrgencyLevel = 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';

export type DonationType = 'MONEY' | 'PHYSICAL_ITEM' | 'SERVICE';

export type PaymentMethod = 'TELEBIRR' | 'CBE_BIRR' | 'BANK_TRANSFER' | 'CARD' | 'PHYSICAL_HANDOVER';

export interface User {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  role: UserRole;
  avatarUrl?: string;
  kebele?: string;
  woreda?: string;
  city?: string;
  nationalIdNumber?: string;
  orgName?: string;
  orgRegNumber?: string;
  googleId?: string;
  googleConnected?: boolean;
  isVerified: boolean;
  status: 'ACTIVE' | 'PENDING_VERIFICATION' | 'SUSPENDED';
  createdAt: string;
  bio?: string;
  address?: string;
  taxId?: string;
  website?: string;
  department?: string;
  donorType?: 'INDIVIDUAL' | 'COMPANY' | 'NGO' | 'DIASPORA';
  householdSize?: number;
  language?: 'en' | 'om' | 'am';
  emailNotifications?: boolean;
  smsNotifications?: boolean;
  twoFactorEnabled?: boolean;
}

export interface BeneficiaryRequest {
  id: string;
  requestNumber: string;
  beneficiaryId: string;
  beneficiaryName: string;
  beneficiaryPhone: string;
  nationalIdNumber: string;
  kebele: string;
  woreda: string;
  category: SupportCategory;
  urgency: UrgencyLevel;
  title: string;
  description: string;
  householdSize: number;
  estimatedAmountNeededEtb: number;
  amountRaisedEtb: number;
  itemQuantityNeeded?: string;
  itemQuantityFulfilled?: string;
  status: RequestStatus;
  statusHistory: {
    status: RequestStatus;
    updatedAt: string;
    updatedBy: string;
    comment?: string;
  }[];
  documents: {
    id: string;
    name: string;
    type: string; // 'KEBELE_ID' | 'INCOME_LETTER' | 'MEDICAL_DOC' | 'PROOF_PHOTO'
    url: string;
    sizeKb: number;
    uploadedAt: string;
  }[];
  verificationNotes?: {
    kebeleApprovedBy?: string;
    kebeleApprovalDate?: string;
    woredaApprovedBy?: string;
    woredaApprovalDate?: string;
    rejectionReason?: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface Donation {
  id: string;
  donationNumber: string;
  donorId: string;
  donorName: string;
  donorEmail: string;
  donorType: 'INDIVIDUAL' | 'COMPANY' | 'NGO' | 'DIASPORA';
  requestId?: string; // Optional target request or general pool
  targetCategory?: SupportCategory;
  type: DonationType;
  amountEtb?: number;
  itemsDescription?: string;
  quantity?: number;
  unit?: string;
  paymentMethod?: PaymentMethod;
  transactionRef?: string;
  status: 'PENDING' | 'CONFIRMED' | 'ASSIGNED' | 'DISTRIBUTED';
  assignedToRequestId?: string;
  receiptUrl?: string;
  createdAt: string;
}

export interface DistributionRecord {
  id: string;
  distributionNumber: string;
  requestId: string;
  beneficiaryName: string;
  beneficiaryPhone: string;
  kebele: string;
  woreda: string;
  donationId: string;
  itemsOrAmountDistributed: string;
  distributedByKebeleAdmin: string;
  confirmedByBeneficiary: boolean;
  deliveryPhotoUrl?: string;
  signatureMock?: string;
  completedAt: string;
  receiptVerificationCode: string;
}

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'INFO' | 'SUCCESS' | 'WARNING' | 'ALERT';
  read: boolean;
  link?: string;
  createdAt: string;
}

export interface AuditLog {
  id: string;
  userId: string;
  userName: string;
  role: UserRole;
  action: string;
  module: string;
  ipAddress: string;
  timestamp: string;
  details: string;
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH';
}
