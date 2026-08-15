import { prisma } from '../prisma/client';
import { GoogleGenAI } from '@google/genai';

interface FAQData {
  question: string;
  answer: string;
  keywords: string[];
  category?: string;
  priority?: number;
  isActive?: boolean;
}

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const genAI = GEMINI_API_KEY ? new GoogleGenAI({ apiKey: GEMINI_API_KEY }) : null;

export class ChatBotService {
  static async getAllFAQs() {
    return await prisma.chatBotFAQ.findMany({
      where: { isActive: true },
      orderBy: [{ priority: 'desc' }, { createdAt: 'desc' }],
    });
  }

  static async getFAQById(id: string) {
    return await prisma.chatBotFAQ.findUnique({
      where: { id },
    });
  }

  static async getFAQsByCategory(category: string) {
    return await prisma.chatBotFAQ.findMany({
      where: { category, isActive: true },
      orderBy: [{ priority: 'desc' }, { createdAt: 'desc' }],
    });
  }

  static async createFAQ(data: FAQData) {
    return await prisma.chatBotFAQ.create({
      data: {
        question: data.question,
        answer: data.answer,
        keywords: data.keywords,
        category: data.category || 'GENERAL',
        priority: data.priority || 0,
        isActive: data.isActive !== undefined ? data.isActive : true,
      },
    });
  }

  static async updateFAQ(id: string, data: Partial<FAQData>) {
    return await prisma.chatBotFAQ.update({
      where: { id },
      data: {
        ...(data.question && { question: data.question }),
        ...(data.answer && { answer: data.answer }),
        ...(data.keywords && { keywords: data.keywords }),
        ...(data.category && { category: data.category }),
        ...(data.priority !== undefined && { priority: data.priority }),
        ...(data.isActive !== undefined && { isActive: data.isActive }),
      },
    });
  }

  static async deleteFAQ(id: string) {
    return await prisma.chatBotFAQ.delete({
      where: { id },
    });
  }

  static async findBestMatch(query: string): Promise<string | null> {
    const faqs = await this.getAllFAQs();
    const lowerQuery = query.toLowerCase().trim();
    
    let bestMatch: { faq: any; score: number } | null = null;

    for (const faq of faqs) {
      let score = 0;
      const lowerQuestion = faq.question.toLowerCase();
      const lowerAnswer = faq.answer.toLowerCase();
      
      // Check if query matches question keywords
      for (const keyword of faq.keywords) {
        if (lowerQuery.includes(keyword.toLowerCase())) {
          score += 2;
        }
      }
      
      // Check partial matches in question
      const questionWords = lowerQuestion.split(' ');
      for (const word of questionWords) {
        if (lowerQuery.includes(word) && word.length > 3) {
          score += 1;
        }
      }
      
      // Check if query contains key terms from answer
      const answerWords = lowerAnswer.split(' ');
      for (const word of answerWords) {
        if (lowerQuery.includes(word) && word.length > 4) {
          score += 0.5;
        }
      }
      
      // Bonus for exact phrase match
      if (lowerQuery.includes(lowerQuestion.substring(0, 10))) {
        score += 3;
      }
      
      if (score > 0 && (!bestMatch || score > bestMatch.score)) {
        bestMatch = { faq, score };
      }
    }

    return bestMatch ? bestMatch.faq.answer : null;
  }

  static async askWithAI(query: string, sessionId?: string, userId?: string): Promise<string> {
    // First try to find a match in FAQs
    const faqMatch = await this.findBestMatch(query);
    let response: string;
    let responseSource: string = 'FAQ';
    
    // If Gemini API is available, use it for more sophisticated responses
    if (genAI) {
      try {
        const faqs = await this.getAllFAQs();
        const faqContext = faqs.map((faq: any) => 
          `Q: ${faq.question}\nA: ${faq.answer}\nCategory: ${faq.category}`
        ).join('\n\n');

        const prompt = `You are a helpful assistant for the Adama Support Portal, a municipal charity management system. 
Use the following FAQ context to answer the user's question. If the answer is not in the context, provide a helpful response based on general knowledge about charity systems and the Adama context.

FAQ Context:
${faqContext}

User Question: ${query}

Provide a clear, helpful response. If the question is about the system, prioritize information from the FAQ context. Keep responses concise and friendly.`;

        const result = await genAI.models.generateContent({
          model: 'gemini-3.6-flash',
          contents: prompt,
        });
        
        if (result && result.text) {
          response = result.text;
          responseSource = 'AI';
        } else {
          response = "I apologize, but I couldn't generate a response. Please try again.";
          responseSource = 'FALLBACK';
        }
      } catch (error) {
        console.error('Gemini API error:', error);
        // Fall back to FAQ match if AI fails
        if (faqMatch) {
          response = faqMatch;
          responseSource = 'FAQ';
        } else {
          response = "I apologize, but I'm having trouble connecting to my AI service. Please try again or contact support@adama.gov.et for assistance.";
          responseSource = 'FALLBACK';
        }
      }
    } else {
      // If no Gemini API, return FAQ match or fallback message
      if (faqMatch) {
        response = faqMatch;
        responseSource = 'FAQ';
      } else {
        response = "I don't have a specific answer for that question. For more information, please contact our support team at support@adama.gov.et or call +251 22 111 0000.";
        responseSource = 'FALLBACK';
      }
    }
    
    // Record conversation in database
    if (sessionId) {
      try {
        await prisma.chatConversation.create({
          data: {
            sessionId,
            userId,
            question: query,
            answer: response,
            responseSource,
          },
        });
      } catch (error) {
        console.error('Failed to record conversation:', error);
        // Don't fail the response if recording fails
      }
    }
    
    return response;
  }

  static async getConversationHistory(sessionId: string) {
    return await prisma.chatConversation.findMany({
      where: { sessionId },
      orderBy: { createdAt: 'asc' },
    });
  }

  static async getUserConversations(userId: string) {
    return await prisma.chatConversation.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: 50, // Limit to last 50 conversations
    });
  }

  static async getAllConversations() {
    return await prisma.chatConversation.findMany({
      orderBy: { createdAt: 'desc' },
      take: 100, // Limit to last 100 conversations for admin view
    });
  }

  static async seedInitialFAQs() {
    const initialFAQs: FAQData[] = [
      {
        question: 'What is this system?',
        answer: 'The Adama Support Portal is an official municipal charity management system for Adama City Administration. It digitizes compassion and ensures transparent support distribution through a 3-tier government verification system (Kebele → Woreda → Direct Delivery).',
        keywords: ['system', 'portal', 'adama', 'charity', 'management'],
        category: 'GENERAL',
        priority: 10,
      },
      {
        question: 'How does it work?',
        answer: 'The system works through a transparent 3-tier verification process:\n\n1. **Kebele Verification**: Citizens submit requests with National/Kebele IDs. Local administrators verify household income.\n2. **Woreda Endorsement**: Sub-city supervisors conduct second-tier audit checks and approve campaigns.\n3. **Direct Delivery**: Donations are assigned directly to approved requests with digital receipt confirmation.',
        keywords: ['work', 'process', 'verification', 'tier', 'kebele', 'woreda'],
        category: 'GENERAL',
        priority: 10,
      },
      {
        question: 'Who can use this system?',
        answer: 'The system is designed for:\n- **Donors**: Individuals, NGOs, Companies, and Diaspora who want to contribute\n- **Beneficiaries**: Citizens in need of support who can apply with proper documentation\n- **Administrators**: Kebele, Woreda, and City officials who verify and approve requests',
        keywords: ['who', 'use', 'access', 'donor', 'beneficiary', 'admin'],
        category: 'GENERAL',
        priority: 10,
      },
      {
        question: 'How to donate?',
        answer: 'You can donate in two ways:\n\n1. **As a Guest**: Click the "Donate Now" button on the landing page - no registration required!\n2. **As a Registered Donor**: Log in to your donor portal for tracking and receipt management\n\nPayment methods include Telebirr and CBE Bank transfer.',
        keywords: ['donate', 'donation', 'give', 'contribute', 'payment'],
        category: 'DONATION',
        priority: 10,
      },
      {
        question: 'What can I donate?',
        answer: 'You can donate:\n- **Money**: Financial contributions via Telebirr or CBE Bank\n- **Items**: Physical goods like food supplies, clothing, medical supplies, school kits, etc.',
        keywords: ['donate', 'money', 'items', 'goods', 'physical'],
        category: 'DONATION',
        priority: 8,
      },
      {
        question: 'Minimum donation amount?',
        answer: 'The minimum monetary donation is 100 ETB. For items, there is no minimum - any contribution helps!',
        keywords: ['minimum', 'amount', 'limit', 'small'],
        category: 'DONATION',
        priority: 7,
      },
      {
        question: 'Is it safe to donate?',
        answer: 'Yes! The system is 100% verified through:\n- Government ID poverty audit\n- Kebele resident verification\n- Woreda supervisor approval\n- Digital receipt tracking\n- Transparent distribution logging',
        keywords: ['safe', 'secure', 'trust', 'verify', 'security'],
        category: 'DONATION',
        priority: 10,
      },
      {
        question: 'How to apply for support?',
        answer: 'To apply for support:\n\n1. Click "Apply for Support" on the landing page\n2. Register as a beneficiary with your Kebele ID\n3. Submit your support request with required documents\n4. Wait for Kebele verification (typically 1-3 days)\n5. Track your request status in your dashboard',
        keywords: ['apply', 'request', 'support', 'beneficiary', 'register'],
        category: 'BENEFICIARY',
        priority: 10,
      },
      {
        question: 'What documents are needed?',
        answer: 'Required documents include:\n- National ID or Kebele Resident ID\n- Proof of income or financial hardship\n- Support request details\n- Any relevant medical or emergency documentation',
        keywords: ['document', 'id', 'paper', 'requirement', 'proof'],
        category: 'BENEFICIARY',
        priority: 9,
      },
      {
        question: 'How long does approval take?',
        answer: 'Approval timeline:\n- Kebele verification: 1-3 days\n- Woreda review: 2-5 days\n- Total: Typically 3-8 days for full approval and publishing',
        keywords: ['time', 'long', 'approval', 'days', 'wait'],
        category: 'BENEFICIARY',
        priority: 8,
      },
      {
        question: 'How is it transparent?',
        answer: 'Transparency features include:\n- Real-time donation tracking\n- Public transparency portal\n- Digital receipt verification codes\n- Distribution photo documentation\n- Beneficiary signature confirmation\n- Audit trail for all transactions',
        keywords: ['transparent', 'track', 'receipt', 'audit', 'public'],
        category: 'TRANSPARENCY',
        priority: 10,
      },
      {
        question: 'Can I track my donation?',
        answer: 'Yes! As a registered donor, you can:\n- Track all your donations in real-time\n- View distribution status\n- Download digital receipts\n- See beneficiary impact stories',
        keywords: ['track', 'donation', 'status', 'receipt', 'monitor'],
        category: 'TRANSPARENCY',
        priority: 9,
      },
      {
        question: 'Contact information?',
        answer: 'For support:\n\n📞 Phone: +251 22 111 0000 / +251 22 112 0011\n📧 Email: support@adama.gov.et\n📍 Address: Adama Mayor Cabinet Office, Bole Road',
        keywords: ['contact', 'phone', 'email', 'address', 'support'],
        category: 'CONTACT',
        priority: 10,
      },
      {
        question: 'Office hours?',
        answer: 'Office hours:\n- Monday to Friday: 8:00 AM - 5:00 PM\n- Saturday: 9:00 AM - 1:00 PM\n- Sunday: Closed',
        keywords: ['hours', 'time', 'open', 'schedule', 'weekend'],
        category: 'CONTACT',
        priority: 7,
      },
      {
        question: 'Technical support?',
        answer: 'For technical issues:\n- Email: tech@adama.gov.et\n- Phone: +251 22 111 0000 (ext. 5)\n- Response time: Within 24 hours',
        keywords: ['technical', 'support', 'error', 'bug', 'help'],
        category: 'CONTACT',
        priority: 8,
      },
    ];

    for (const faq of initialFAQs) {
      const existing = await prisma.chatBotFAQ.findFirst({
        where: { question: faq.question },
      });
      
      if (!existing) {
        await this.createFAQ(faq);
      }
    }

    return initialFAQs.length;
  }
}
