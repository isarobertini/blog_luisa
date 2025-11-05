import Message from '../models/messageModel.js';
import Reaction from '../models/reactionModel.js';
import errorMessages from '../utils/errorMessages.js';

// CREATE message
export const createMessage = async (req, res) => {
    console.log("📬 Route reached!");
    console.log("📂 File info:", req.file?.originalname, req.file?.mimetype);

    try {
        const { text } = req.body;
        const file = req.file;

        let attachment = null;
        if (file) {
            attachment = {
                type: file.mimetype.split('/')[0],
                url: file.path, // Cloudinary returns the URL in 'path'
            };
        }

        const message = await Message.create({
            author: req.user.username,
            authorId: req.user._id,
            text,
            attachments: attachment ? [attachment] : [],
        });

        res.status(201).json(message);
    } catch (error) {
        console.error("💥 Multer/Cloudinary upload error:", error);
        res.status(500).json({ error: error.message });
    }
};

// GET all messages
export const getAllMessages = async (req, res) => {
    try {
        const messages = await Message.find();
        res.json(messages);
    } catch (error) {
        res.status(500).json({ error: errorMessages.serverError });
    }
};

// GET messages by logged-in user
export const getUserMessages = async (req, res) => {
    try {
        const messages = await Message.find({ authorId: req.user._id });

        res.status(200).json({
            success: true,
            response: {
                username: req.user.username,
                email: req.user.email,
                id: req.user._id,
                messages,
            },
        });
    } catch (error) {
        res.status(500).json({ success: false, response: 'Server error' });
    }
};

// UPDATE message
export const updateMessage = async (req, res) => {
    try {
        const { messageId } = req.params;
        const { text } = req.body;

        const message = await Message.findById(messageId);
        if (!message) return res.status(404).json({ error: errorMessages.messageNotFound });

        if (message.authorId.toString() !== req.user._id.toString()) {
            return res.status(403).json({ error: "You can only edit your own messages" });
        }

        message.text = text;
        message.updatedAt = Date.now();
        await message.save();

        res.json(message);
    } catch (error) {
        res.status(400).json({ error: errorMessages.invalidRequest });
    }
};

// DELETE message
export const deleteMessage = async (req, res) => {
    try {
        const { messageId } = req.params;

        const message = await Message.findById(messageId);
        if (!message) return res.status(404).json({ error: "Message not found" });

        if (message.authorId.toString() !== req.user._id.toString()) {
            return res.status(403).json({ error: "You can only delete your own messages" });
        }

        await message.deleteOne();
        await Reaction.deleteMany({ message: messageId });

        res.status(200).json({ message: "Message deleted successfully" });
    } catch (error) {
        console.error("Delete error:", error);
        res.status(500).json({ error: "Server error while deleting message" });
    }
};

// REPOST message
export const repostMessage = async (req, res) => {
    try {
        const { messageId } = req.params;

        const original = await Message.findById(messageId);
        if (!original) return res.status(404).json({ error: 'Original message not found' });

        // Build repost chain properly
        const repostChain = original.repost?.repostChain ? [...original.repost.repostChain] : [];
        if (!repostChain.includes(original.author)) {
            repostChain.push(original.author); // original author first
        }
        repostChain.push(req.user.username); // current user reposting

        const repost = await Message.create({
            author: req.user.username,
            authorId: req.user._id,
            text: original.text,
            attachments: original.attachments,
            repost: {
                originalMessageId: original._id,
                originalAuthor: original.author,
                repostChain, // full chain including previous reposters
            },
        });

        await Message.findByIdAndUpdate(messageId, { $inc: { reposts: 1 } });

        res.status(201).json(repost);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
};
