import { Router } from 'express';
import { ChatBotController } from '../controllers/chatbot.controller';

const router = Router();

// Public routes - no authentication required
router.get('/faqs', ChatBotController.getAllFAQs);
router.get('/faqs/category/:category', ChatBotController.getFAQsByCategory);
router.get('/faqs/:id', ChatBotController.getFAQById);
router.post('/ask', ChatBotController.askQuestion);
router.get('/conversations/:sessionId', ChatBotController.getConversationHistory);

// Admin routes - require authentication
router.post('/faqs', ChatBotController.createFAQ);
router.put('/faqs/:id', ChatBotController.updateFAQ);
router.delete('/faqs/:id', ChatBotController.deleteFAQ);
router.post('/faqs/seed', ChatBotController.seedFAQs);
router.get('/conversations/user', ChatBotController.getUserConversations);
router.get('/conversations', ChatBotController.getAllConversations);

export default router;
