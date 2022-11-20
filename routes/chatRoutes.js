import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import { listMessages, newMessage } from '../controllers/chatControllers.js';
const router = express.Router();

router.post('/', protect, newMessage);

router.get('/list', protect, listMessages);

export default router;
