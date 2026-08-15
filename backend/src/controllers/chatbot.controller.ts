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
      const { query } = req.body;
      if (!query) {
        return res.status(400).json({ success: false, message: 'Query is required' });
      }

      const answer = await ChatBotService.findBestMatch(query);
      
      if (!answer) {
        return sendSuccess(res, { 
          answer: "I couldn't find a specific answer to your question. Try asking about donations, applications, or contact information, or reach out to our support team at support@adama.gov.et",
          found: false 
        }, 'No exact match found');
      }

      return sendSuccess(res, { answer, found: true }, 'Answer found');
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
}
