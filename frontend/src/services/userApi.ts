import { User } from '../types';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api/v1';

const getAuthHeaders = () => {
  const token = localStorage.getItem('auth_token');
  return {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` }),
  };
};

export const userApi = {
  // Get current user profile
  getCurrentUser: async (): Promise<User> => {
    const response = await fetch(`${API_BASE_URL}/users/me`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });
    const data = await response.json();
    if (!data.success) throw new Error(data.message || 'Failed to fetch user');
    return data.data;
  },

  // Update current user profile
  updateCurrentUser: async (updatedData: Partial<User>): Promise<User> => {
    const response = await fetch(`${API_BASE_URL}/users/me`, {
      method: 'PATCH',
      headers: getAuthHeaders(),
      body: JSON.stringify(updatedData),
    });
    const data = await response.json();
    if (!data.success) throw new Error(data.message || 'Failed to update profile');
    return data.data;
  },

  // Get user by ID
  getUserById: async (id: string): Promise<User> => {
    const response = await fetch(`${API_BASE_URL}/users/${id}`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });
    const data = await response.json();
    if (!data.success) throw new Error(data.message || 'Failed to fetch user');
    return data.data;
  },

  // Update user by ID
  updateUserById: async (id: string, updatedData: Partial<User>): Promise<User> => {
    const response = await fetch(`${API_BASE_URL}/users/${id}`, {
      method: 'PATCH',
      headers: getAuthHeaders(),
      body: JSON.stringify(updatedData),
    });
    const data = await response.json();
    if (!data.success) throw new Error(data.message || 'Failed to update user');
    return data.data;
  },

  // Delete user
  deleteUser: async (id: string): Promise<void> => {
    const response = await fetch(`${API_BASE_URL}/users/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    const data = await response.json();
    if (!data.success) throw new Error(data.message || 'Failed to delete user');
  },

  // Get all users (admin only)
  getAllUsers: async (params?: { role?: string; status?: string; page?: number; limit?: number }): Promise<{
    users: User[];
    total: number;
    page: number;
    limit: number;
  }> => {
    const queryParams = new URLSearchParams();
    if (params?.role) queryParams.append('role', params.role);
    if (params?.status) queryParams.append('status', params.status);
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());

    const response = await fetch(`${API_BASE_URL}/users?${queryParams.toString()}`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });
    const data = await response.json();
    if (!data.success) throw new Error(data.message || 'Failed to fetch users');
    return data.data;
  },

  // Update user status (admin only)
  updateUserStatus: async (id: string, status: string, isVerified?: boolean): Promise<User> => {
    const response = await fetch(`${API_BASE_URL}/users/${id}/status`, {
      method: 'PATCH',
      headers: getAuthHeaders(),
      body: JSON.stringify({ status, isVerified }),
    });
    const data = await response.json();
    if (!data.success) throw new Error(data.message || 'Failed to update user status');
    return data.data;
  },

  // Update user role (SYSTEM_ADMIN only)
  updateUserRole: async (id: string, role: string): Promise<User> => {
    const response = await fetch(`${API_BASE_URL}/users/${id}/role`, {
      method: 'PATCH',
      headers: getAuthHeaders(),
      body: JSON.stringify({ role }),
    });
    const data = await response.json();
    if (!data.success) throw new Error(data.message || 'Failed to update user role');
    return data.data;
  },

  // Verify beneficiary (KEBELE_ADMIN and above)
  verifyBeneficiary: async (id: string, isVerified: boolean, rejectionReason?: string): Promise<User> => {
    const response = await fetch(`${API_BASE_URL}/users/${id}/verify`, {
      method: 'PATCH',
      headers: getAuthHeaders(),
      body: JSON.stringify({ isVerified, rejectionReason }),
    });
    const data = await response.json();
    if (!data.success) throw new Error(data.message || 'Failed to verify beneficiary');
    return data.data;
  },

  // Get beneficiaries by kebele (admin only)
  getBeneficiariesByKebele: async (kebele?: string): Promise<User[]> => {
    const queryParams = new URLSearchParams();
    if (kebele) queryParams.append('kebele', kebele);

    const response = await fetch(`${API_BASE_URL}/users/beneficiaries/by-kebele?${queryParams.toString()}`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });
    const data = await response.json();
    if (!data.success) throw new Error(data.message || 'Failed to fetch beneficiaries');
    return data.data;
  },
};
