import { Request, Response, NextFunction } from 'express';
import { ChatBotService } from '../services/chatbot.service';
import { sendSuccess } from '../utils/response';

export class ChatBotController {
  static async getAllFAQs(req: Request, res: Response, next: NextFunction) {
    try {
      const faqs = await ChatBotService.getAllFAQs();
      return sendSuccess(res, faqs, 'Fetched all FAQs');
    } catch (error) {
      next(error);
    }
  }

  static async getFAQById(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const faqId = Array.isArray(id) ? id[0] : id;
      const faq = await ChatBotService.getFAQById(faqId);
      if (!faq) {
        return res.status(404).json({ success: false, message: 'FAQ not found' });
      }
      return sendSuccess(res, faq, 'Fetched FAQ');
    } catch (error) {
      next(error);
    }
  }

  static async getFAQsByCategory(req: Request, res: Response, next: NextFunction) {
    try {
      const { category } = req.params;
      const categoryStr = Array.isArray(category) ? category[0] : category;
      const faqs = await ChatBotService.getFAQsByCategory(categoryStr);
      return sendSuccess(res, faqs, `Fetched FAQs for category: ${categoryStr}`);
    } catch (error) {
      next(error);
    }
  }

  static async createFAQ(req: Request, res: Response, next: NextFunction) {
    try {
      const faq = await ChatBotService.createFAQ(req.body);
      return sendSuccess(res, faq, 'FAQ created successfully', 201);
    } catch (error) {
      next(error);
    }
  }

  static async updateFAQ(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const faqId = Array.isArray(id) ? id[0] : id;
      const faq = await ChatBotService.updateFAQ(faqId, req.body);
      return sendSuccess(res, faq, 'FAQ updated successfully');
    } catch (error) {
      next(error);
    }
  }

  static async deleteFAQ(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const faqId = Array.isArray(id) ? id[0] : id;
      await ChatBotService.deleteFAQ(faqId);
      return sendSuccess(res, null, 'FAQ deleted successfully');
    } catch (error) {
      next(error);
    }
  }

  static async askQuestion(req: Request, res: Response, next: NextFunction) {
    try {
      const { query, sessionId } = req.body;
      const userId = (req as any).user?.id; // Get user ID if authenticated
      
      if (!query) {
        return res.status(400).json({ success: false, message: 'Query is required' });
      }

      // Generate session ID if not provided
      const session = sessionId || require('crypto').randomUUID();

      const answer = await ChatBotService.askWithAI(query, session, userId);
      
      return sendSuccess(res, { answer, sessionId: session, found: true }, 'Answer generated');
    } catch (error) {
      next(error);
    }
  }

  static async seedFAQs(req: Request, res: Response, next: NextFunction) {
    try {
      const count = await ChatBotService.seedInitialFAQs();
      return sendSuccess(res, { count }, `Seeded ${count} initial FAQs`);
    } catch (error) {
      next(error);
    }
  }

  static async getConversationHistory(req: Request, res: Response, next: NextFunction) {
    try {
      const { sessionId } = req.params;
      const sessionStr = Array.isArray(sessionId) ? sessionId[0] : sessionId;
      const conversations = await ChatBotService.getConversationHistory(sessionStr);
      return sendSuccess(res, conversations, 'Fetched conversation history');
    } catch (error) {
      next(error);
    }
  }

  static async getUserConversations(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = (req as any).user?.id;
      if (!userId) {
        return res.status(401).json({ success: false, message: 'Authentication required' });
      }
      const conversations = await ChatBotService.getUserConversations(userId);
      return sendSuccess(res, conversations, 'Fetched user conversations');
    } catch (error) {
      next(error);
    }
  }

  static async getAllConversations(req: Request, res: Response, next: NextFunction) {
    try {
      const conversations = await ChatBotService.getAllConversations();
      return sendSuccess(res, conversations, 'Fetched all conversations');
    } catch (error) {
      next(error);
    }
  }
}
