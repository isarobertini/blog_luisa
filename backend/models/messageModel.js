import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
    author: { type: String, required: true },
    authorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },

    // Own text (empty for reposts)
    text: { type: String, default: "" },

    likes: { type: Number, default: 0 },
    reposts: { type: Number, default: 0 },

    repost: {
        originalMessageId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Message",
        },
        repostChain: [String],
    },

    attachments: [
        {
            type: { type: String, required: true },
            url: { type: String, required: true },
        },
    ],

    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
});

export default mongoose.model("Message", messageSchema);
