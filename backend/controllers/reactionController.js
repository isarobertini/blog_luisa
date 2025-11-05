import Reaction from '../models/reactionModel.js';
import Message from '../models/messageModel.js';
import errorMessages from '../utils/errorMessages.js';

// LIKE a message
export const likeMessage = async (req, res) => {
    try {
        const message = await Message.findByIdAndUpdate(
            req.params.messageId,
            { $inc: { likes: 1 } },
            { new: true }
        );
        if (!message) return res.status(404).json({ error: 'Message not found' });

        res.status(200).json({ likes: message.likes });
    } catch {
        res.status(500).json({ error: errorMessages.serverError });
    }
};

// REPLY to a message
export const replyToMessage = async (req, res) => {
    try {
        const { text } = req.body;
        const { messageId } = req.params;

        const reaction = await Reaction.create({
            author: req.user.username,
            authorId: req.user._id,
            text,
            message: messageId,
            like: false,
        });

        res.status(201).json(reaction);
    } catch {
        res.status(400).json({ error: errorMessages.invalidRequest });
    }
};

// GET all reactions
export const getReactions = async (req, res) => {
    try {
        const reactions = await Reaction.find({ message: req.params.messageId });
        res.json(reactions);
    } catch {
        res.status(500).json({ error: errorMessages.serverError });
    }
};

// EDIT a reaction
export const editReaction = async (req, res) => {
    try {
        const { reactionId } = req.params;
        const { text, like } = req.body;

        const reaction = await Reaction.findById(reactionId);
        if (!reaction) return res.status(404).json({ error: "Reaction not found" });

        // Only the author can edit
        if (reaction.authorId.toString() !== req.user._id.toString()) {
            return res.status(403).json({ error: "You can only edit your own reactions" });
        }

        // Update like if changed
        if (typeof like === "boolean" && like !== reaction.like) {
            const delta = like ? 1 : -1;
            await Message.findByIdAndUpdate(reaction.message, { $inc: { likes: delta } });
            reaction.like = like;
        }

        // Update text if provided
        if (text && text.trim() !== "") {
            reaction.text = text;
            reaction.updatedAt = Date.now(); // mark as edited
        }

        await reaction.save();

        res.status(200).json(reaction);
    } catch (err) {
        console.error(err);
        res.status(400).json({ error: "Invalid request or server error" });
    }
};


// DELETE a reaction
export const deleteReaction = async (req, res) => {
    try {
        const { reactionId } = req.params;
        const reaction = await Reaction.findById(reactionId);

        if (!reaction) return res.status(404).json({ error: errorMessages.reactionNotFound });

        if (reaction.authorId.toString() !== req.user._id.toString()) {
            return res.status(403).json({ error: "You can only delete your own reactions" });
        }

        if (reaction.like) {
            await Message.findByIdAndUpdate(reaction.message, { $inc: { likes: -1 } });
        }

        await reaction.deleteOne();
        res.json({ message: errorMessages.deleteSuccess });
    } catch (err) {
        console.error("Error deleting reaction:", err);
        res.status(500).json({ error: "Server error" });
    }
};
