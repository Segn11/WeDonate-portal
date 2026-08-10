import { BeneficiaryRequest } from '../types';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api/v1';

const getAuthHeaders = () => {
  const token = localStorage.getItem('auth_token');
  return {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` }),
  };
};

export const requestApi = {
  // Get all requests with filters
  getAllRequests: async (params?: {
    status?: string;
    kebele?: string;
    woreda?: string;
    category?: string;
    search?: string;
  }): Promise<BeneficiaryRequest[]> => {
    const queryParams = new URLSearchParams();
    if (params?.status) queryParams.append('status', params.status);
    if (params?.kebele) queryParams.append('kebele', params.kebele);
    if (params?.woreda) queryParams.append('woreda', params.woreda);
    if (params?.category) queryParams.append('category', params.category);
    if (params?.search) queryParams.append('search', params.search);

    const response = await fetch(`${API_BASE_URL}/requests?${queryParams.toString()}`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });
    const data = await response.json();
    if (!data.success) throw new Error(data.message || 'Failed to fetch requests');
    return data.data;
  },

  // Get request by ID
  getRequestById: async (id: string): Promise<BeneficiaryRequest> => {
    const response = await fetch(`${API_BASE_URL}/requests/${id}`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });
    const data = await response.json();
    if (!data.success) throw new Error(data.message || 'Failed to fetch request');
    return data.data;
  },

  // Create new request (BENEFICIARY only)
  createRequest: async (requestData: {
    beneficiaryId: string;
    beneficiaryName: string;
    beneficiaryPhone: string;
    nationalIdNumber: string;
    kebele: string;
    woreda: string;
    category: string;
    urgency?: string;
    title: string;
    description: string;
    householdSize?: number;
    estimatedAmountNeededEtb: number;
    documents?: { name: string; type: string; url: string; sizeKb: number }[];
  }): Promise<BeneficiaryRequest> => {
    const response = await fetch(`${API_BASE_URL}/requests`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(requestData),
    });
    const data = await response.json();
    if (!data.success) throw new Error(data.message || 'Failed to create request');
    return data.data;
  },

  // Update request status (admin only)
  updateRequestStatus: async (
    id: string,
    status: string,
    comment?: string,
    rejectionReason?: string
  ): Promise<BeneficiaryRequest> => {
    const response = await fetch(`${API_BASE_URL}/requests/${id}/status`, {
      method: 'PATCH',
      headers: getAuthHeaders(),
      body: JSON.stringify({ status, comment, rejectionReason }),
    });
    const data = await response.json();
    if (!data.success) throw new Error(data.message || 'Failed to update request status');
    return data.data;
  },

  // Check duplicate national ID
  checkDuplicateNationalId: async (nationalId: string, currentRequestId?: string): Promise<{
    isDuplicate: boolean;
    existingRequests: BeneficiaryRequest[];
  }> => {
    const queryParams = new URLSearchParams();
    queryParams.append('nationalId', nationalId);
    if (currentRequestId) queryParams.append('currentRequestId', currentRequestId);

    const response = await fetch(`${API_BASE_URL}/requests/check-duplicate?${queryParams.toString()}`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });
    const data = await response.json();
    if (!data.success) throw new Error(data.message || 'Failed to check duplicate');
    return data.data;
  },
};
