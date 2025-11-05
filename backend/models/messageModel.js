import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema({
    author: { type: String, required: true, minlength: 1, maxlength: 50 },  // display name
    authorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // new: user ID
    text: { type: String, required: true, minlength: 1, maxlength: 200 },
    likes: { type: Number, default: 0 },
    reposts: { type: Number, default: 0 },
    repost: {
        originalMessageId: { type: mongoose.Schema.Types.ObjectId, ref: "Message" },
        originalAuthor: String,
        repostChain: [String],
    },
    attachments: [
        {
            type: {
                type: String, // e.g. "image", "video", "audio"
                required: true,
            },
            url: {
                type: String,
                required: true,
            },
        },
    ],
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
});

export default mongoose.model('Message', messageSchema);
