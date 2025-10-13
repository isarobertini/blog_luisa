import express from 'express';
import Reaction from '../models/reactionModel.js';
import Message from '../models/messageModel.js';
import { authenticateUser } from '../middleware/authenticateUser.js';
import errorMessages from '../utils/errorMessages.js';

const router = express.Router();

// LIKE a message (authenticated)
router.post('/:messageId/like', authenticateUser, async (req, res) => {
    try {
        const { messageId } = req.params;

        await Reaction.create({
            author: req.user.username,  // JWT username
            message: messageId,
            like: true,
        });

        await Message.findByIdAndUpdate(messageId, { $inc: { likes: 1 } });

        res.status(201).json({ message: errorMessages.likeSuccess });
    } catch (error) {
        res.status(400).json({ error: errorMessages.invalidRequest });
    }
});

// REPLY to a message (authenticated)
router.post('/:messageId/reply', authenticateUser, async (req, res) => {
    try {
        const { text } = req.body;
        const { messageId } = req.params;

        const reaction = await Reaction.create({
            author: req.user.username,  // JWT username
            text,
            message: messageId,
            like: false,
        });

        res.status(201).json(reaction);
    } catch (error) {
        res.status(400).json({ error: errorMessages.invalidRequest });
    }
});

// GET all reactions for a message (public)
router.get('/:messageId', async (req, res) => {
    try {
        const { messageId } = req.params;
        const reactions = await Reaction.find({ message: messageId });
        res.json(reactions);
    } catch (error) {
        res.status(500).json({ error: errorMessages.serverError });
    }
});

// EDIT a reaction (authenticated + only author)
router.put('/:reactionId', authenticateUser, async (req, res) => {
    try {
        const { reactionId } = req.params;
        const { text, like } = req.body;

        const reaction = await Reaction.findById(reactionId);
        if (!reaction) return res.status(404).json({ error: errorMessages.reactionNotFound });

        if (reaction.author !== req.user.username) {
            return res.status(403).json({ error: "You can only edit your own reactions" });
        }

        // Adjust likes counter if changed
        if (typeof like === 'boolean' && like !== reaction.like) {
            const delta = like ? 1 : -1;
            await Message.findByIdAndUpdate(reaction.message, { $inc: { likes: delta } });
            reaction.like = like;
        }

        if (text) reaction.text = text;
        reaction.updatedAt = Date.now();
        await reaction.save();

        res.json(reaction);
    } catch (error) {
        res.status(400).json({ error: errorMessages.invalidRequest });
    }
});

// DELETE a reaction (authenticated + only author)
router.delete('/:reactionId', authenticateUser, async (req, res) => {
    try {
        const { reactionId } = req.params;

        const reaction = await Reaction.findById(reactionId);
        if (!reaction) return res.status(404).json({ error: errorMessages.reactionNotFound });

        if (reaction.author !== req.user.username) {
            return res.status(403).json({ error: "You can only delete your own reactions" });
        }

        if (reaction.like) {
            await Message.findByIdAndUpdate(reaction.message, { $inc: { likes: -1 } });
        }

        await reaction.remove();

        res.json({ message: errorMessages.deleteSuccess });
    } catch (error) {
        res.status(500).json({ error: errorMessages.serverError });
    }
});

export default router;
