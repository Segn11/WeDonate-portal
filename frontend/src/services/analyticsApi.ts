const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api/v1';

export interface MonthlyTrendData {
  month: string;
  total: number;
}

export interface CategoryDistributionData {
  name: string;
  value: number;
  color: string;
}

export interface OverviewStats {
  totalRequests: number;
  totalDonations: number;
  totalDistributions: number;
  pendingRequests: number;
  completedRequests: number;
  totalDonationAmount: number;
  totalDistributionAmount: number;
}

export interface KebeleStats {
  kebele: string;
  total: number;
  funded: number;
  completed: number;
}

export const analyticsApi = {
  async getMonthlyTrends(): Promise<MonthlyTrendData[]> {
    const response = await fetch(`${API_BASE_URL}/analytics/monthly-trends`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('auth_token')}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch monthly trends');
    }

    const data = await response.json();
    return data.data || data;
  },

  async getCategoryDistribution(): Promise<CategoryDistributionData[]> {
    const response = await fetch(`${API_BASE_URL}/analytics/category-distribution`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('auth_token')}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch category distribution');
    }

    const data = await response.json();
    return data.data || data;
  },

  async getOverviewStats(): Promise<OverviewStats> {
    const response = await fetch(`${API_BASE_URL}/analytics/overview-stats`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('auth_token')}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch overview stats');
    }

    const data = await response.json();
    return data.data || data;
  },

  async getKebeleStats(kebele?: string): Promise<KebeleStats[]> {
    const params = new URLSearchParams();
    if (kebele) params.append('kebele', kebele);

    const response = await fetch(`${API_BASE_URL}/analytics/kebele-stats?${params.toString()}`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('auth_token')}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch kebele stats');
    }

    const data = await response.json();
    return data.data || data;
  },
};
