import express from 'express';
import Message from '../models/messageModel.js';
import Reaction from '../models/reactionModel.js';
import errorMessages from '../utils/errorMessages.js';
import { parser } from '../config/cloudinary.js';

const router = express.Router();

// POST /api/messages — create a new message
// Uses parser middleware to handle a single uploaded file and make it available as req.file
// Async function allows awaiting asynchronous operations (like saving to the database) without blocking other code
router.post('/', parser.single('file'), async (req, res) => {
    try {
        const { author, text } = req.body; // extract author and text from request body
        const file = req.file;             // extract uploaded file from request (if any)

        // If a file was uploaded, create an attachment object:
        // - type: general file type (image, video, audio) extracted from MIME type for easier handling in the frontend
        // - url: the file URL from Cloudinary
        // If no file was uploaded, store null
        const attachment = file
            ? { type: file.mimetype.split('/')[0], url: file.path }
            : null;

        // Save message in MongoDB
        //If no attachement save null
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

//define route 
// Call this asynchronous route handler when the server receives a GET request at '/'
router.get('/', async (req, res) => {
    try {
        const messages = await Message.find(); //Call the .find() method on the Message model to fetch all messages from the database
        res.json(messages); //send the fetched messages back to client as json
    } catch (error) {
        res.status(500).json({ error: errorMessages.serverError });
    }
});
//define route 
// Call this asynchronous route handler when the server receives a PUT request at '/:messageId'
router.put('/:messageId', async (req, res) => {
    try {
        const { messageId } = req.params;  // Extract the messageId parameter from the request URL
        const { text } = req.body;// Extract the 'text' property from the request body

        // Find the message by ID and update its text and updatedAt timestamp
        // { new: true } ensures the function returns the updated document
        const updatedMessage = await Message.findByIdAndUpdate(
            messageId,
            { text, updatedAt: Date.now() },
            { new: true }
        );
        // If no message was found with the given ID, return 404
        if (!updatedMessage)
            return res.status(404).json({ error: errorMessages.messageNotFound });

        // Send the updated message back to the client
        res.json(updatedMessage);
    } catch (error) {
        // If an error occurs (invalid ID, bad request), return 400
        res.status(400).json({ error: errorMessages.invalidRequest });
    }
});

//define route 
// Call this asynchronous route handler when the server receives a DELETE request at '/:messageId'
router.delete('/:messageId', async (req, res) => {
    try {
        const { messageId } = req.params; // Extract the messageId parameter from the request URL

        // Find the message by ID and delete it
        const deletedMessage = await Message.findByIdAndDelete(messageId);

        // If no message was found with the given ID, return 404
        if (!deletedMessage)
            return res.status(404).json({ error: errorMessages.messageNotFound });

        // Delete all reactions linked to this message
        await Reaction.deleteMany({ message: messageId });

        // Confirm deletion to the client
        res.json({ message: errorMessages.deleteSuccess });
    } catch (error) {
        res.status(500).json({ error: errorMessages.serverError });
    }
});

export default router;
