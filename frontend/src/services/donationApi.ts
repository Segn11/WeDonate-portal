const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api/v1';

export interface DonationData {
  donorId: string;
  donorName: string;
  donorEmail: string;
  donorType?: 'INDIVIDUAL' | 'COMPANY' | 'NGO' | 'DIASPORA';
  requestId?: string;
  targetCategory?: string;
  type: 'MONEY' | 'PHYSICAL_ITEM' | 'SERVICE';
  amountEtb?: number;
  itemsDescription?: string;
  quantity?: number;
  unit?: string;
  paymentMethod?: string;
  transactionRef?: string;
}

export interface Donation {
  id: string;
  donationNumber: string;
  donorId: string;
  donorName: string;
  donorEmail: string;
  donorType: string;
  requestId: string | null;
  targetCategory: string | null;
  type: string;
  amountEtb: number | null;
  itemsDescription: string | null;
  quantity: number | null;
  unit: string | null;
  paymentMethod: string | null;
  transactionRef: string | null;
  status: string;
  assignedToRequestId: string | null;
  receiptUrl: string | null;
  createdAt: string;
}

export const donationApi = {
  async getAllDonations(donorId?: string, requestId?: string): Promise<Donation[]> {
    const params = new URLSearchParams();
    if (donorId) params.append('donorId', donorId);
    if (requestId) params.append('requestId', requestId);

    const headers: Record<string, string> = {};
    const token = localStorage.getItem('auth_token');
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${API_BASE_URL}/donations?${params.toString()}`, {
      headers,
    });

    if (!response.ok) {
      throw new Error('Failed to fetch donations');
    }

    const data = await response.json();
    return data.data || data;
  },

  async createDonation(donationData: DonationData): Promise<Donation> {
    const response = await fetch(`${API_BASE_URL}/donations`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('auth_token')}`,
      },
      body: JSON.stringify(donationData),
    });

    if (!response.ok) {
      throw new Error('Failed to create donation');
    }

    const data = await response.json();
    return data.data || data;
  },

  async getDonationsByRequest(requestId: string): Promise<Donation[]> {
    return this.getAllDonations(undefined, requestId);
  },
};
