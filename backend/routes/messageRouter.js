import express from 'express';
import Message from '../models/messageModel.js';
import Reaction from '../models/reactionModel.js';
import errorMessages from '../utils/errorMessages.js'; // ✅ import
import { parser } from '../config/cloudinary.js';

const router = express.Router();

// POST /api/messages → create a message with optional file

router.post('/', parser.single('file'), async (req, res) => {
    console.log('req.file:', req.file); // <-- add this
    console.log('req.body:', req.body);
    try {
        const { author, text } = req.body;
        const file = req.file; // this is the uploaded file

        // If a file was uploaded, create attachment object
        const attachment = file
            ? { type: file.mimetype.split('/')[0], url: file.path }
            : null;

        // Save message in MongoDB
        const message = await Message.create({
            author,
            text,
            attachments: attachment ? [attachment] : [],
        });

        res.status(201).json(message);
    } catch (error) {
        console.error(error);
        res.status(400).json({ error: 'Invalid request' });
    }
});


router.get('/', async (req, res) => {
    try {
        const messages = await Message.find();
        res.json(messages);
    } catch (error) {
        res.status(500).json({ error: errorMessages.serverError });
    }
});

router.put('/:messageId', async (req, res) => {
    try {
        const { messageId } = req.params;
        const { text } = req.body;

        const updatedMessage = await Message.findByIdAndUpdate(
            messageId,
            { text, updatedAt: Date.now() },
            { new: true }
        );

        if (!updatedMessage)
            return res.status(404).json({ error: errorMessages.messageNotFound });

        res.json(updatedMessage);
    } catch (error) {
        res.status(400).json({ error: errorMessages.invalidRequest });
    }
});

router.delete('/:messageId', async (req, res) => {
    try {
        const { messageId } = req.params;

        const deletedMessage = await Message.findByIdAndDelete(messageId);
        if (!deletedMessage)
            return res.status(404).json({ error: errorMessages.messageNotFound });

        await Reaction.deleteMany({ message: messageId });

        res.json({ message: errorMessages.deleteSuccess });
    } catch (error) {
        res.status(500).json({ error: errorMessages.serverError });
    }
});

export default router;
