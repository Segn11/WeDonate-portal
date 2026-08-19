const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api/v1';

export interface PublicStats {
  totalRaisedEtb: number;
  totalBeneficiaries: number;
  activeKebeles: number;
  totalDistributions: number;
  totalRequests: number;
}

export const statisticsApi = {
  async getPublicStats(): Promise<PublicStats> {
    const response = await fetch(`${API_BASE_URL}/statistics/public`, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch public statistics');
    }

    const data = await response.json();
    return data.data || data;
  },
};
