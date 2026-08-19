const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api/v1';

export interface DistributionData {
  requestId: string;
  beneficiaryName: string;
  beneficiaryPhone: string;
  kebele: string;
  woreda: string;
  donationId: string;
  itemsOrAmountDistributed: string;
  distributedByKebeleAdmin: string;
  confirmedByBeneficiary?: boolean;
  deliveryPhotoUrl?: string;
  signatureMock?: string;
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
  deliveryPhotoUrl: string | null;
  signatureMock: string | null;
  receiptVerificationCode: string;
  completedAt: string;
}

export const distributionApi = {
  async getAllDistributions(kebele?: string): Promise<DistributionRecord[]> {
    const params = new URLSearchParams();
    if (kebele) params.append('kebele', kebele);

    const response = await fetch(`${API_BASE_URL}/distributions?${params.toString()}`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('auth_token')}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch distributions');
    }

    const data = await response.json();
    return data.data || data;
  },

  async createDistribution(distributionData: DistributionData): Promise<DistributionRecord> {
    const response = await fetch(`${API_BASE_URL}/distributions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('auth_token')}`,
      },
      body: JSON.stringify(distributionData),
    });

    if (!response.ok) {
      let errorMsg = 'Failed to create distribution';
      try {
        const errorData = await response.json();
        if (errorData && errorData.message) errorMsg = errorData.message;
      } catch (e) {
        // ignore JSON parse error
      }
      throw new Error(errorMsg);
    }

    const data = await response.json();
    return data.data || data;
  },

  async verifyReceiptCode(code: string): Promise<any> {
    const response = await fetch(`${API_BASE_URL}/distributions/verify/${code}`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('auth_token')}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to verify receipt code');
    }

    const data = await response.json();
    return data.data || data;
  },

  async initiateDistribution(requestId: string, initiatedBy: string): Promise<any> {
    const response = await fetch(`${API_BASE_URL}/distributions/initiate/${requestId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('auth_token')}`,
      },
      body: JSON.stringify({ initiatedBy }),
    });

    if (!response.ok) {
      throw new Error('Failed to initiate distribution');
    }

    const data = await response.json();
    return data.data || data;
  },

  async confirmBeneficiaryReceipt(distributionId: string, confirmedBy: string): Promise<DistributionRecord> {
    const response = await fetch(`${API_BASE_URL}/distributions/confirm/${distributionId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('auth_token')}`,
      },
      body: JSON.stringify({ confirmedBy }),
    });

    if (!response.ok) {
      throw new Error('Failed to confirm beneficiary receipt');
    }

    const data = await response.json();
    return data.data || data;
  },
};
