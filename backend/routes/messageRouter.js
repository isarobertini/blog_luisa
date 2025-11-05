import express from 'express';
import { parser } from '../config/cloudinary.js';
import { authenticateUser } from '../middleware/authenticateUser.js';
import {
    createMessage,
    getAllMessages,
    getUserMessages,
    updateMessage,
    deleteMessage,
    repostMessage,
} from '../controllers/messageController.js';

const router = express.Router();

// Routes
router.post('/', authenticateUser, parser.single('file'), createMessage);
router.get('/', getAllMessages);
router.get('/profile', authenticateUser, getUserMessages);
router.put('/:messageId', authenticateUser, updateMessage);
router.delete('/:messageId', authenticateUser, deleteMessage);
router.post('/:messageId/repost', authenticateUser, repostMessage);

export default router;
