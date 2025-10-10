import express from 'express';
import Reaction from '../models/reactionModel.js';
import Message from '../models/messageModel.js';
import errorMessages from '../utils/errorMessages.js'; // import the utility

const router = express.Router();

// POST /api/reactions/:messageId/like → add a like
router.post('/:messageId/like', async (req, res) => {
    try {
        const { author } = req.body; // extract the user who liked the message from body
        const { messageId } = req.params; // get the message ID from the URL

        // Create a new Reaction document in MongoDB
        await Reaction.create({
            author,         // who liked it
            message: messageId, // which message was liked
            like: true,     // mark it as a like
        });

        // Update the Message document by increasing its 'likes' count by 1
        await Message.findByIdAndUpdate(messageId, { $inc: { likes: 1 } });

        // Respond to the client with success
        res.status(201).json({ message: errorMessages.likeSuccess });
    } catch (error) {
        res.status(400).json({ error: errorMessages.invalidRequest });
    }
});


// POST /api/reactions/:messageId/reply → add a text reply
router.post('/:messageId/reply', async (req, res) => {
    try {
        const { author, text } = req.body; // extract author and reply text from request body
        const { messageId } = req.params; // extract the message ID from the URL

        // Create a reaction (a reply) in MongoDB
        const reaction = await Reaction.create({
            author,          // who wrote the reply
            text,            // what they wrote
            message: messageId, // which message they replied to
            like: false,     // mark it as not a "like"
        });

        // Send back the newly created reaction as JSON
        res.status(201).json(reaction);
    } catch (error) {
        res.status(400).json({ error: errorMessages.invalidRequest });
    }
});

// GET /api/reactions/:messageId → get all reactions for one message
router.get('/:messageId', async (req, res) => {
    try {
        const { messageId } = req.params; // get the message ID from the URL
        const reactions = await Reaction.find({ message: messageId }); // find all reactions linked to that message
        res.json(reactions); // send them back as JSON
    } catch (error) {
        res.status(500).json({ error: errorMessages.serverError });
    }
});

// Edit a reaction
router.put('/:reactionId', async (req, res) => {
    try {
        const { reactionId } = req.params;
        const { text, like } = req.body;

        const updatedReaction = await Reaction.findByIdAndUpdate(
            reactionId,
            { text, like, updatedAt: Date.now() },
            { new: true }
        );

        if (!updatedReaction)
            return res.status(404).json({ error: errorMessages.reactionNotFound });

        // Update the likes counter if like changed
        if (typeof like === 'boolean') {
            const delta = like ? 1 : -1;
            await Message.findByIdAndUpdate(updatedReaction.message, { $inc: { likes: delta } });
        }

        res.json(updatedReaction);
    } catch (error) {
        res.status(400).json({ error: errorMessages.invalidRequest });
    }
});

// Delete a reaction
router.delete('/:reactionId', async (req, res) => {
    try {
        const { reactionId } = req.params;

        const reaction = await Reaction.findByIdAndDelete(reactionId);
        if (!reaction)
            return res.status(404).json({ error: errorMessages.reactionNotFound });

        // Adjust likes counter if it was a like
        if (reaction.like) {
            await Message.findByIdAndUpdate(reaction.message, { $inc: { likes: -1 } });
        }

        res.json({ message: errorMessages.deleteSuccess });
    } catch (error) {
        res.status(500).json({ error: errorMessages.serverError });
    }
});

export default router;
