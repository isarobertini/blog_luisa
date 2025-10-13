import express from 'express';
import Message from '../models/messageModel.js';
import Reaction from '../models/reactionModel.js';
import { parser } from '../config/cloudinary.js';
import { authenticateUser } from '../middleware/authenticateUser.js';
import errorMessages from '../utils/errorMessages.js';

const router = express.Router();

// CREATE a new message (authenticated)
router.post('/', authenticateUser, parser.single('file'), async (req, res) => {
    try {
        const { text } = req.body;
        const file = req.file;

        const attachment = file
            ? { type: file.mimetype.split('/')[0], url: file.path }
            : null;

        const message = await Message.create({
            author: req.user.username,  // use JWT username
            text,
            attachments: attachment ? [attachment] : [],
        });

        res.status(201).json(message);
    } catch (error) {
        console.error('File upload error:', error);
        res.status(500).json({ error: error.message });
    }
});
// GET /api/protected/profile — authenticated user info + their messages
router.get('/profile', authenticateUser, async (req, res) => {
    try {
        // Find messages authored by this user
        const messages = await Message.find({ author: req.user.username });

        res.status(200).json({
            success: true,
            response: {
                username: req.user.username,
                email: req.user.email,
                id: req.user._id,
                messages, // all posts by this user
            },
        });
    } catch (error) {
        res.status(500).json({ success: false, response: 'Server error' });
    }
});

// GET all messages (public)
router.get('/', async (req, res) => {
    try {
        const messages = await Message.find();
        res.json(messages);
    } catch (error) {
        res.status(500).json({ error: errorMessages.serverError });
    }
});

// UPDATE a message (authenticated + only author)
router.put('/:messageId', authenticateUser, async (req, res) => {
    try {
        const { messageId } = req.params;
        const { text } = req.body;

        const message = await Message.findById(messageId);
        if (!message) return res.status(404).json({ error: errorMessages.messageNotFound });

        if (message.author !== req.user.username) {
            return res.status(403).json({ error: "You can only edit your own messages" });
        }

        message.text = text;
        message.updatedAt = Date.now();
        await message.save();

        res.json(message);
    } catch (error) {
        res.status(400).json({ error: errorMessages.invalidRequest });
    }
});

// DELETE a message (authenticated + only author)
router.delete('/:messageId', authenticateUser, async (req, res) => {
    try {
        const { messageId } = req.params;

        const message = await Message.findById(messageId);
        if (!message)
            return res.status(404).json({ error: "Message not found" });

        // ✅ Ensure only the author can delete
        if (message.author !== req.user.username) {
            return res.status(403).json({ error: "You can only delete your own messages" });
        }

        await message.deleteOne(); // modern replacement for .remove()
        await Reaction.deleteMany({ message: messageId }); // clean up reactions

        res.status(200).json({ message: "Message deleted successfully" });
    } catch (error) {
        console.error("Delete error:", error);
        res.status(500).json({ error: "Server error while deleting message" });
    }
});

// POST /api/messages/:messageId/repost
router.post('/:messageId/repost', authenticateUser, async (req, res) => {
    try {
        const { messageId } = req.params;

        // Find the original message
        const original = await Message.findById(messageId);
        if (!original) return res.status(404).json({ error: 'Original message not found' });

        // Create a new message with same content + current user as author
        const repost = await Message.create({
            author: req.user.username,
            text: original.text,
            attachments: original.attachments,
        });

        res.status(201).json(repost);
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});


export default router;
