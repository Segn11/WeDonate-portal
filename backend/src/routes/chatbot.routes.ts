import { Router } from 'express';
import { ChatBotController } from '../controllers/chatbot.controller';

const router = Router();

// Public routes - no authentication required
router.get('/faqs', ChatBotController.getAllFAQs);
router.get('/faqs/category/:category', ChatBotController.getFAQsByCategory);
router.get('/faqs/:id', ChatBotController.getFAQById);
router.post('/ask', ChatBotController.askQuestion);

// Admin routes - require authentication
router.post('/faqs', ChatBotController.createFAQ);
router.put('/faqs/:id', ChatBotController.updateFAQ);
router.delete('/faqs/:id', ChatBotController.deleteFAQ);
router.post('/faqs/seed', ChatBotController.seedFAQs);

export default router;
