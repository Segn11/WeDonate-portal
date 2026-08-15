const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api/v1';

export interface ChatbotResponse {
  success: boolean;
  data: {
    answer: string;
    found: boolean;
  };
  message: string;
}

export const chatbotApi = {
  askQuestion: async (query: string): Promise<ChatbotResponse> => {
    const response = await fetch(`${API_BASE_URL}/chatbot/ask`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ query }),
    });

    if (!response.ok) {
      throw new Error('Failed to get chatbot response');
    }

    return response.json();
  },

  getAllFAQs: async () => {
    const response = await fetch(`${API_BASE_URL}/chatbot/faqs`);
    if (!response.ok) {
      throw new Error('Failed to fetch FAQs');
    }
    return response.json();
  },

  getFAQsByCategory: async (category: string) => {
    const response = await fetch(`${API_BASE_URL}/chatbot/faqs/category/${category}`);
    if (!response.ok) {
      throw new Error('Failed to fetch FAQs by category');
    }
    return response.json();
  },
};
