const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api/v1';

export interface AuditLogData {
  userId: string;
  userName: string;
  role: string;
  action: string;
  module: string;
  ipAddress: string;
  details: string;
  riskLevel?: 'LOW' | 'MEDIUM' | 'HIGH';
}

export interface AuditLog {
  id: string;
  userId: string;
  userName: string;
  role: string;
  action: string;
  module: string;
  ipAddress: string;
  details: string;
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH';
  timestamp: string;
}

export const auditApi = {
  async getAllAuditLogs(filters?: {
    userId?: string;
    action?: string;
    module?: string;
    riskLevel?: 'LOW' | 'MEDIUM' | 'HIGH';
    limit?: number;
  }): Promise<AuditLog[]> {
    const params = new URLSearchParams();
    if (filters?.userId) params.append('userId', filters.userId);
    if (filters?.action) params.append('action', filters.action);
    if (filters?.module) params.append('module', filters.module);
    if (filters?.riskLevel) params.append('riskLevel', filters.riskLevel);
    if (filters?.limit) params.append('limit', filters.limit.toString());

    const response = await fetch(`${API_BASE_URL}/audit?${params.toString()}`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('auth_token')}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch audit logs');
    }

    const data = await response.json();
    return data.data || data;
  },

  async getAuditLogById(id: string): Promise<AuditLog> {
    const response = await fetch(`${API_BASE_URL}/audit/${id}`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('auth_token')}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch audit log');
    }

    const data = await response.json();
    return data.data || data;
  },

  async getAuditLogsByUserId(userId: string, limit?: number): Promise<AuditLog[]> {
    const params = new URLSearchParams();
    if (limit) params.append('limit', limit.toString());

    const response = await fetch(`${API_BASE_URL}/audit/user/${userId}?${params.toString()}`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('auth_token')}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch user audit logs');
    }

    const data = await response.json();
    return data.data || data;
  },

  async createAuditLog(auditData: AuditLogData): Promise<AuditLog> {
    const response = await fetch(`${API_BASE_URL}/audit`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('auth_token')}`,
      },
      body: JSON.stringify(auditData),
    });

    if (!response.ok) {
      throw new Error('Failed to create audit log');
    }

    const data = await response.json();
    return data.data || data;
  },
};
